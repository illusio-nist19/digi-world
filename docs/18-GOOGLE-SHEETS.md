# 18 — Google Sheet orders

Operator UI for v1 is a Google Sheet. Backend POSTs JSON to an **Apps Script web app**.

## Setup

1. Create a Google Sheet named `Digi World Orders`.
2. Import `docs/assets/sheets/orders-template.csv` as tab `orders` (headers row 1).
3. Optional tab `contacts` — import isn’t required; script creates headers if missing.
4. Extensions → Apps Script. Paste `docs/assets/sheets/apps-script-webhook.js`.
5. Deploy → New deployment → Type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (the URL is the secret)
6. Copy the web app URL into backend env `SHEET_WEBHOOK_URL`.
7. In script Properties set `WEBHOOK_SECRET` to a long random string. Same value in backend `SHEET_WEBHOOK_SECRET`.

Apps Script **does not reliably receive custom headers**. Backend must send the secret in **all** of these:

- JSON body field `secret`
- Query `?secret=`
- Header `X-Webhook-Secret` (best-effort)

The script accepts any one match.

If Google returns HTML login page, the deployment access is wrong.

## Payload (`type: order`)

See CSV columns. Backend sends a flat object plus `items_json` stringified.

## Failure

Retry 3 times. Order still succeeds in Postgres. Status flag `sheet_ok` in logs.

## Manual test

```bash
curl -X POST "$SHEET_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $SHEET_WEBHOOK_SECRET" \
  -d '{"type":"order","secret":"YOUR_SECRET","order_id":"DW-2026-TEST01","customer_email":"test@digi-world.online"}'
```
