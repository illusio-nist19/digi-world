from __future__ import annotations

import base64
import logging
from typing import TYPE_CHECKING

import httpx

from app.config import get_settings
from app.services.vault import VAULT_FILES, vault_path

if TYPE_CHECKING:
    from app.models import Order

log = logging.getLogger("dw.email")

# Resend soft limit — skip huge attachments and use download links instead.
MAX_ATTACH_BYTES = 8 * 1024 * 1024


def _download_token(order: Order) -> str | None:
    return ((order.attribution or {}).get("pay") or {}).get("download_token")


def _api_base(store_url: str) -> str:
    store = (store_url or "https://digi-world.online").rstrip("/")
    if "api." in store:
        return store
    return (
        store.replace("://www.digi-world.online", "://api.digi-world.online")
        .replace("://digi-world.online", "://api.digi-world.online")
        .replace("://localhost:3000", "://localhost:8000")
        .replace("://localhost:3002", "://localhost:8000")
    )


async def send_order_email(order: Order) -> None:
    s = get_settings()
    public_id = order.public_id
    to = order.email
    locale = order.locale or "en"
    store = (s.store_url or "https://digi-world.online").rstrip("/")
    api = _api_base(store)
    token = _download_token(order)
    thanks = f"{store}/thank-you?order={public_id}"

    subject = {
        "ar": f"ملفاتك جاهزة · {public_id}",
        "fr": f"Vos fichiers Digi World · {public_id}",
        "es": f"Tus archivos Digi World · {public_id}",
    }.get(locale, f"Your Digi World files · {public_id}")

    lines_html: list[str] = []
    attachments: list[dict] = []
    for item in order.items:
        name = item.name
        sku = item.sku
        if token and sku in VAULT_FILES:
            link = f"{api}/orders/{public_id}/file/{sku}?token={token}"
            lines_html.append(f'<li><strong>{name}</strong> — <a href="{link}">Download zip</a></li>')
            try:
                path = vault_path(sku)
                raw = path.read_bytes()
                if len(raw) <= MAX_ATTACH_BYTES:
                    attachments.append(
                        {
                            "filename": path.name,
                            "content": base64.b64encode(raw).decode("ascii"),
                        }
                    )
            except Exception as exc:  # noqa: BLE001
                log.warning("attach skip %s: %s", sku, exc)
        else:
            lines_html.append(f"<li><strong>{name}</strong></li>")

    files_block = "<ul>" + "".join(lines_html) + "</ul>" if lines_html else "<p>Your vault is ready.</p>"
    attach_note = (
        "<p>Your zip is attached to this email. Keep it safe on your computer.</p>"
        if attachments
        else "<p>Use the download link above if the attachment is missing.</p>"
    )

    html = f"""
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#14202c">
      <p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#c9a227">Digi World</p>
      <h1 style="font-size:28px;margin:8px 0 12px">Your files are on the way</h1>
      <p>Hi {order.name},</p>
      <p>Thank you. Order <strong>{public_id}</strong> is confirmed. Your product file is ready.</p>
      {files_block}
      {attach_note}
      <p><a href="{thanks}">Open your thank-you page</a></p>
      <p style="margin-top:28px">We wish to hear from you soon — write hello@digi-world.online anytime.</p>
      <p style="color:#7a8794;font-size:13px">Digi World · digital systems, not files.</p>
    </div>
    """

    if not s.resend_api_key:
        log.info("email stub to %s order %s attachments=%s", to, public_id, len(attachments))
        return

    payload: dict = {
        "from": s.resend_from,
        "to": [to],
        "subject": subject,
        "html": html,
    }
    if attachments:
        payload["attachments"] = attachments

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {s.resend_api_key}"},
                json=payload,
            )
            if res.status_code >= 400:
                log.warning("resend %s: %s", res.status_code, res.text[:400])
            else:
                log.info("resend ok to %s order %s", to, public_id)
    except Exception as exc:  # noqa: BLE001
        log.warning("resend failed: %s", exc)
