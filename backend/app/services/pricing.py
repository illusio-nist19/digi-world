from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Product


class PriceError(ValueError):
    pass


@dataclass
class PricedLine:
    sku: str
    slug: str
    offer_id: str
    name: str
    qty: int
    unit_price_cents: int
    is_upsell: bool = False
    extra: dict | None = None


def loc_name(product: Product, locale: str) -> str:
    names = product.name or {}
    return names.get(locale) or names.get("en") or product.slug


async def get_product(session: AsyncSession, sku_or_slug: str) -> Product | None:
    q = await session.execute(
        select(Product).where((Product.sku == sku_or_slug) | (Product.slug == sku_or_slug))
    )
    return q.scalar_one_or_none()


async def price_item(session: AsyncSession, sku: str, offer_id: str, locale: str) -> list[PricedLine]:
    product = await get_product(session, sku)
    if not product or not product.active:
        raise PriceError(f"unknown sku {sku}")

    if product.type == "addon":
        if offer_id not in ("addon", "solo"):
            offer_id = "addon"
        return [
            PricedLine(
                sku=product.sku,
                slug=product.slug,
                offer_id="addon",
                name=loc_name(product, locale),
                qty=1,
                unit_price_cents=product.price_cents,
            )
        ]

    if product.type == "vault":
        oid = "vault_duo" if offer_id == "vault_duo" else "vault"
        cents = (product.duo_price_cents or 14900) if oid == "vault_duo" else product.price_cents
        return [
            PricedLine(
                sku=product.sku,
                slug=product.slug,
                offer_id=oid,
                name=loc_name(product, locale),
                qty=1,
                unit_price_cents=cents,
                extra={"licenses": 2 if oid == "vault_duo" else 1},
            )
        ]

    if offer_id == "duo":
        return [
            PricedLine(
                sku=product.sku,
                slug=product.slug,
                offer_id="duo",
                name=f"{loc_name(product, locale)} · Duo",
                qty=1,
                unit_price_cents=product.duo_price_cents or product.price_cents,
                extra={"licenses": 2},
            )
        ]

    if offer_id == "pair":
        if not product.pair_sku:
            raise PriceError("no pair mapping")
        pair = await get_product(session, product.pair_sku)
        if not pair:
            raise PriceError("pair missing")
        total = product.pair_price_cents or 3400
        primary = product.price_cents
        secondary = total - primary
        if secondary < 0:
            secondary = 0
        return [
            PricedLine(
                sku=product.sku,
                slug=product.slug,
                offer_id="pair",
                name=loc_name(product, locale),
                qty=1,
                unit_price_cents=primary,
                extra={"pair": True},
            ),
            PricedLine(
                sku=pair.sku,
                slug=pair.slug,
                offer_id="pair",
                name=loc_name(pair, locale),
                qty=1,
                unit_price_cents=secondary,
                extra={"pair": True, "pair_of": product.sku},
            ),
        ]

    return [
        PricedLine(
            sku=product.sku,
            slug=product.slug,
            offer_id="solo",
            name=loc_name(product, locale),
            qty=1,
            unit_price_cents=product.price_cents,
        )
    ]


def licenses_for(lines: list[PricedLine]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for line in lines:
        if line.offer_id == "duo":
            counts[line.sku] = counts.get(line.sku, 0) + 2
        elif line.offer_id in ("vault", "vault_duo"):
            counts[line.sku] = counts.get(line.sku, 0) + (2 if line.offer_id == "vault_duo" else 1)
        else:
            counts[line.sku] = counts.get(line.sku, 0) + line.qty
    return counts
