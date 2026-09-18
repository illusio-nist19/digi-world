from __future__ import annotations

import logging
import secrets
from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.models import Order, OrderItem, Product, TrackingEvent
from app.schemas import OrderCreate, UpsellCreate
from app.services import capi, sheet
from app.services.pricing import PriceError, PricedLine, get_product, licenses_for, loc_name, price_item

log = logging.getLogger("dw.orders")
FALLBACK_UPSELL = [("launch-sprint", 900), ("the-vault", 6700)]


def make_public_id() -> str:
    return "DW-2026-" + secrets.token_hex(3).upper()


def client_ip(headers: dict[str, str], fallback: str | None) -> str | None:
    forwarded = headers.get("x-forwarded-for") or headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return fallback


def lines_to_contents(lines: list[PricedLine]) -> list[dict]:
    return [
        {
            "id": ln.sku,
            "content_id": ln.sku,
            "quantity": ln.qty,
            "item_price": ln.unit_price_cents / 100,
            "price": ln.unit_price_cents / 100,
            "content_name": ln.name,
        }
        for ln in lines
    ]


def order_sheet_payload(order: Order) -> dict:
    attr = order.attribution or {}
    items = [
        {
            "sku": i.sku,
            "offer_id": i.offer_id,
            "name": i.name,
            "qty": i.qty,
            "unit_price": i.unit_price_cents / 100,
            "is_upsell": i.is_upsell,
        }
        for i in order.items
    ]
    upsell = next((i for i in order.items if i.is_upsell), None)
    return {
        "type": "order",
        "order_id": order.public_id,
        "created_at": (order.created_at or datetime.now(timezone.utc)).isoformat(),
        "status": order.status,
        "customer_name": order.name,
        "customer_email": order.email,
        "locale": order.locale,
        "currency": order.currency,
        "subtotal": order.subtotal_cents / 100,
        "discount": order.discount_cents / 100,
        "upsell_total": order.upsell_cents / 100,
        "grand_total": order.total_cents / 100,
        "items_json": items,
        "offer_types": ",".join(sorted({i.offer_id for i in order.items})),
        "upsell_sku": upsell.sku if upsell else "",
        "upsell_accepted": bool(upsell),
        "source": attr.get("utm_source") or "direct",
        "utm_source": attr.get("utm_source") or "",
        "utm_medium": attr.get("utm_medium") or "",
        "utm_campaign": attr.get("utm_campaign") or "",
        "utm_content": attr.get("utm_content") or "",
        "utm_term": attr.get("utm_term") or "",
        "fbclid": attr.get("fbclid") or "",
        "ttclid": attr.get("ttclid") or "",
        "sccid": attr.get("sc_click_id") or "",
        "fbp": attr.get("fbp") or "",
        "fbc": attr.get("fbc") or "",
        "landing_page": attr.get("landing_page") or "",
        "referrer": attr.get("referrer") or "",
        "user_agent": order.user_agent or "",
        "ip": order.ip or "",
        "event_id_purchase": order.event_id_purchase or "",
        "event_id_lead": order.event_id_lead or "",
        "checkout_mode": order.checkout_mode,
        "notes": "",
    }


async def bump_licenses(session: AsyncSession, lines: list[PricedLine]) -> None:
    counts = licenses_for(lines)
    for sku, n in counts.items():
        product = await get_product(session, sku)
        if product:
            extra = 8 if product.type == "vault" else n
            product.licenses_issued = (product.licenses_issued or 0) + extra


async def create_order(session: AsyncSession, data: OrderCreate, ip: str | None, ua: str | None) -> Order:
    settings = get_settings()
    existing = await session.scalar(select(Order).where(Order.client_order_id == data.client_order_id))
    if existing:
        q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == existing.id))
        return q.scalar_one()

    lines: list[PricedLine] = []
    for item in data.items:
        lines.extend(await price_item(session, item.sku, item.offer_id, data.locale))
    if not lines:
        raise PriceError("empty cart")
    subtotal = sum(ln.unit_price_cents * ln.qty for ln in lines)
    order = Order(
        id=str(uuid4()),
        public_id=make_public_id(),
        client_order_id=data.client_order_id,
        status="pending_payment" if (settings.checkout_mode or "").lower() == "stripe" else "lead",
        name=data.name.strip(),
        email=str(data.email).lower(),
        locale=data.locale,
        currency="USD",
        subtotal_cents=subtotal,
        discount_cents=0,
        upsell_cents=0,
        total_cents=subtotal,
        attribution=data.attribution.model_dump(),
        user_agent=ua or data.user_agent,
        ip=ip,
        event_id_purchase=data.event_id,
        event_id_lead=data.event_id_lead,
        checkout_mode=settings.checkout_mode,
    )
    session.add(order)
    await session.flush()
    for ln in lines:
        session.add(
            OrderItem(
                order_id=order.id,
                sku=ln.sku,
                offer_id=ln.offer_id,
                name=ln.name,
                qty=ln.qty,
                unit_price_cents=ln.unit_price_cents,
                is_upsell=False,
                extra=ln.extra or {},
            )
        )
    await session.commit()
    q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order.id))
    return q.scalar_one()


