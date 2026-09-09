# 17 — Tracking: web pixels + CAPI (confirmed)

## Confirmed facts (official docs, 2026)

### Meta Pixel (browser)

- Advanced Matching: pass **plain** `em`, `fn`, `ln`, `ph` into `fbq('init', PIXEL_ID, { em, fn })`.
- Meta: **“Values will be hashed automatically by the pixel using SHA-256.”**
- You **may** send already-hashed SHA-256 emails; you do **not** need to. **Do not hash on web.**

### Meta Conversions API (server)

- Contact info **must be hashed** SHA-256 **after normalize**, or the Business SDK hashes for you. Unhashed contact fields are rejected.
- **Do not hash:** `client_ip_address`, `client_user_agent`, `fbp`, `fbc`, `event_source_url`, `external_id` (external_id **is** recommended hashed by some guides; Meta says external_id hashing is optional — **hash it** as SHA-256 of raw id for consistency).
- Required for web quality: `action_source=website`, `event_source_url`, `client_user_agent`, `client_ip_address`.
- Dedup: same `event_id` + same `event_name` on Pixel and CAPI within **48h**. Pixel: `fbq('track', 'Purchase', data, { eventID })`.

Normalize then hash:

| Field | Normalize | Hash |
| --- | --- | --- |
| em | trim, lowercase | SHA-256 hex |
| ph | digits only + country code | SHA-256 |
| fn, ln | lowercase, no punct | SHA-256 |
| ct | lowercase, no spaces | SHA-256 |
| st | US 2-letter lowercase | SHA-256 |
| zp | lowercase, no dash | SHA-256 |
| country | ISO-2 lowercase | SHA-256 |

We often only have **name + email**. Split name on first space → `fn` / `ln`. Always send `em`.

Endpoint: `POST https://graph.facebook.com/v21.0/{PIXEL_ID}/events?access_token={TOKEN}`

```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1710000000,
    "event_id": "SAME-AS-PIXEL",
    "action_source": "website",
    "event_source_url": "https://digi-world.online/ar",
    "user_data": {
      "em": ["<sha256>"],
      "fn": ["<sha256>"],
      "ln": ["<sha256>"],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "Mozilla/...",
      "fbp": "fb.1....",
      "fbc": "fb.1.TIME.fbclid"
    },
    "custom_data": {
      "currency": "USD",
      "value": 29.00,
      "content_type": "product",
      "contents": [{"id":"DW-SYS-001","quantity":1,"item_price":29.00}],
      "order_id": "DW-2026-XXXX"
    }
  }],
  "test_event_code": "TEST12345"
}
```

`test_event_code` only when `META_TEST_EVENT_CODE` set.

### TikTok Pixel (browser)

- `ttq.load(PIXEL_ID)` + `ttq.page()`.
- Identify with **plain** email: `ttq.identify({ email })`.
- Track: `ttq.track('CompletePayment', { value, currency, contents, content_type }, { event_id })`.
- **Manually** persist `ttclid` from URL → cookie. Pixel does not invent it.

### TikTok Events API (server)

- `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`
- Header: `Access-Token: {TIKTOK_ACCESS_TOKEN}`
- **Hash email** (lowercase trim) SHA-256; **hash phone** E.164 then SHA-256.
- **Do not hash:** `ip`, `user_agent`, `ttclid`, `ttp`.
- Dedup: same `event_id` + event name, 48h. Use both Pixel + Events API.

```json
{
  "event_source": "web",
  "event_source_id": "PIXEL_CODE",
  "data": [{
    "event": "CompletePayment",
    "event_time": 1710000000,
    "event_id": "SAME",
    "user": {
      "email": "<sha256>",
      "phone": "<sha256 optional>",
      "ip": "1.2.3.4",
      "user_agent": "...",
      "ttclid": "...",
      "ttp": "cookie _ttp if present",
      "external_id": "<sha256 of email or order>"
    },
    "page": { "url": "https://digi-world.online/ar", "referrer": "..." },
    "properties": {
      "currency": "USD",
      "value": 29.00,
      "contents": [{"content_id":"DW-SYS-001","content_type":"product","content_name":"Creator OS","quantity":1,"price":29.00}]
    }
  }]
}
```

Event name map (TikTok ≠ Meta):

| Funnel | Meta | TikTok | Snap |
| --- | --- | --- | --- |
| Page | PageView | Pageview | PAGE_VIEW |
| View product | ViewContent | ViewContent | VIEW_CONTENT |
| Add to cart | AddToCart | AddToCart | ADD_CART |
| Checkout open | InitiateCheckout | InitiateCheckout | START_CHECKOUT |
| Email submit | Lead + Purchase | SubmitForm + CompletePayment | SIGN_UP + PURCHASE |
| Upsell accept | Purchase | CompletePayment | PURCHASE |

