from __future__ import annotations

import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Collection, Product, Review
from app.seed.catalog_data import COLLECTIONS, PRODUCTS, REVIEWS

log = logging.getLogger("dw.seed")


def _fill_product(p: Product, row: dict, collection_id: int) -> None:
    p.sku = row["sku"]
    p.slug = row["slug"]
    p.collection_id = collection_id
    p.type = row["type"]
    p.serial = row.get("serial")
    p.name = row["name"]
    p.sub = row["sub"]
    p.headline = row["headline"]
    p.description = row["description"]
    p.contents = row["contents"]
    p.faq = row["faq"]
    p.images = row["images"]
    p.price_cents = row["price_cents"]
    p.compare_cents = row.get("compare_cents")
    p.duo_price_cents = row.get("duo_price_cents")
    p.pair_sku = row.get("pair_sku")
    p.pair_price_cents = row.get("pair_price_cents")
    p.upsell_sku = row.get("upsell_sku")
    p.upsell_price_cents = row.get("upsell_price_cents")
    p.cross_sell = row.get("cross_sell") or []
    p.includes = row.get("includes")
    p.license_pool = row.get("license_pool") or 500
    p.drop_label = "Drop 01 — 2026"
    p.gender = row.get("gender")
    p.active = True
    p.sort = row.get("sort") or 0


async def upsert_collections(session: AsyncSession) -> dict[str, int]:
    existing = {c.slug: c for c in (await session.execute(select(Collection))).scalars().all()}
    for row in COLLECTIONS:
        col = existing.get(row["slug"])
        if col is None:
            col = Collection(slug=row["slug"])
            session.add(col)
            existing[row["slug"]] = col
        col.name = row["name"]
        col.sub = row["sub"]
        col.image = row["image"]
        col.sort = row["sort"]
    await session.flush()
    return {slug: col.id for slug, col in existing.items()}


async def upsert_products(session: AsyncSession, col_ids: dict[str, int]) -> list[str]:
    existing = {p.sku: p for p in (await session.execute(select(Product))).scalars().all()}
    new_skus: list[str] = []
    for row in PRODUCTS:
        collection_id = col_ids.get(row["collection"])
        if not collection_id:
            log.warning("skip %s: missing collection %s", row["sku"], row["collection"])
            continue
        product = existing.get(row["sku"])
        if product is None:
            product = Product(sku=row["sku"], licenses_issued=0)
            session.add(product)
            new_skus.append(row["sku"])
        _fill_product(product, row, collection_id)
    await session.flush()
    return new_skus


async def upsert_reviews(session: AsyncSession) -> None:
    existing = {
        (r.product_sku, r.title): r for r in (await session.execute(select(Review))).scalars().all()
    }
    for row in REVIEWS:
        key = (row["product_sku"], row["title"])
        review = existing.get(key)
        if review is None:
            session.add(Review(**row, verified=row.get("source") != "studio_preview"))
            continue
        review.locale = row["locale"]
        review.stars = row["stars"]
        review.body = row["body"]
        review.display_name = row["display_name"]
        review.city_country = row["city_country"]
        review.source = row.get("source") or "studio_preview"
        review.verified = row.get("source") != "studio_preview"


async def prune_removed(session: AsyncSession) -> None:
    keep_skus = {row["sku"] for row in PRODUCTS}
    products = (await session.execute(select(Product))).scalars().all()
    for product in products:
        if product.sku not in keep_skus:
            await session.delete(product)
    keep_reviews = {(row["product_sku"], row["title"]) for row in REVIEWS}
    reviews = (await session.execute(select(Review))).scalars().all()
    for review in reviews:
        if (review.product_sku, review.title) not in keep_reviews:
            await session.delete(review)


async def seed_catalog(session: AsyncSession) -> list[str]:
    col_ids = await upsert_collections(session)
    new_skus = await upsert_products(session, col_ids)
    await upsert_reviews(session)
    await prune_removed(session)
    await session.commit()
    skus = [row["sku"] for row in PRODUCTS]
    log.info("catalog ready skus=%s new=%s", skus, new_skus)
    return new_skus
