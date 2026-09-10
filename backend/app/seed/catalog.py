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
            license_pool=row.get("license_pool") or 500,
            licenses_issued=0,
            drop_label="Drop 01 — 2026",
            gender=row.get("gender"),
            active=True,
            sort=row.get("sort") or 0,
        )
        session.add(p)
    for row in REVIEWS:
        session.add(Review(**row, verified=row.get("source") != "studio_preview"))
    await session.commit()


async def upsert_missing(session: AsyncSession) -> None:
    col_ids = {c.slug: c.id for c in (await session.execute(select(Collection))).scalars().all()}
    if not col_ids:
        return
    for row in PRODUCTS:
        exists = await session.scalar(select(Product.id).where(Product.sku == row["sku"]))
        if exists:
            continue
        collection_id = col_ids.get(row["collection"])
        if not collection_id:
            continue
        session.add(
            Product(
                sku=row["sku"],
                slug=row["slug"],
                collection_id=collection_id,
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
                license_pool=row.get("license_pool") or 500,
                licenses_issued=0,
                drop_label="Drop 01 — 2026",
                gender=row.get("gender"),
                active=True,
                sort=row.get("sort") or 0,
            )
        )
    for row in REVIEWS:
        exists = await session.scalar(
            select(Review.id).where(Review.product_sku == row["product_sku"], Review.title == row["title"])
        )
        if exists:
            continue
        session.add(Review(**{k: v for k, v in row.items()}, verified=row.get("source") != "studio_preview"))
    await session.commit()


async def seed_catalog(session: AsyncSession) -> None:
    await seed_if_empty(session)
    await upsert_missing(session)
