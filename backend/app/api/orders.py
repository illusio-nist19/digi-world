from time import time

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.db import get_db
from app.models import Order
from app.schemas import OrderCreate, UpsellCreate
from app.services.email import send_order_email
from app.services.orders import add_upsell, after_order, client_ip, create_order, pick_upsell, serialize_order
from app.services.pricing import PriceError

router = APIRouter(prefix="/orders", tags=["orders"])
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
async def create(data: OrderCreate, request: Request, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)) -> dict:
    ip = client_ip(dict(request.headers), request.client.host if request.client else None) or "0.0.0.0"
    rate_limit(ip)
    ua = data.user_agent or request.headers.get("user-agent")
    try:
        order = await create_order(db, data, ip, ua)
    except PriceError as exc:
        raise HTTPException(400, str(exc)) from exc
    bg.add_task(after_order, order, data.event_source_url, True)
    bg.add_task(send_order_email, order.email, order.public_id, order.locale)
    upsell = await pick_upsell(db, order)
    payload = await serialize_order(order)
    if upsell:
        product, cents = upsell
        payload["upsell"] = {
            "sku": product.sku,
            "slug": product.slug,
            "name": product.name,
            "sub": product.sub,
            "image": (product.images or [None])[0],
            "price_cents": cents,
            "compare_cents": product.price_cents if product.type != "vault" else 9700,
        }
    else:
        payload["upsell"] = None
    return payload


@router.post("/{public_id}/upsell")
async def upsell(public_id: str, data: UpsellCreate, request: Request, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)) -> dict:
    ip = client_ip(dict(request.headers), request.client.host if request.client else None) or "0.0.0.0"
    rate_limit(ip)
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "not found")
    try:
        order = await add_upsell(db, public_id, data, order.locale)
    except PriceError as exc:
        raise HTTPException(400, str(exc)) from exc
    last = next((i for i in order.items if i.is_upsell), None)
    from app.services import capi

    async def send() -> None:
        await capi.fanout(
            "Purchase",
            data.event_id,
            {
                "name": order.name,
                "email": order.email,
                "ip": ip,
                "user_agent": data.user_agent or request.headers.get("user-agent"),
                "event_source_url": data.event_source_url,
                "currency": "USD",
                "value": (last.unit_price_cents / 100) if last else 0,
                "contents": [{"id": last.sku, "quantity": 1, "item_price": last.unit_price_cents / 100}] if last else [],
                "order_id": order.public_id,
                **(order.attribution or {}),
            },
        )
        from app.services.sheet import post_sheet
        from app.services.orders import order_sheet_payload

        await post_sheet(order_sheet_payload(order))

    bg.add_task(send)
    return await serialize_order(order)


@router.get("/{public_id}")
async def get_order(public_id: str, db: AsyncSession = Depends(get_db)) -> dict:
    q = await db.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise HTTPException(404, "not found")
    return await serialize_order(order)