v1: send **PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase** (and TikTok/Snap equivalents). CompletePayment = Purchase.

### Snap Pixel (browser)

- `snaptr('init', PIXEL_ID, { user_email: plain })` — pixel hashes.
- `snaptr('track', 'PAGE_VIEW')` etc.
- Capture `ScCid` → `sc_click_id`. `_scid` cookie → CAPI `sc_cookie1`.
- Dedup: pass `client_dedup_id` on pixel events matching CAPI `event_id`. Purchase can also use `transaction_id` = order public_id.

### Snap CAPI v3 (server)

- `POST https://tr.snapchat.com/v3/{PIXEL_ID}/events?access_token={TOKEN}`
- PII in `user_data.em` / `ph` is **SHA-256**.
- **Do not hash:** `client_ip_address`, `client_user_agent`, `sc_click_id`, `sc_cookie1`.
- `action_source`: `WEB` (or `website` per payload — **use `WEB`** as in official examples).
- `event_name`: `PURCHASE`, `ADD_CART`, `PAGE_VIEW`, `VIEW_CONTENT`, `START_CHECKOUT`, `SIGN_UP`.
- Dedup: `event_id` on CAPI = pixel `client_dedup_id` (non-purchase) or `transaction_id` (purchase). **Send event_id on both always**, plus `transaction_id` = order public_id on Purchase.
- `event_time`: unix **seconds** in official UsingTheAPI examples (some third-party posts say ms — **use seconds** as in Snap’s own `1705508777` example).

```json
{
  "data": [{
    "event_name": "PURCHASE",
    "event_time": 1705508777,
    "event_id": "SAME",
    "action_source": "WEB",
    "event_source_url": "https://digi-world.online/ar",
    "user_data": {
      "em": ["<sha256>"],
      "ph": [],
      "client_ip_address": "1.2.3.4",
      "client_user_agent": "...",
      "sc_click_id": "...",
      "sc_cookie1": "..."
    },
    "custom_data": {
      "currency": "USD",
      "value": "29.00",
      "contents": [{"id":"DW-SYS-001","quantity":"1","item_price":"29"}],
      "order_id": "DW-2026-XXXX",
      "num_items": "1"
    }
  }]
}
```

## Web vs CAPI hashing (summary)

| Data | Web pixel | CAPI |
| --- | --- | --- |
| email, name, phone | **plain** (platform hashes) | **SHA-256 after normalize** |
| IP, UA | automatic on web | **plain** (Snap: IP sometimes hashed in v2; **v3 user_data.client_ip_address is NOT hashed**) |
| fbp, fbc, ttclid, ScCid, _scid | cookies | **plain** |
| event_id | plain, same | plain, same |

## Dedup rules

1. Generate `event_id` **once per user action** (uuid v4) on the client.
2. Pass to pixel and to `/track` or `/orders`.
3. Never generate a second id in the server for the same action.
4. Event names must match **within each platform** (Pixel Purchase ↔ CAPI Purchase). TikTok uses different strings; that’s OK — TikTok dedups against TikTok Pixel, not against Meta.

## Deferred loading (speed)

```tsx
<Script id="meta-pixel" strategy="lazyOnload" onLoad={() => flushQueue('meta')} />
```

Queue:

```ts
window.dwq = window.dwq || []
// dwq.push({ platform:'meta', event:'AddToCart', params, eventID })
```

On thank-you / checkout success, if scripts not loaded, inject with `afterInteractive` immediately.

Do not put pixels in `beforeInteractive`.

## Consent

EU/UK/some US states: load marketing pixels after accept. Click IDs still stored first-party (needed for attribution). If reject: **still send CAPI Purchase** with hashed email (legitimate interest / contract — legal doc should mention ads measurement). If you want strict: `CAPI_REQUIRE_CONSENT=true`. Default **false** so Snap/TikTok ads can optimize.

## Content IDs

Always SKU (`DW-SYS-001`). Same IDs in pixel and CAPI for catalogs later.

## IP

From `X-Forwarded-For` first hop (EasyPanel proxy). Don’t use server IP.

## Test

- Meta Events Manager Test Events
- TikTok Test Event Code if available (`test_event_code` analog — TikTok uses `test_event_code` in some versions; include if env set)
- Snap validate endpoint `POST /v3/{pixel}/events/validate`

Log CAPI HTTP status. Never block checkout on CAPI failure.
