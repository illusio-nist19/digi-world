from __future__ import annotations

import asyncio
import logging
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.db import SessionLocal
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

from app.models import Product, SocialAnnouncement, SocialOAuth

log = logging.getLogger("dw.social")

PLATFORMS = ("facebook", "instagram", "tiktok")
HASHTAGS = "#DigiWorld #DigitalPlanner #BusinessCRM"
GRAPH = "https://graph.facebook.com"
TIKTOK_CREATOR = "https://open.tiktokapis.com/v2/post/publish/creator_info/query/"
TIKTOK_PHOTO = "https://open.tiktokapis.com/v2/post/publish/content/init/"
TIKTOK_STATUS = "https://open.tiktokapis.com/v2/post/publish/status/fetch/"
TIKTOK_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/"
TIKTOK_AUTHORIZE = "https://www.tiktok.com/v2/auth/authorize/"
# Direct Post needs video.publish; MEDIA_UPLOAD fallback needs video.upload.
TIKTOK_SCOPES = "user.info.basic,video.publish,video.upload"


def loc(value: Any, locale: str = "en") -> str:
    if isinstance(value, dict):
        return str(value.get(locale) or value.get("en") or next(iter(value.values()), "") or "").strip()
    return str(value or "").strip()


def product_url(store_url: str, slug: str) -> str:
    return f"{store_url.rstrip('/')}/en/systems/{slug}"


def public_image(store_url: str, path: str) -> str:
    raw = (path or "").strip()
    if not raw:
        return ""
    if raw.startswith("http://") or raw.startswith("https://"):
        return raw
    return f"{store_url.rstrip('/')}{raw if raw.startswith('/') else '/' + raw}"


def caption_for(product: Product, store_url: str) -> str:
    name = loc(product.name)
    sub = loc(product.sub) or loc(product.headline)
    url = product_url(store_url, product.slug)
    parts = [name]
    if sub:
        parts.append(sub)
    parts.extend([url, "Shop Digi World — systems you open on your computer.", HASHTAGS])
    return "\n\n".join(p for p in parts if p)[:2200]


def image_urls(product: Product, store_url: str, limit: int = 8, *, for_tiktok: bool = False) -> list[str]:
    raw = product.images if isinstance(product.images, list) else []
    if for_tiktok:
        # Photo Direct Post: JPEG/WebP only (PNG → file_format_check_failed).
        # Prefer shipped 01.jpg next to 01.png; never send .png to TikTok.
        raw = raw[:1]
    urls: list[str] = []
    for path in raw[:limit]:
        url = public_image(store_url, str(path))
        if not url:
            continue
        lower = url.lower()
        if for_tiktok:
            if lower.endswith(".png"):
                urls.append(url[:-4] + ".jpg")
            elif lower.endswith((".jpg", ".jpeg", ".webp")):
                urls.append(url)
            continue
        urls.append(url)
    return urls


def configured() -> dict[str, bool]:
    s = get_settings()
    page = bool(s.meta_page_id and s.meta_page_access_token)
    return {
        "facebook": page,
        "instagram": page and bool(s.meta_ig_user_id),
        "tiktok": bool(s.tiktok_publish_access_token or s.tiktok_client_key),
    }


def tiktok_login_url(state: str) -> str:
    s = get_settings()
    if not s.tiktok_client_key or not s.tiktok_redirect_uri:
        return ""
    return (
        TIKTOK_AUTHORIZE
        + "?"
        + urlencode(
            {
                "client_key": s.tiktok_client_key,
                "scope": TIKTOK_SCOPES,
                "response_type": "code",
                "redirect_uri": s.tiktok_redirect_uri,
                "state": state,
            }
        )
    )


async def _oauth_row(db: AsyncSession) -> SocialOAuth | None:
    return (await db.execute(select(SocialOAuth).where(SocialOAuth.platform == "tiktok"))).scalar_one_or_none()


async def _save_oauth(db: AsyncSession, payload: dict[str, Any], username: str | None = None) -> SocialOAuth:
    row = await _oauth_row(db)
    if row is None:
        row = SocialOAuth(platform="tiktok", access_token="")
        db.add(row)
    row.access_token = str(payload.get("access_token") or "")
    row.refresh_token = str(payload.get("refresh_token") or row.refresh_token or "") or None
    row.open_id = str(payload.get("open_id") or row.open_id or "") or None
    row.scope = str(payload.get("scope") or TIKTOK_SCOPES)
    expires = int(payload.get("expires_in") or 0)
    row.expires_at = datetime.now(timezone.utc) + timedelta(seconds=max(expires - 60, 60)) if expires else None
    if username:
        row.username = username
    await db.commit()
    await db.refresh(row)
    return row


