from contextlib import asynccontextmanager
import logging
import sys

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.catalog import router as catalog_router
from app.api.contact import router as contact_router
from app.api.health import router as health_router
from app.api.orders import hooks as stripe_hooks
from app.api.orders import router as orders_router
from app.api.tracking import router as track_router
from app.config import get_settings
from app.db import SessionLocal, engine
from app.schema_ensure import ensure_schema
from app.seed.catalog import seed_catalog

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
    try:
        await ensure_schema(engine)
    except Exception:
        log.exception("schema ensure failed")
    async with SessionLocal() as session:
        new_skus = await seed_catalog(session)
    try:
        from app.services.social import announce_new_skus

        await announce_new_skus(new_skus)
    except Exception:
        log.exception("social auto-announce failed")
    yield
    await engine.dispose()


settings = get_settings()
app = FastAPI(title="Digi World API", version=settings.app_version, lifespan=lifespan)


@app.exception_handler(Exception)
async def _unhandled(request: Request, exc: Exception):  # noqa: ARG001
    from fastapi.responses import JSONResponse

    log.exception("unhandled %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": f"{type(exc).__name__}: {exc}"})


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
app.include_router(stripe_hooks)
app.include_router(contact_router)
app.include_router(track_router)
app.include_router(admin_router)
