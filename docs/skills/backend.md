# Skill: Digi World backend

Use with the rest of `docs/`.

## Stack

FastAPI, Uvicorn, SQLAlchemy 2 async, asyncpg, Alembic on lifespan, Pydantic v2, pydantic-settings, httpx, hashlib.

## Settings

Load `.env`. Parse `DATABASE_URL`; if scheme `postgres://` or `postgresql://`, rewrite to `postgresql+asyncpg://`. Drop `sslmode` query if asyncpg complains; `connect_args` ssl False.

## Hashing helper

```python
def sha256_norm(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode("utf-8")).hexdigest()
```

Email: that. Phone: digits only then hash. Name: split fn/ln, lowercase, hash. Never hash IP, UA, fbp, fbc, ttclid, sc ids.

## Orders

Validate items against catalog prices (server-side). Compute totals. Insert order + items. Increment license counters. Background: sheet + CAPI Purchase (Meta Purchase, TikTok CompletePayment, Snap PURCHASE). Return public_id.

Upsell endpoint verifies SKU mapping and discounted cents from catalog.

## CAPI

Three modules, swallow errors, retry 3. Support test codes from env.

## Sheet

POST JSON flat keys matching CSV headers + `X-Webhook-Secret`.

## Seed

If `products` empty, insert catalog from `04-PRODUCT-CATALOG.md`.

## CORS

Allow `FRONTEND_ORIGINS` comma list.

## Do not

Do not log access tokens. Do not implement admin UI. Do not block response on CAPI.
