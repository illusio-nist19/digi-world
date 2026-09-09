from fastapi import APIRouter, BackgroundTasks, Request

from app.config import get_settings
from app.db import SessionLocal
from app.schemas import TrackEvent
from app.services import capi
from app.services.orders import client_ip, record_track

router = APIRouter(prefix="/track", tags=["track"])


@router.post("")
async def track(data: TrackEvent, request: Request, bg: BackgroundTasks) -> dict:
    if data.event_name == "Purchase":
        return {"ok": True, "skipped": "purchase_via_orders"}
    ip = client_ip(dict(request.headers), request.client.host if request.client else None)
    ua = request.headers.get("user-agent")
    payload = {
        "name": data.user.name,
        "email": data.user.email,
        "phone": data.user.phone,
        "ip": ip,
        "user_agent": ua,
        "event_source_url": data.event_source_url or get_settings().origins[0],
        "currency": data.currency,
        "value": data.value,
        "contents": [c.model_dump() for c in data.contents],
        "fbp": data.fbp,
        "fbc": data.fbc,
        "ttclid": data.ttclid,
        "ttp": data.ttp,
        "sc_click_id": data.sc_click_id,
        "sc_cookie1": data.sc_cookie1,
        "consent": data.consent,
        "order_id": data.order_id,
    }

    async def run() -> None:
        platforms = await capi.fanout(data.event_name, data.event_id, payload)
        async with SessionLocal() as session:
            await record_track(session, data.event_id, data.event_name, platforms, data.order_id)

    bg.add_task(run)
    return {"ok": True, "event_id": data.event_id}
