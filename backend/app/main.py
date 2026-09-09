from contextlib import asynccontextmanager
import logging
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.catalog import router as catalog_router
from app.api.contact import router as contact_router
from app.api.health import router as health_router
from app.api.orders import router as orders_router
from app.api.tracking import router as track_router
from app.config import get_settings
from app.db import SessionLocal, engine
from app.seed.catalog import seed_if_empty

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
log = logging.getLogger("dw")


def run_alembic_upgrade() -> None:
    from alembic import command
    from alembic.config import Config

    cfg = Config("alembic.ini")
    command.upgrade(cfg, "head")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try:
        run_alembic_upgrade()
    except Exception:
        log.exception("migration failed")
        sys.exit(1)
    async with SessionLocal() as session:
        await seed_if_empty(session)
    yield
    await engine.dispose()


settings = get_settings()
app = FastAPI(title="Digi World API", version=settings.app_version, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router)
app.include_router(catalog_router)
app.include_router(orders_router)
app.include_router(contact_router)
app.include_router(track_router)
