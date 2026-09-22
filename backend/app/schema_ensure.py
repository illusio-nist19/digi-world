from __future__ import annotations

import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

log = logging.getLogger("dw.schema")

# create_all does not ALTER existing tables — add columns Digi World orders need.
_PATCHES: list[tuple[str, str, str]] = [
    ("orders", "checkout_mode", "VARCHAR(20) DEFAULT 'lead'"),
    ("orders", "upsell_cents", "INTEGER DEFAULT 0"),
    ("orders", "discount_cents", "INTEGER DEFAULT 0"),
    ("orders", "event_id_purchase", "VARCHAR(80)"),
    ("orders", "event_id_lead", "VARCHAR(80)"),
    ("orders", "user_agent", "TEXT"),
    ("orders", "ip", "VARCHAR(64)"),
    ("orders", "attribution", "JSONB DEFAULT '{}'::jsonb"),
    ("order_items", "meta", "JSONB DEFAULT '{}'::jsonb"),
    ("order_items", "is_upsell", "BOOLEAN DEFAULT false"),
]

_TABLES = [
    """
    CREATE TABLE IF NOT EXISTS social_announcements (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(40) NOT NULL,
        platform VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        remote_id VARCHAR(80),
        error TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
    )
    """,
    "CREATE INDEX IF NOT EXISTS ix_social_announcements_sku ON social_announcements (sku)",
    "CREATE INDEX IF NOT EXISTS ix_social_announcements_platform ON social_announcements (platform)",
    """
    CREATE TABLE IF NOT EXISTS social_oauth (
        platform VARCHAR(20) PRIMARY KEY,
        open_id VARCHAR(80),
        username VARCHAR(80),
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        scope VARCHAR(255),
        expires_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ DEFAULT now()
    )
    """,
]


async def ensure_schema(engine: AsyncEngine) -> None:
    async with engine.begin() as conn:
        for stmt in _TABLES:
            try:
                await conn.execute(text(stmt))
            except Exception as exc:  # noqa: BLE001
                log.warning("schema table failed: %s", exc)
        for table, column, ddl in _PATCHES:
            exists = await conn.scalar(
                text(
                    """
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_schema = 'public'
                      AND table_name = :table
                      AND column_name = :column
                    """
                ),
                {"table": table, "column": column},
            )
            if exists:
                continue
            stmt = f"ALTER TABLE {table} ADD COLUMN {column} {ddl}"
            try:
                await conn.execute(text(stmt))
                log.info("added column %s.%s", table, column)
            except Exception as exc:  # noqa: BLE001
                log.warning("schema patch failed %s.%s: %s", table, column, exc)
    log.info("schema ensure complete")
