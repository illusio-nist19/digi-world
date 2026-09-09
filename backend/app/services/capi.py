from __future__ import annotations

import asyncio
import logging
import time
from typing import Any

import httpx

from app.config import get_settings
from app.services.hashing import hash_email, user_hashes

log = logging.getLogger("dw.capi")

META_EVENTS = {
    "PageView": "PageView",
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Lead": "Lead",
    "Purchase": "Purchase",
}

TIKTOK_EVENTS = {
    "PageView": "Pageview",
    "ViewContent": "ViewContent",
    "AddToCart": "AddToCart",
    "InitiateCheckout": "InitiateCheckout",
    "Lead": "SubmitForm",
    "Purchase": "CompletePayment",
}

SNAP_EVENTS = {
    "PageView": "PAGE_VIEW",
    "ViewContent": "VIEW_CONTENT",
    "AddToCart": "ADD_CART",
    "InitiateCheckout": "START_CHECKOUT",
    "Lead": "SIGN_UP",
    "Purchase": "PURCHASE",
}


def _contents(custom: dict[str, Any]) -> list[dict[str, Any]]:
    return custom.get("contents") or []


async def _post(url: str, json: dict[str, Any], headers: dict[str, str] | None = None) -> dict[str, Any]:
    last: Exception | None = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=12) as client:
                r = await client.post(url, json=json, headers=headers or {})
                body = r.json() if r.content else {}
                if r.status_code >= 400:
                    log.warning("capi %s -> %s %s", url, r.status_code, body)
                return {"status": r.status_code, "ok": r.is_success}
        except Exception as exc:  # noqa: BLE001
            last = exc
            await asyncio.sleep(0.5 * (attempt + 1))
    log.warning("capi failed %s: %s", url, last)
    return {"status": 0, "ok": False}


