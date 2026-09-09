from fastapi import APIRouter, BackgroundTasks, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Contact
from app.schemas import ContactCreate
from app.services.orders import client_ip
from app.services.sheet import post_sheet

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("")
async def contact(data: ContactCreate, request: Request, bg: BackgroundTasks, db: AsyncSession = Depends(get_db)) -> dict:
    ip = client_ip(dict(request.headers), request.client.host if request.client else None)
    row = Contact(name=data.name.strip(), email=str(data.email).lower(), message=data.message.strip(), locale=data.locale, ip=ip)
    db.add(row)
    await db.commit()
    bg.add_task(
        post_sheet,
        {
            "type": "contact",
            "name": row.name,
            "email": row.email,
            "message": row.message,
            "locale": row.locale,
            "ip": ip or "",
        },
    )
    return {"ok": True}
