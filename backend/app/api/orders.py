from time import time

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.db import get_db
from app.models import Order
from app.schemas import OrderCreate, UpsellCreate
from app.services.orders import add_upsell, client_ip, create_order
from app.services.payments import (
    confirm_session,
    create_checkout_session,
    mark_paid,
    parse_webhook,
    payments_ready,
    serialize_paid,
)
from app.services.pricing import PriceError
from app.services.vault import VAULT_FILES, file_response

router = APIRouter(prefix="/orders", tags=["orders"])
hooks = APIRouter(tags=["webhooks"])
_hits: dict[str, list[float]] = {}


def rate_limit(ip: str) -> None:
    window = 60
    limit = get_settings().checkout_rate_per_min
    now = time()
    bucket = [t for t in _hits.get(ip, []) if now - t < window]
    if len(bucket) >= limit:
        raise HTTPException(429, "slow down")
    bucket.append(now)
    _hits[ip] = bucket


@router.post("")
async def create(
    data: OrderCreate,
    request: Request,
    bg: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> dict:
    ip = client_ip(dict(request.headers), request.client.host if request.client else None) or "0.0.0.0"
    rate_limit(ip)
    ua = data.user_agent or request.headers.get("user-agent")
    settings = get_settings()
    mode = (settings.checkout_mode or "lead").strip().lower()
    if mode == "stripe" and not payments_ready():
        raise HTTPException(503, "payments not configured")
    try:
        order = await create_order(db, data, ip, ua)
    except PriceError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        import logging

        logging.getLogger("dw.orders").exception("create_order failed: %s", exc)
        # One retry after forcing schema patches (missing columns on old DBs).
        try:
            from app.db import engine
            from app.schema_ensure import ensure_schema

            await ensure_schema(engine)
            await db.rollback()
            order = await create_order(db, data, ip, ua)
        except PriceError as exc2:
            raise HTTPException(400, str(exc2)) from exc2
        except Exception as exc2:  # noqa: BLE001
            logging.getLogger("dw.orders").exception("create_order retry failed: %s", exc2)
            raise HTTPException(500, f"order create failed: {type(exc2).__name__}: {exc2}") from exc2

    # Lead / non-Stripe: unlock vault after name+email (no card step).
    if mode != "stripe":
        email_ok = False
        try:
            if order.status != "paid":
                order = await mark_paid(db, order, None, send_email=False)
            from app.services.email import send_order_email

            # Await Resend so the UI never claims "sent" when delivery failed.
            email_ok = await send_order_email(order)
            if not email_ok:
                bg.add_task(_safe_send_order_email, order.id)
        except Exception as exc:  # noqa: BLE001
            import logging

            logging.getLogger("dw.orders").exception("lead fulfill failed: %s", exc)
            try:
                await db.rollback()
            except Exception:  # noqa: BLE001
                pass
            q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order.id))
            order = q.scalar_one()
            # Best-effort token so thank-you still works.
            try:
                order = await mark_paid(db, order, None, send_email=False)
            except Exception:  # noqa: BLE001
                logging.getLogger("dw.orders").exception("lead fulfill retry failed")
            bg.add_task(_safe_send_order_email, order.id)
        payload = serialize_paid(order)
        payload["checkout_url"] = None
        payload["checkout_mode"] = mode
        payload["upsell"] = None
        payload["email_sent"] = bool(email_ok)
        return payload

    if order.status == "paid":
        payload = serialize_paid(order)
        payload["checkout_url"] = None
        payload["checkout_mode"] = mode
        payload["upsell"] = None
        return payload
    try:
        checkout_url = await create_checkout_session(order)
        await db.commit()
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(502, "could not open payment") from exc
    payload = serialize_paid(order)
    payload["checkout_url"] = checkout_url
    payload["checkout_mode"] = mode
    payload["upsell"] = None
    return payload


async def _safe_send_order_email(order_id: str) -> None:
    from app.db import SessionLocal
    from app.services.email import send_order_email

    try:
        async with SessionLocal() as session:
            q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order_id))
            order = q.scalar_one_or_none()
            if order:
                await send_order_email(order)
    except Exception as exc:  # noqa: BLE001
        import logging

        logging.getLogger("dw.orders").warning("background email failed: %s", exc)


@router.post("/{public_id}/confirm")
async def confirm(
    public_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict:
    body = {}
    try:
        body = await request.json()
    except Exception:  # noqa: BLE001
        body = {}
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "not found")
    session_id = (body or {}).get("session_id") or request.query_params.get("session_id")
    order = await confirm_session(db, order, session_id)
    return serialize_paid(order)


@router.get("/{public_id}/file/{sku}")
async def download(public_id: str, sku: str, token: str, db: AsyncSession = Depends(get_db)):
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order or order.status != "paid":
        raise HTTPException(402, "payment required")
    pay = (order.attribution or {}).get("pay") or {}
    if not token or token != pay.get("download_token"):
        raise HTTPException(403, "bad token")
    if sku not in {i.sku for i in order.items} or sku not in VAULT_FILES:
        raise HTTPException(404, "file not on this order")
    return file_response(sku)


@router.post("/{public_id}/upsell")
async def upsell(public_id: str, data: UpsellCreate, request: Request, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)) -> dict:
    ip = client_ip(dict(request.headers), request.client.host if request.client else None) or "0.0.0.0"
    rate_limit(ip)
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "not found")
    if order.status != "paid":
        raise HTTPException(402, "payment required")
    try:
        order = await add_upsell(db, public_id, data, order.locale)
    except PriceError as exc:
        raise HTTPException(400, str(exc)) from exc
    return serialize_paid(order)


@router.get("/{public_id}")
async def get_order(public_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "not found")
    return serialize_paid(order)


@hooks.post("/webhooks/stripe")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)) -> dict:
    payload = await request.body()
    event = parse_webhook(payload, request.headers.get("stripe-signature"))
    etype = event["type"] if isinstance(event, dict) else getattr(event, "type", "")
    if etype not in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
        return {"ok": True}
    data = event["data"] if isinstance(event, dict) else event.data
    session = data["object"] if isinstance(data, dict) else data.object
    status = session.get("payment_status") if hasattr(session, "get") else getattr(session, "payment_status", None)
    if status != "paid":
        return {"ok": True}
    meta = session.get("metadata") if hasattr(session, "get") else getattr(session, "metadata", None) or {}
    public_id = (meta or {}).get("public_id") or (
        session.get("client_reference_id") if hasattr(session, "get") else getattr(session, "client_reference_id", None)
    )
    if not public_id:
        return {"ok": True}
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        return {"ok": True}
    await mark_paid(db, order, session.get("id") if hasattr(session, "get") else getattr(session, "id", None))
    return {"ok": True}
