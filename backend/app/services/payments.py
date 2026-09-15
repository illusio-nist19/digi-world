from __future__ import annotations

import logging
import secrets
from datetime import datetime, timezone

import stripe
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from sqlalchemy.orm.attributes import flag_modified

from app.config import get_settings
from app.models import Order
from app.services.email import send_order_email
from app.services.pricing import PricedLine

log = logging.getLogger("dw.pay")


def payments_ready() -> bool:
    return bool(get_settings().stripe_secret_key)


def _stripe() -> None:
    key = get_settings().stripe_secret_key
    if not key:
        raise HTTPException(503, "payments not configured")
    stripe.api_key = key


def _attr(order: Order) -> dict:
    data = dict(order.attribution or {})
    pay = dict(data.get("pay") or {})
    data["pay"] = pay
    return data


def download_token(order: Order) -> str | None:
    pay = (order.attribution or {}).get("pay") or {}
    return pay.get("download_token") if order.status == "paid" else None


async def create_checkout_session(order: Order) -> str:
    _stripe()
    settings = get_settings()
    locale = order.locale if order.locale in {"ar", "en", "fr", "es"} else "en"
    base = settings.store_url.rstrip("/")
    names = " · ".join(i.name for i in order.items) or "Digi World system"
    session = stripe.checkout.Session.create(
        mode="payment",
        customer_email=order.email,
        client_reference_id=order.public_id,
        success_url=f"{base}/{locale}/thank-you?order={order.public_id}&session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{base}/{locale}?pay=cancel",
        line_items=[
            {
                "quantity": 1,
                "price_data": {
                    "currency": "usd",
                    "unit_amount": order.total_cents,
                    "product_data": {
                        "name": names,
                        "description": "Instant digital vault after payment. One studio licence.",
                    },
                },
            }
        ],
        metadata={"public_id": order.public_id},
        payment_intent_data={"metadata": {"public_id": order.public_id}},
    )
    if not session.url:
        raise HTTPException(502, "stripe session missing url")
    attr = _attr(order)
    attr["pay"]["stripe_session_id"] = session.id
    order.attribution = attr
    flag_modified(order, "attribution")
    return session.url


async def mark_paid(session: AsyncSession, order: Order, stripe_session_id: str | None) -> Order:
    if order.status == "paid":
        return order
    attr = _attr(order)
    pay = attr["pay"]
    pay["stripe_session_id"] = stripe_session_id or pay.get("stripe_session_id")
    pay["paid_at"] = datetime.now(timezone.utc).isoformat()
    if not pay.get("download_token"):
        pay["download_token"] = secrets.token_urlsafe(24)
    order.attribution = attr
    flag_modified(order, "attribution")
    order.status = "paid"
    if not pay.get("licenses_bumped"):
        from app.services.orders import bump_licenses

        lines = [
            PricedLine(
                sku=i.sku,
                slug=i.sku,
                offer_id=i.offer_id,
                name=i.name,
                qty=i.qty,
                unit_price_cents=i.unit_price_cents,
                is_upsell=i.is_upsell,
                extra=i.extra or {},
            )
            for i in order.items
        ]
        await bump_licenses(session, lines)
        pay["licenses_bumped"] = True
        order.attribution = attr
        flag_modified(order, "attribution")
    await session.commit()
    q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order.id))
    order = q.scalar_one()
    try:
        await send_order_email(order.email, order.public_id, order.locale)
    except Exception as exc:  # noqa: BLE001
        log.warning("email after pay: %s", exc)
    try:
        from app.services.orders import after_order

        await after_order(order, (order.attribution or {}).get("landing_page"), True)
    except Exception as ext:  # noqa: BLE001
        log.warning("after pay: %s", ext)
    return order


async def confirm_session(session: AsyncSession, order: Order, session_id: str | None) -> Order:
    if order.status == "paid":
        return order
    _stripe()
    sid = session_id or ((order.attribution or {}).get("pay") or {}).get("stripe_session_id")
    if not sid:
        raise HTTPException(400, "missing session")
    checkout = stripe.checkout.Session.retrieve(sid)
    ref = getattr(checkout, "client_reference_id", None)
    if ref and ref != order.public_id:
        raise HTTPException(400, "session mismatch")
    if getattr(checkout, "payment_status", None) != "paid":
        return order
    return await mark_paid(session, order, checkout.id)


def parse_webhook(payload: bytes, signature: str | None):
    secret = get_settings().stripe_webhook_secret
    if not secret:
        raise HTTPException(503, "webhook not configured")
    if not signature:
        raise HTTPException(400, "no signature")
    try:
        return stripe.Webhook.construct_event(payload, signature, secret)
    except Exception as exc:  # noqa: BLE001
        log.warning("stripe webhook reject: %s", exc)
        raise HTTPException(400, "invalid webhook") from exc


def serialize_paid(order: Order) -> dict:
    from app.services.orders import serialize_order

    data = serialize_order(order)
    token = download_token(order)
    data["paid"] = order.status == "paid"
    data["downloads"] = []
    if token:
        for item in order.items:
            data["downloads"].append(
                {
                    "sku": item.sku,
                    "name": item.name,
                    "url": f"/orders/{order.public_id}/file/{item.sku}?token={token}",
                }
            )
    return data
