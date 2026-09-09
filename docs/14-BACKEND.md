# 14 — Backend (FastAPI)

## Stack (locked)

| Layer | Choice |
| --- | --- |
| App | FastAPI, Uvicorn, Python 3.12 |
| DB | SQLAlchemy 2.0 **async** + **asyncpg** |
| URL | Convert EasyPanel `postgres://` → `postgresql+asyncpg://` in settings |
| Migrations | Alembic; **run `upgrade head` on startup** |
| Schema | Pydantic v2 |
| HTTP out | `httpx` async (CAPI + sheet) |
| Hash | `hashlib.sha256` after normalize |
| Settings | `pydantic-settings` |
| CORS | `CORSMiddleware` |
| Rate limit | slowapi or in-memory sliding window |

Optional: `orjson`. No Django.

## Folder

```
backend/
  Dockerfile
  alembic.ini
  alembic/env.py
  alembic/versions/
  app/
    main.py
    config.py
    db.py
    models.py
    schemas.py
    api/
      health.py
      catalog.py
      orders.py
      contact.py
      tracking.py
    services/
      orders.py
      sheet.py
      capi_meta.py
      capi_tiktok.py
      capi_snap.py
      hashing.py
      email.py          # stub: log or Resend if RESEND_API_KEY
    seed/catalog.py
  tests/
  .env.example
  requirements.txt
```

## Lifespan

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    run_alembic_upgrade()  # subprocess or alembic API
    await seed_if_empty()
    yield
    await engine.dispose()
```

`run_alembic_upgrade` must not crash the API loop: run via `alembic.command.upgrade`. If migrate fails, **exit process** (better than silent empty DB).

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | `{ok:true, version}` |
| GET | `/health/db` | select 1 |
| GET | `/catalog` | products, collections, offers |
| GET | `/catalog/products/{slug}` | PDP |
| POST | `/orders` | create order + sheet + CAPI Purchase |
| POST | `/orders/{id}/upsell` | add upsell line, extra CAPI Purchase or add to same? **new event** `Purchase` with new event_id for upsell value only **or** `AddToCart`+`Purchase` — use **Purchase** with value = upsell price, event_id new, content_ids upsell sku |
| POST | `/contact` | |
| POST | `/track` | PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase from client for CAPI twin |
| GET | `/orders/{id}` | thank-you (by public id + email query optional) |

`POST /track` is how we twin browser events. Client sends `{event_name, event_id, event_source_url, value, currency, contents, user: {email?, name?}, cookies, fbp, fbc, ttclid, sc_click_id, sc_cookie1}`. Server adds IP + UA, hashes PII, fans out CAPI.

Do **not** require auth on `/track` but rate-limit. Don’t trust `value` for Purchase unless it matches a known order — for Purchase prefer orders endpoints.

## POST /orders body

```json
{
  "client_order_id": "uuid",
  "name": "Sara",
  "email": "sara@x.com",
  "locale": "ar",
  "items": [{"sku":"DW-SYS-001","offer_id":"duo","qty":1,"unit_price":29}],
  "currency": "USD",
  "attribution": {
    "utm_source": "tiktok",
    "fbclid": "...",
    "fbp": "...",
    "fbc": "...",
    "ttclid": "...",
    "sc_click_id": "...",
    "sc_cookie1": "...",
    "landing_page": "https://...",
    "referrer": "..."
  },
  "event_id": "uuid-for-purchase",
  "event_source_url": "https://digi-world.online/ar",
  "user_agent": "...",
  "test_event_code": null
}
```

Server computes totals. Ignores client total if mismatch. Returns `{order_id, public_id, total, status, email}`.

Idempotent on `client_order_id`.

## Email

If `RESEND_API_KEY` set, send transactional from `hello@digi-world.online`. Else log. Never fail the order if email fails.

## Sheet POST

JSON body includes every CSV column plus `"secret": SHEET_WEBHOOK_SECRET`. Also append `?secret=` to the webhook URL. Apps Script cannot be trusted to see `X-Webhook-Secret`.

## CAPI fanout

Background `BackgroundTasks` so the HTTP response is fast. Retry 3x exponential. Log platform response (no PII).

## Docker

`python:3.12-slim`, uvicorn `0.0.0.0:8000`, non-root user. `CMD` uvicorn. EasyPanel maps port.

Healthcheck: `curl -f http://127.0.0.1:8000/health || exit 1`
