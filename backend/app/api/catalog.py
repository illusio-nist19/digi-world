from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db import get_db
from app.models import Collection, Product, Review

router = APIRouter(prefix="/catalog", tags=["catalog"])


def dump_product(p: Product) -> dict:
    return {
        "sku": p.sku,
        "slug": p.slug,
        "type": p.type,
        "serial": p.serial,
        "collection": p.collection.slug if p.collection else None,
        "name": p.name,
        "sub": p.sub,
        "headline": p.headline,
        "description": p.description,
        "contents": p.contents,
        "faq": p.faq,
        "images": p.images,
        "price_cents": p.price_cents,
        "compare_cents": p.compare_cents,
        "duo_price_cents": p.duo_price_cents,
        "pair_sku": p.pair_sku,
        "pair_price_cents": p.pair_price_cents,
        "upsell_sku": p.upsell_sku,
        "upsell_price_cents": p.upsell_price_cents,
        "cross_sell": p.cross_sell,
        "includes": p.includes,
        "license_pool": p.license_pool,
        "licenses_issued": p.licenses_issued,
        "drop_label": p.drop_label,
        "gender": p.gender,
        "sort": p.sort,
    }


@router.get("")
async def catalog(db: AsyncSession = Depends(get_db)) -> dict:
    cols = (await db.execute(select(Collection).order_by(Collection.sort))).scalars().all()
    products = (
        await db.execute(select(Product).options(selectinload(Product.collection)).where(Product.active.is_(True)).order_by(Product.sort))
    ).scalars().all()
    reviews = (await db.execute(select(Review))).scalars().all()
    issued = await db.scalar(select(func.coalesce(func.sum(Product.licenses_issued), 0)))
    return {
        "drop": "Drop 01 — 2026",
        "currency": "USD",
        "licenses_issued": int(issued or 0),
        "collections": [
            {"slug": c.slug, "name": c.name, "sub": c.sub, "image": c.image, "sort": c.sort} for c in cols
        ],
        "products": [dump_product(p) for p in products],
        "reviews": [
            {
                "product_sku": r.product_sku,
                "locale": r.locale,
                "stars": r.stars,
                "title": r.title,
                "body": r.body,
                "display_name": r.display_name,
                "city_country": r.city_country,
                "verified": r.verified,
                "source": r.source,
            }
            for r in reviews
        ],
        "offers": {
            "solo": 1900,
            "duo": 2900,
            "pair": 3400,
            "addon": 1200,
            "vault": 9700,
            "vault_duo": 14900,
            "upsell_system": 1100,
            "upsell_addon": 900,
            "upsell_vault": 6700,
        },
    }


@router.get("/products/{slug}")
async def product(slug: str, db: AsyncSession = Depends(get_db)) -> dict:
    p = (
        await db.execute(
            select(Product).options(selectinload(Product.collection)).where((Product.slug == slug) | (Product.sku == slug))
        )
    ).scalar_one_or_none()
    if not p:
        from fastapi import HTTPException

        raise HTTPException(404, "not found")
    reviews = (await db.execute(select(Review).where(Review.product_sku == p.sku))).scalars().all()
    return {
        "product": dump_product(p),
        "reviews": [
            {
                "product_sku": r.product_sku,
                "locale": r.locale,
                "stars": r.stars,
                "title": r.title,
                "body": r.body,
                "display_name": r.display_name,
                "city_country": r.city_country,
            }
            for r in reviews
        ],
    }
