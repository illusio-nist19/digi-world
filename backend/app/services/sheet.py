from __future__ import annotations

import asyncio
import logging
from typing import Any
from urllib.parse import urlencode, urlsplit, urlunsplit

import httpx

from app.config import get_settings

log = logging.getLogger("dw.sheet")


async def post_sheet(payload: dict[str, Any]) -> None:
    settings = get_settings()
    if not settings.sheet_webhook_url or not settings.sheet_webhook_secret:
        log.info("sheet webhook skipped (not configured)")
        return
    body = {**payload, "secret": settings.sheet_webhook_secret}
    url = settings.sheet_webhook_url
    parts = urlsplit(url)
    q = dict([p.split("=", 1) if "=" in p else (p, "") for p in parts.query.split("&") if p])
    q["secret"] = settings.sheet_webhook_secret
    url = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(q), parts.fragment))
    last_err: Exception | None = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.post(
                    url,
                    json=body,
                    headers={
                        "Content-Type": "application/json",
                        "X-Webhook-Secret": settings.sheet_webhook_secret,
                    },
                )
                r.raise_for_status()
                return
        except Exception as exc:  # noqa: BLE001
            last_err = exc
            await asyncio.sleep(0.6 * (attempt + 1))
    log.warning("sheet webhook failed: %s", last_err)