async def refresh_tiktok_token(db: AsyncSession, row: SocialOAuth) -> str:
    s = get_settings()
    if not row.refresh_token or not s.tiktok_client_key or not s.tiktok_client_secret:
        return row.access_token
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            TIKTOK_TOKEN,
            data={
                "client_key": s.tiktok_client_key,
                "client_secret": s.tiktok_client_secret,
                "grant_type": "refresh_token",
                "refresh_token": row.refresh_token,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache"},
        )
        body = r.json() if r.content else {}
    if not r.is_success or not body.get("access_token"):
        log.warning("tiktok refresh failed %s", _err(body) or r.status_code)
        return row.access_token
    saved = await _save_oauth(db, body, username=row.username)
    return saved.access_token


async def tiktok_access_token(db: AsyncSession) -> str:
    row = await _oauth_row(db)
    if row and row.access_token:
        if row.expires_at and row.expires_at <= datetime.now(timezone.utc):
            return await refresh_tiktok_token(db, row)
        return row.access_token
    return get_settings().tiktok_publish_access_token


async def tiktok_status(db: AsyncSession) -> dict[str, Any]:
    s = get_settings()
    row = await _oauth_row(db)
    token = await tiktok_access_token(db)
    return {
        "login": bool(s.tiktok_client_key and s.tiktok_client_secret),
        "connected": bool(token),
        "username": row.username if row else None,
        "scope": row.scope if row else None,
    }


async def exchange_tiktok_code(db: AsyncSession, code: str) -> dict[str, Any]:
    s = get_settings()
    if not s.tiktok_client_key or not s.tiktok_client_secret:
        return {"ok": False, "error": "tiktok login kit not configured"}
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            TIKTOK_TOKEN,
            data={
                "client_key": s.tiktok_client_key,
                "client_secret": s.tiktok_client_secret,
                "code": code.strip(),
                "grant_type": "authorization_code",
                "redirect_uri": s.tiktok_redirect_uri,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache"},
        )
        body = r.json() if r.content else {}
    if not r.is_success or not body.get("access_token"):
        return {"ok": False, "error": _err(body) or body.get("error_description") or f"http {r.status_code}"}
    username = None
    headers = {"Authorization": f"Bearer {body['access_token']}", "Content-Type": "application/json; charset=UTF-8"}
    async with httpx.AsyncClient(timeout=20) as client:
        info = await client.post(TIKTOK_CREATOR, headers=headers, json={})
        info_body = info.json() if info.content else {}
    data = info_body.get("data") if isinstance(info_body, dict) else {}
    if isinstance(data, dict):
        username = str(data.get("creator_username") or "") or None
    row = await _save_oauth(db, body, username=username)
    return {"ok": True, "username": row.username, "scope": row.scope}


def _err(body: Any) -> str:
    if isinstance(body, dict):
        err = body.get("error")
        if isinstance(err, dict):
            return str(err.get("message") or err.get("code") or body)[:500]
        if err:
            return str(err)[:500]
    return str(body)[:500]


async def _graph_post(path: str, params: dict[str, Any]) -> dict[str, Any]:
    s = get_settings()
    url = f"{GRAPH}/{s.meta_graph_version}{path}"
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(url, params=params)
        body = r.json() if r.content else {}
        if not r.is_success or (isinstance(body, dict) and body.get("error")):
            return {"ok": False, "error": _err(body) or f"http {r.status_code}"}
        return {"ok": True, "id": str(body.get("id") or body.get("post_id") or ""), "body": body}


async def post_facebook(image_url: str, caption: str) -> dict[str, Any]:
    s = get_settings()
    return await _graph_post(
        f"/{s.meta_page_id}/photos",
        {
            "url": image_url,
            "caption": caption,
            "published": "true",
            "access_token": s.meta_page_access_token,
        },
    )


async def post_instagram(image_url: str, caption: str) -> dict[str, Any]:
    s = get_settings()
    created = await _graph_post(
        f"/{s.meta_ig_user_id}/media",
        {
            "image_url": image_url,
            "caption": caption,
            "access_token": s.meta_page_access_token,
        },
    )
    if not created.get("ok") or not created.get("id"):
        return created
    creation_id = created["id"]
    for _ in range(8):
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.get(
                f"{GRAPH}/{s.meta_graph_version}/{creation_id}",
                params={"fields": "status_code", "access_token": s.meta_page_access_token},
            )
            body = r.json() if r.content else {}
        status = str(body.get("status_code") or "")
        if status in {"FINISHED", "PUBLISHED", ""}:
            break
        if status == "ERROR":
            return {"ok": False, "error": _err(body) or "instagram container error"}
        await asyncio.sleep(2)
    published = await _graph_post(
        f"/{s.meta_ig_user_id}/media_publish",
        {"creation_id": creation_id, "access_token": s.meta_page_access_token},
    )
    return published


