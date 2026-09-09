# 00 — Start here (AI coder)

You are implementing **Digi World**, a premium global DTC store for original digital systems. The brand owns the products. The site must convert paid Snapchat / TikTok / Meta traffic at a very high rate and raise AOV with offers, cart cross-sells, and a timed post-checkout upsell.

Read every file in `docs/` before writing code. If copy, price, color, event name, or payload in your head disagrees with a doc, the doc wins.

## Delivery you must produce

```
frontend/     Next.js store, Docker, .env.example
backend/      FastAPI, Alembic, Docker, .env.example
```

Also copy from `docs/assets/`:

- `frontend/.env.example`
- `backend/.env.example`
- Keep the sheet CSV + Apps Script in `docs/assets/sheets/` (do not rewrite columns)

Root `README.md` should be a short deploy pointer, not a second spec.

## Non-negotiables

1. **Looks owned.** Product names, covers, and copy are Digi World IP. Never say “templates pack”, “PLR”, “Gumroad style”, or “inspired by Notion”. We sell **systems**.
2. **Bilingual.** `ar` (Saudi dialect, RTL) + `en`. Locale in the URL: `/ar/...` and `/en/...`. Default locale: `ar` (ads will often be Arabic; English users still get a first-class store).
3. **Header.** Start-edge: gold brand circle + wordmark `Digi World` (text, no icon font logo). Then nav. End-edge: cart. In Arabic RTL the circle sits on the right. In English LTR it sits on the left.
4. **Product CTA** adds the selected offer to cart **and opens the cart drawer**. Cross-sells live in the drawer.
5. **Cart CTA** opens a **checkout popup** (not a full page). Fields: **name + email only**. Order summary + social proof + scarcity in the popup.
6. **After submit:** 10–15s upsell of a mapped relevant product. **This is the only place a product is discounted.** Then thank-you page.
7. **Orders** persist in Postgres **and** POST to the Google Sheet webhook with full order JSON.
8. **Pixels.** Meta + TikTok + Snapchat **web pixels (deferred)** + **CAPI**. Shared `event_id`. Web: no hashing required (plain user data). CAPI: SHA-256 after normalize. Dedup on.
9. **Responsive.** Mobile-first. Paid traffic is phone-first.
10. **No fake payment theater.** v1 checkout is name+email (lead-order). Architecture must be Stripe/Moyasar-ready via `CHECKOUT_MODE`. Default `lead`. Thank-you still feels like a completed premium purchase (confirmation, next steps, delivery promise).
11. **Images** from `docs/21-IMAGE-SYSTEM.md`. Generate or source them into `frontend/public/images/`. No random Unsplash office stock.
12. **Docker** for both apps. Migrations run on backend start.
13. **Do not commit secrets.** `.env` gitignored. EasyPanel env from `.env.example` keys.

## Build order

1. Scaffold `frontend/` + `backend/` + Docker + env examples
2. Design tokens, fonts, header, footer, RTL
3. Seed catalog from `04-PRODUCT-CATALOG.md` (JSON + DB seed)
4. Home → Collection → Product → About → Contact → Legal
5. Cart drawer + offers + cross-sells
6. Checkout popup + upsell overlay + thank-you
7. FastAPI orders + tracking CAPI + sheet webhook
8. Pixels + click-id cookies + event queue
9. Seed images
10. Perf, SEO, policies, i18n pass
11. EasyPanel smoke: health, CORS, migrate, one test order

## Quality bar

This must feel like a 2026 brand house (Aesop × Linear × a Gulf luxury house), not a Tailwind template. Tight type, lots of air, gold used as a signal not as chrome, photography that looks directed. If a section does not increase trust, desire, or AOV, delete it.
