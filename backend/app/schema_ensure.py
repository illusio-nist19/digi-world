from __future__ import annotations

import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

log = logging.getLogger("dw.schema")

# create_all does not add columns to existing tables — patch known Order fields.
_ORDER_COLUMN_SQL = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_mode VARCHAR(20) DEFAULT 'lead'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS upsell_cents INTEGER DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_cents INTEGER DEFAULT 0",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS event_id_purchase VARCHAR(80)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS event_id_lead VARCHAR(80)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_agent TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS ip VARCHAR(64)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS attribution JSONB DEFAULT '{}'::jsonb",
]


async def ensure_schema(engine: AsyncEngine) -> None:
    async with engine.begin() as conn:
        for stmt in _ORDER_COLUMN_SQL:
            try:
                await conn.execute(text(stmt))
            except Exception as exc:  # noqa: BLE001
                log.warning("schema patch skipped (%s): %s", stmt, exc)
    log.info("schema ensure complete")
