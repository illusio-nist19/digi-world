# 15 — Database (`digi-world`)

EasyPanel Postgres already exists. Database name: **digi-world**.

Internal URL pattern (EasyPanel):

```
postgres://postgres:<PASSWORD>@digi-world_digi-world-database:5432/digi-world?sslmode=disable
```

Put the real URL only in EasyPanel env `DATABASE_URL`. Never commit the password.

SQLAlchemy DSN:

```
postgresql+asyncpg://postgres:<PASSWORD>@digi-world_digi-world-database:5432/digi-world
```

Strip `sslmode=disable` for asyncpg or pass `ssl=false`.

Alembic can use sync URL `postgresql+psycopg://...` in `alembic/env.py` or run async. Pick one and document in `backend/README`.

## Tables

### collections
`id, slug, name_en, name_ar, sub_en, sub_ar, image, sort`

### products
`id, sku, slug, collection_id, type (system|addon|vault), name_en, name_ar, sub_en, sub_ar, description_en, description_ar, price_cents, compare_cents nullable, license_pool, licenses_issued, drop_label, serial, pair_sku, upsell_sku, upsell_price_cents, images jsonb, contents jsonb, faq jsonb, active, sort`

### offers
Static in code is OK; or table. Prefer **code** in `offers.py` matching pricing doc so prices can’t drift from UI.

### reviews
See social proof doc.

### orders
`id uuid pk, public_id str unique (DW-2026-XXXXXX), client_order_id unique, status (lead|upsell_pending|confirmed|fulfilled|cancelled), name, email, locale, currency, subtotal_cents, discount_cents, total_cents, attribution jsonb, user_agent, ip, event_id_purchase, created_at, updated_at`

### order_items
`id, order_id fk, sku, offer_id, name, qty, unit_price_cents, is_upsell bool, meta jsonb`

### tracking_events
`id, event_id unique, event_name, order_id nullable, payload_redacted jsonb, platforms jsonb (meta/tiktok/snap status), created_at`

### contacts
`id, name, email, message, created_at`

## Indexes

`orders.email`, `orders.public_id`, `products.slug`, `tracking_events.event_id`

## Seed

Insert collections + 12 products on migrate if empty.

`licenses_issued` increment when order created (count licenses: solo +1, duo +2, pair +1 each sku, vault +8).
