from __future__ import annotations

from hmac import compare_digest
from secrets import token_urlsafe

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.db import get_db
from app.models import Product, SocialAnnouncement
from app.schemas import SocialAnnounceIn, TikTokExchangeIn
from app.services.social import (
    PLATFORMS,
    announce_sku,
    caption_for,
    configured,
    exchange_tiktok_code,
    loc,
    product_url,
    public_image,
    tiktok_login_url,
    tiktok_status,
)

router = APIRouter(prefix="/admin", tags=["admin"])


async def require_admin(
    authorization: str | None = Header(default=None),
    x_admin_token: str | None = Header(default=None),
) -> None:
    token_cfg = get_settings().admin_token
    if not token_cfg:
        raise HTTPException(503, "admin not configured")
    offered = ""
    if authorization and authorization.lower().startswith("bearer "):
        offered = authorization[7:].strip()
    elif x_admin_token:
        offered = x_admin_token.strip()
    if not offered or not compare_digest(offered, token_cfg):
        raise HTTPException(401, "unauthorized")


@router.get("/social")
async def social_status(_auth: None = Depends(require_admin), db: AsyncSession = Depends(get_db)) -> dict:
    s = get_settings()
    products = (
        await db.execute(select(Product).options(selectinload(Product.collection)).where(Product.active.is_(True)).order_by(Product.sort))
    ).scalars().all()
    rows = (await db.execute(select(SocialAnnouncement).order_by(SocialAnnouncement.created_at.desc()).limit(200))).scalars().all()
    latest: dict[tuple[str, str], SocialAnnouncement] = {}
    for row in rows:
        key = (row.sku, row.platform)
        if key not in latest:
            latest[key] = row
    return {
        "ok": True,
        "auto": s.social_auto_announce,
        "platforms": configured(),
        "tiktok": await tiktok_status(db),
        "products": [
            {
                "sku": p.sku,
                "slug": p.slug,
                "name": loc(p.name),
                "image": public_image(s.store_url, (p.images or [""])[0] if p.images else ""),
                "url": product_url(s.store_url, p.slug),
                "caption": caption_for(p, s.store_url),
                "last": {
                    platform: {
                        "status": latest[(p.sku, platform)].status,
                        "remote_id": latest[(p.sku, platform)].remote_id,
                        "error": latest[(p.sku, platform)].error,
                        "at": latest[(p.sku, platform)].created_at.isoformat() if latest[(p.sku, platform)].created_at else None,
                    }
                    if (p.sku, platform) in latest
                    else None
                    for platform in PLATFORMS
                },
            }
            for p in products
        ],
    }


@router.post("/social/announce")
async def social_announce(
    data: SocialAnnounceIn,
    _auth: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    out = await announce_sku(db, data.sku.strip(), platforms=data.platforms, force=data.force)
    if out.get("error") == "product not found":
        raise HTTPException(404, "product not found")
    return out


@router.get("/social/tiktok/login")
async def social_tiktok_login(_auth: None = Depends(require_admin)) -> dict:
    state = token_urlsafe(16)
    url = tiktok_login_url(state)
    if not url:
        raise HTTPException(503, "tiktok login kit not configured")
    return {"ok": True, "url": url, "state": state}


@router.post("/social/tiktok/exchange")
async def social_tiktok_exchange(
    data: TikTokExchangeIn,
    _auth: None = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> dict:
    out = await exchange_tiktok_code(db, data.code.strip())
    if not out.get("ok"):
        raise HTTPException(400, out.get("error") or "tiktok exchange failed")
    return out