async def send_meta(event_name: str, event_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    s = get_settings()
    if not s.meta_pixel_id or not s.meta_capi_access_token:
        return {"skipped": True}
    mapped = META_EVENTS.get(event_name, event_name)
    hashes = user_hashes(payload.get("name"), payload.get("email"), payload.get("phone"))
    user_data: dict[str, Any] = {
        "client_ip_address": payload.get("ip"),
        "client_user_agent": payload.get("user_agent"),
    }
    if hashes.get("em"):
        user_data["em"] = [hashes["em"]]
    if hashes.get("fn"):
        user_data["fn"] = [hashes["fn"]]
    if hashes.get("ln"):
        user_data["ln"] = [hashes["ln"]]
    if hashes.get("ph"):
        user_data["ph"] = [hashes["ph"]]
    if payload.get("fbp"):
        user_data["fbp"] = payload["fbp"]
    if payload.get("fbc"):
        user_data["fbc"] = payload["fbc"]
    if payload.get("email"):
        user_data["external_id"] = hash_email(payload["email"])
    body: dict[str, Any] = {
        "data": [
            {
                "event_name": mapped,
                "event_time": int(time.time()),
                "event_id": event_id,
                "action_source": "website",
                "event_source_url": payload.get("event_source_url") or s.origins[0],
                "user_data": user_data,
                "custom_data": {
                    "currency": payload.get("currency") or "USD",
                    "value": payload.get("value"),
                    "content_type": "product",
                    "contents": [
                        {
                            "id": c.get("id") or c.get("content_id"),
                            "quantity": c.get("quantity") or 1,
                            "item_price": c.get("item_price") or c.get("price"),
                        }
                        for c in _contents(payload)
                    ],
                    "order_id": payload.get("order_id"),
                },
            }
        ]
    }
    if s.meta_test_event_code:
        body["test_event_code"] = s.meta_test_event_code
    url = f"https://graph.facebook.com/v21.0/{s.meta_pixel_id}/events?access_token={s.meta_capi_access_token}"
    return await _post(url, body)


async def send_tiktok(event_name: str, event_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    s = get_settings()
    if not s.tiktok_pixel_id or not s.tiktok_access_token:
        return {"skipped": True}
    hashes = user_hashes(payload.get("name"), payload.get("email"), payload.get("phone"))
    user: dict[str, Any] = {
        "ip": payload.get("ip"),
        "user_agent": payload.get("user_agent"),
    }
    if hashes.get("em"):
        user["email"] = hashes["em"]
    if hashes.get("ph"):
        user["phone"] = hashes["ph"]
    if payload.get("ttclid"):
        user["ttclid"] = payload["ttclid"]
    if payload.get("ttp"):
        user["ttp"] = payload["ttp"]
    if payload.get("email"):
        user["external_id"] = hash_email(payload["email"])
    data = {
        "event_source": "web",
        "event_source_id": s.tiktok_pixel_id,
        "data": [
            {
                "event": TIKTOK_EVENTS.get(event_name, event_name),
                "event_time": int(time.time()),
                "event_id": event_id,
                "user": user,
                "page": {
                    "url": payload.get("event_source_url") or s.origins[0],
                    "referrer": payload.get("referrer") or "",
                },
                "properties": {
                    "currency": payload.get("currency") or "USD",
                    "value": payload.get("value"),
                    "contents": [
                        {
                            "content_id": c.get("id") or c.get("content_id"),
                            "content_type": "product",
                            "content_name": c.get("content_name") or "",
                            "quantity": c.get("quantity") or 1,
                            "price": c.get("item_price") or c.get("price"),
                        }
                        for c in _contents(payload)
                    ],
                },
            }
        ],
    }
    if s.tiktok_test_event_code:
        data["test_event_code"] = s.tiktok_test_event_code
    return await _post(
        "https://business-api.tiktok.com/open_api/v1.3/event/track/",
        data,
        {"Access-Token": s.tiktok_access_token, "Content-Type": "application/json"},
    )


async def send_snap(event_name: str, event_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    s = get_settings()
    if not s.snap_pixel_id or not s.snap_capi_token:
        return {"skipped": True}
    hashes = user_hashes(payload.get("name"), payload.get("email"), payload.get("phone"))
    user_data: dict[str, Any] = {
        "client_ip_address": payload.get("ip"),
        "client_user_agent": payload.get("user_agent"),
    }
    if hashes.get("em"):
        user_data["em"] = [hashes["em"]]
    if hashes.get("ph"):
        user_data["ph"] = [hashes["ph"]]
    if payload.get("sc_click_id"):
        user_data["sc_click_id"] = payload["sc_click_id"]
    if payload.get("sc_cookie1"):
        user_data["sc_cookie1"] = payload["sc_cookie1"]
    body = {
        "data": [
            {
                "event_name": SNAP_EVENTS.get(event_name, event_name),
                "event_time": int(time.time()),
                "event_id": event_id,
                "action_source": "WEB",
                "event_source_url": payload.get("event_source_url") or s.origins[0],
                "user_data": user_data,
                "custom_data": {
                    "currency": payload.get("currency") or "USD",
                    "value": str(payload.get("value") or 0),
                    "contents": [
                        {
                            "id": c.get("id") or c.get("content_id"),
                            "quantity": str(c.get("quantity") or 1),
                            "item_price": str(c.get("item_price") or c.get("price") or 0),
                        }
                        for c in _contents(payload)
                    ],
                    "order_id": payload.get("order_id"),
                    "num_items": str(sum((c.get("quantity") or 1) for c in _contents(payload)) or 1),
                },
            }
        ]
    }
    url = f"https://tr.snapchat.com/v3/{s.snap_pixel_id}/events?access_token={s.snap_capi_token}"
    return await _post(url, body)


async def fanout(event_name: str, event_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    s = get_settings()
    if s.capi_require_consent and not payload.get("consent"):
        return {"skipped": "consent"}
    meta, tiktok, snap = await asyncio.gather(
        send_meta(event_name, event_id, payload),
        send_tiktok(event_name, event_id, payload),
        send_snap(event_name, event_id, payload),
    )
    return {"meta": meta, "tiktok": tiktok, "snap": snap}
