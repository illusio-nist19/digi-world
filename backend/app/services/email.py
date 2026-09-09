from __future__ import annotations

import logging

import httpx

from app.config import get_settings

log = logging.getLogger("dw.email")


async def send_order_email(to: str, public_id: str, locale: str) -> None:
    s = get_settings()
    subject = {
        "ar": f"خزنتك جاهزة · {public_id}",
        "fr": f"Votre vault · {public_id}",
        "es": f"Tu vault · {public_id}",
    }.get(locale, f"Your vault · {public_id}")
    html = f"<p>Digi World</p><p>Order {public_id}</p><p>Check this inbox for the next step.</p>"
    if not s.resend_api_key:
        log.info("email stub to %s order %s", to, public_id)
        return
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {s.resend_api_key}"},
                json={"from": s.resend_from, "to": [to], "subject": subject, "html": html},
            )
    except Exception as exc:  # noqa: BLE001
        log.warning("resend failed: %s", exc)