async def post_tiktok(images: list[str], title: str, description: str, access_token: str) -> dict[str, Any]:
    if not access_token:
        return {"ok": False, "error": "tiktok not connected"}
    photos = [u for u in images if u.lower().endswith((".jpg", ".jpeg", ".webp"))]
    if not photos:
        return {
            "ok": False,
            "error": "tiktok needs a public JPEG/WebP hero (01.jpg). PNG is rejected by TikTok.",
        }
    s = get_settings()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json; charset=UTF-8",
    }
    async with httpx.AsyncClient(timeout=40) as client:
        info = await client.post(TIKTOK_CREATOR, headers=headers, json={})
        info_body = info.json() if info.content else {}
        data = info_body.get("data") if isinstance(info_body, dict) else {}
        err = info_body.get("error") if isinstance(info_body, dict) else None
        if not info.is_success or (isinstance(err, dict) and err.get("code") not in (None, "", "ok")):
            return {"ok": False, "error": _err(info_body) or f"tiktok creator {info.status_code}"}
        options = list((data or {}).get("privacy_level_options") or [])
        wanted = (s.tiktok_privacy_level or "SELF_ONLY").strip()
        # Unaudited TikTok apps can only Direct Post as SELF_ONLY.
        if "SELF_ONLY" in options and wanted not in options:
            privacy = "SELF_ONLY"
        else:
            privacy = wanted if wanted in options else (options[0] if options else wanted)
        payload = {
            "post_info": {
                "title": title[:90],
                "description": description[:4000],
                "privacy_level": privacy,
                "disable_comment": False,
                "auto_add_music": True,
                "brand_content_toggle": False,
                "brand_organic_toggle": False,
            },
            "source_info": {
                "source": "PULL_FROM_URL",
                "photo_cover_index": 0,
                "photo_images": photos[:12],
            },
            "post_mode": "DIRECT_POST",
            "media_type": "PHOTO",
        }
        posted = await client.post(TIKTOK_PHOTO, headers=headers, json=payload)
        body = posted.json() if posted.content else {}
        post_err = body.get("error") if isinstance(body, dict) else None
        if not posted.is_success or (isinstance(post_err, dict) and post_err.get("code") not in (None, "", "ok")):
            msg = _err(body) or f"tiktok post {posted.status_code}"
            # Common unaudited-app failure: retry once as SELF_ONLY.
            code = post_err.get("code") if isinstance(post_err, dict) else ""
            if code == "unaudited_client_can_only_post_to_private_accounts" and privacy != "SELF_ONLY":
                payload["post_info"]["privacy_level"] = "SELF_ONLY"
                posted = await client.post(TIKTOK_PHOTO, headers=headers, json=payload)
                body = posted.json() if posted.content else {}
                post_err = body.get("error") if isinstance(body, dict) else None
                if not posted.is_success or (isinstance(post_err, dict) and post_err.get("code") not in (None, "", "ok")):
                    return {"ok": False, "error": _err(body) or msg}
            else:
                return {"ok": False, "error": msg}
        publish_id = str((body.get("data") or {}).get("publish_id") or "")
        fail = await _tiktok_wait_status(client, headers, publish_id)
        if fail:
            return {"ok": False, "error": fail, "id": publish_id}
        return {"ok": True, "id": publish_id, "privacy": payload["post_info"]["privacy_level"], "body": body}


async def _tiktok_wait_status(client: httpx.AsyncClient, headers: dict[str, str], publish_id: str) -> str | None:
    """Poll until complete; return fail_reason text or None on success."""
    if not publish_id:
        return None
    last = ""
    for _ in range(12):
        r = await client.post(TIKTOK_STATUS, headers=headers, json={"publish_id": publish_id})
        body = r.json() if r.content else {}
        data = body.get("data") if isinstance(body, dict) else {}
        status = str((data or {}).get("status") or "")
        if status == "PUBLISH_COMPLETE":
            return None
        if status == "FAILED":
            reason = str((data or {}).get("fail_reason") or _err(body) or "tiktok publish failed")
            hints = {
                "file_format_check_failed": "TikTok rejected the image format — use real JPEG/WebP (not PNG).",
                "photo_pull_failed": "TikTok could not download the image URL — check public HTTPS + domain verification.",
                "picture_size_check_failed": "Image too large for TikTok photo posts (max ~1080p / 20MB).",
            }
            return hints.get(reason, reason)[:500]
        last = status or _err(body) or "processing"
        await asyncio.sleep(2)
    return f"tiktok still {last or 'processing'} (publish_id={publish_id})"[:500]


