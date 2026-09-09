# 12 — Architecture

```
[Browser: Next.js on digi-world.online]
    │  SSR/SSG pages, cart in Zustand + persist localStorage
    │  Web pixels (deferred) + click ID cookies
    │
    ▼ HTTPS
[API: FastAPI on api.digi-world.online]
    │  CORS allow https://digi-world.online
    │  Orders, contact, tracking relay, catalog
    │
    ├── PostgreSQL  digi-world  (EasyPanel internal)
    ├── CAPI: Meta Graph, TikTok Events API, Snap CAPI v3
    └── Google Apps Script webhook → Sheet
```

## Principles

- Frontend never talks to Meta/TikTok/Snap **CAPI** (secrets stay server-side).
- Frontend **does** run official web pixels after consent.
- Same `event_id` generated on client (uuid) for pixel **and** sent to API for CAPI.
- Catalog can be JSON seed mirrored in DB. Runtime reads **API** (`GET /catalog`) with ISR/revalidate 60s. Fallback: local `catalog.ts` if API down (must match).
- Cart is client-only until checkout.
- Idempotent orders: `client_order_id` uuid from frontend.

## Environments

| | Frontend | Backend |
| --- | --- | --- |
| Local | localhost:3000 | localhost:8000 |
| Prod | https://digi-world.online | https://api.digi-world.online |

`NEXT_PUBLIC_API_URL=https://api.digi-world.online`

## Auth

v1: no customer accounts. Optional later. Admin: simple `ADMIN_TOKEN` header for `/admin/orders` (optional). Sheet is the operator UI for v1.

## Files / delivery

`CHECKOUT_MODE=lead` (default): order `status=lead`. Email + sheet. Operator sends payment/vault.  
`CHECKOUT_MODE=instant_lead`: same but generate download tokens immediately (only if you accept unpaid delivery — **default off**).

Future `CHECKOUT_MODE=stripe`: payment_intent then fulfill.

## Observability

- Backend structured JSON logs
- `/health` and `/health/db`
- Do not log raw emails in tracking debug in prod (hash or redact)

## Security

- Rate limit checkout 10/min/IP (`slowapi` or custom)
- Pydantic validation
- HTTPS only
- Secrets in EasyPanel env
- CORS explicit origins
- Sheet webhook URL is a secret