async def pick_upsell(session: AsyncSession, order: Order) -> tuple[Product, int] | None:
    owned = {i.sku for i in order.items}
    first = next((i for i in order.items if not i.is_upsell), None)
    if first:
        src = await get_product(session, first.sku)
        if src and src.upsell_sku and src.upsell_sku not in owned:
            up = await get_product(session, src.upsell_sku)
            if up:
                return up, src.upsell_price_cents or up.upsell_price_cents or 1100
    for slug, cents in FALLBACK_UPSELL:
        p = await get_product(session, slug)
        if p and p.sku not in owned:
            return p, cents
    return None


async def add_upsell(session: AsyncSession, public_id: str, data: UpsellCreate, locale: str) -> Order:
    q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.public_id == public_id))
    order = q.scalar_one_or_none()
    if not order:
        raise PriceError("order not found")
    picked = await pick_upsell(session, order)
    if not picked:
        raise PriceError("no upsell")
    product, cents = picked
    if data.sku:
        wanted = await get_product(session, data.sku)
        if wanted and wanted.sku == product.sku:
            product = wanted
    session.add(
        OrderItem(
            order_id=order.id,
            sku=product.sku,
            offer_id="solo",
            name=loc_name(product, locale),
            qty=1,
            unit_price_cents=cents,
            is_upsell=True,
            extra={"discount_reason": "post_purchase_upsell"},
        )
    )
    list_price = product.price_cents if product.type != "vault" else 9700
    order.discount_cents += max(list_price - cents, 0)
    order.upsell_cents += cents
    order.total_cents += cents
    order.status = "confirmed"
    await bump_licenses(session, [
        PricedLine(sku=product.sku, slug=product.slug, offer_id="solo", name=product.slug, qty=1, unit_price_cents=cents, is_upsell=True)
    ])
    await session.commit()
    q = await session.execute(select(Order).options(selectinload(Order.items)).where(Order.id == order.id))
    return q.scalar_one()


def serialize_order(order: Order) -> dict:
    return {
        "order_id": order.id,
        "public_id": order.public_id,
        "status": order.status,
        "email": order.email,
        "name": order.name,
        "locale": order.locale,
        "currency": order.currency,
        "subtotal": order.subtotal_cents / 100,
        "discount": order.discount_cents / 100,
        "upsell_total": order.upsell_cents / 100,
        "total": order.total_cents / 100,
        "items": [
            {
                "sku": i.sku,
                "offer_id": i.offer_id,
                "name": i.name,
                "qty": i.qty,
                "unit_price": i.unit_price_cents / 100,
                "is_upsell": i.is_upsell,
            }
            for i in order.items
        ],
        "created_at": order.created_at.isoformat() if order.created_at else None,
    }


async def after_order(order: Order, event_source_url: str | None, purchase: bool = True) -> None:
    payload = {
        "name": order.name,
        "email": order.email,
        "ip": order.ip,
        "user_agent": order.user_agent,
        "event_source_url": event_source_url,
        "currency": "USD",
        "value": order.total_cents / 100,
        "contents": [
            {"id": i.sku, "quantity": i.qty, "item_price": i.unit_price_cents / 100, "content_name": i.name}
            for i in order.items
        ],
        "order_id": order.public_id,
        "fbp": (order.attribution or {}).get("fbp"),
        "fbc": (order.attribution or {}).get("fbc"),
        "ttclid": (order.attribution or {}).get("ttclid"),
        "ttp": (order.attribution or {}).get("ttp"),
        "sc_click_id": (order.attribution or {}).get("sc_click_id"),
        "sc_cookie1": (order.attribution or {}).get("sc_cookie1"),
        "referrer": (order.attribution or {}).get("referrer"),
        "consent": (order.attribution or {}).get("consent"),
    }
    platforms = {}
    if purchase and order.event_id_purchase:
        platforms = await capi.fanout("Purchase", order.event_id_purchase, payload)
    if order.event_id_lead:
        lead_payload = {**payload, "value": 0}
        await capi.fanout("Lead", order.event_id_lead, lead_payload)
    try:
        await sheet.post_sheet(order_sheet_payload(order))
    except Exception as exc:  # noqa: BLE001
        log.warning("sheet: %s", exc)
    log.info("order %s platforms %s", order.public_id, platforms)


async def record_track(session: AsyncSession, event_id: str, event_name: str, platforms: dict, order_id: str | None = None) -> None:
    exists = await session.scalar(select(TrackingEvent.id).where(TrackingEvent.event_id == event_id))
    if exists:
        return
    session.add(
        TrackingEvent(
            event_id=event_id,
            event_name=event_name,
            order_id=order_id,
            payload_redacted={"event": event_name},
            platforms=platforms,
        )
    )
    await session.commit()
