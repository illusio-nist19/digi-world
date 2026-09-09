from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Collection, Product, Review
from app.seed.catalog_data import COLLECTIONS, PRODUCTS, REVIEWS


async def seed_if_empty(session: AsyncSession) -> None:
    existing = await session.scalar(select(Product.id).limit(1))
    if existing:
        return
    col_ids: dict[str, int] = {}
    for row in COLLECTIONS:
        c = Collection(
            slug=row["slug"],
            name=row["name"],
            sub=row["sub"],
            image=row["image"],
            sort=row["sort"],
        )
        session.add(c)
        await session.flush()
        col_ids[row["slug"]] = c.id
    for row in PRODUCTS:
        p = Product(
            sku=row["sku"],
            slug=row["slug"],
            collection_id=col_ids[row["collection"]],
            type=row["type"],
            serial=row.get("serial"),
            name=row["name"],
            sub=row["sub"],
            headline=row["headline"],
            description=row["description"],
            contents=row["contents"],
            faq=row["faq"],
            images=row["images"],
            price_cents=row["price_cents"],
            compare_cents=row.get("compare_cents"),
            duo_price_cents=row.get("duo_price_cents"),
            pair_sku=row.get("pair_sku"),
            pair_price_cents=row.get("pair_price_cents"),
            upsell_sku=row.get("upsell_sku"),
            upsell_price_cents=row.get("upsell_price_cents"),
            cross_sell=row.get("cross_sell") or [],
            includes=row.get("includes"),
            license_pool=500,
            licenses_issued=0,
            drop_label="Drop 01 — 2026",
            gender=row.get("gender"),
            active=True,
            sort=row.get("sort") or 0,
        )
        session.add(p)
    for row in REVIEWS:
        session.add(Review(**row, verified=True))
    await session.commit()