async def _already_posted(db: AsyncSession, sku: str, platform: str) -> bool:
    row = (
        await db.execute(
            select(SocialAnnouncement.id)
            .where(
                SocialAnnouncement.sku == sku,
                SocialAnnouncement.platform == platform,
                SocialAnnouncement.status == "posted",
            )
            .limit(1)
        )
    ).scalar_one_or_none()
    return row is not None


async def _record(db: AsyncSession, sku: str, platform: str, status: str, remote_id: str | None, error: str | None) -> None:
    db.add(
        SocialAnnouncement(
            sku=sku,
            platform=platform,
            status=status,
            remote_id=remote_id,
            error=error,
        )
    )


async def announce_product(
    db: AsyncSession,
    product: Product,
    platforms: list[str] | None = None,
    force: bool = False,
) -> dict[str, Any]:
    s = get_settings()
    wanted = [p for p in (platforms or list(PLATFORMS)) if p in PLATFORMS]
    ready = configured()
    ready["tiktok"] = bool(await tiktok_access_token(db))
    images = image_urls(product, s.store_url)
    tiktok_images = image_urls(product, s.store_url, for_tiktok=True)
    caption = caption_for(product, s.store_url)
    results: dict[str, Any] = {}
    if not images:
        for platform in wanted:
            results[platform] = {"ok": False, "status": "failed", "error": "no product image"}
            await _record(db, product.sku, platform, "failed", None, "no product image")
        await db.commit()
        return {"sku": product.sku, "url": product_url(s.store_url, product.slug), "results": results}

    hero = images[0]
    for platform in wanted:
        if not ready.get(platform):
            results[platform] = {"ok": False, "status": "skipped", "error": "not configured"}
            continue
        if not force and await _already_posted(db, product.sku, platform):
            results[platform] = {"ok": True, "status": "already"}
            continue
        try:
            if platform == "facebook":
                out = await post_facebook(hero, caption)
            elif platform == "instagram":
                out = await post_instagram(hero, caption)
            else:
                tt_imgs = tiktok_images or []
                if not tt_imgs:
                    out = {
                        "ok": False,
                        "error": "tiktok needs 01.jpg next to the product hero (PNG-only heroes fail)",
                    }
                else:
                    out = await post_tiktok(tt_imgs, loc(product.name), caption, await tiktok_access_token(db))
        except Exception as exc:  # noqa: BLE001
            log.exception("social %s %s failed", platform, product.sku)
            out = {"ok": False, "error": str(exc)[:500]}
        status = "posted" if out.get("ok") else "failed"
        await _record(db, product.sku, platform, status, out.get("id"), None if out.get("ok") else out.get("error"))
        results[platform] = {"ok": bool(out.get("ok")), "status": status, "id": out.get("id"), "error": out.get("error")}
    await db.commit()
    return {
        "sku": product.sku,
        "url": product_url(s.store_url, product.slug),
        "caption": caption,
        "image": hero,
        "results": results,
    }


async def announce_sku(db: AsyncSession, sku: str, platforms: list[str] | None = None, force: bool = False) -> dict[str, Any]:
    product = (await db.execute(select(Product).where(Product.sku == sku))).scalar_one_or_none()
    if product is None:
        product = (await db.execute(select(Product).where(Product.slug == sku))).scalar_one_or_none()
    if product is None:
        return {"ok": False, "error": "product not found"}
    out = await announce_product(db, product, platforms=platforms, force=force)
    out["ok"] = any(v.get("ok") for v in out["results"].values()) or all(
        v.get("status") == "already" for v in out["results"].values()
    )
    return out


async def announce_new_skus(skus: list[str]) -> None:
    s = get_settings()
    if not s.social_auto_announce or not skus:
        return
    if not any(configured().values()):
        log.info("social auto-announce skipped: no platforms configured")
        return
    if len(skus) > 3:
        log.warning("social auto-announce skipped: %s new skus (use /admin/social/announce)", skus)
        return
    async with SessionLocal() as db:
        for sku in skus:
            try:
                out = await announce_sku(db, sku)
                log.info("social auto-announce %s %s", sku, out.get("results"))
            except Exception:  # noqa: BLE001
                log.exception("social auto-announce failed sku=%s", sku)
