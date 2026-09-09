# 24 — Prompt to paste into your AI coder

Copy everything in the fenced block below.

```
You are a senior full-stack engineer and DTC ecom implementer. Build the complete Digi World store from the documentation already in this repo.

## Mission
Ship a production-ready bilingual (ar Saudi dialect RTL + en) premium DTC store for original digital systems at https://digi-world.online with API https://api.digi-world.online.

Create TWO folders at the repo root:
- frontend/  Next.js 15 App Router, React 19, TypeScript, Tailwind v4, next-intl, Zustand, Zod, framer-motion, lucide-react, pnpm, Dockerfile
- backend/   Python 3.12 FastAPI, SQLAlchemy 2 async + asyncpg, Alembic (upgrade head on startup), Pydantic v2, httpx, Docker

Do not put application code inside docs/. Follow every file in docs/ as the spec. Start by reading:
docs/README.md
docs/00-START-HERE.md
docs/01-BRAND.md
docs/02-POSITIONING.md
docs/03-ICP-AND-LANGUAGE.md
docs/04-PRODUCT-CATALOG.md
docs/05-PRICING-AND-OFFERS.md
docs/06-COPY-AND-EMOTION.md
docs/07-SOCIAL-PROOF-AND-AUTHORITY.md
docs/08-CRO.md
docs/09-DESIGN-SYSTEM.md
docs/10-PAGES-AND-IA.md
docs/11-COMPONENTS.md
docs/12-ARCHITECTURE.md
docs/13-FRONTEND.md
docs/14-BACKEND.md
docs/15-DATABASE.md
docs/16-CHECKOUT-CART-UPSELL.md
docs/17-TRACKING-PIXELS-CAPI.md
docs/18-GOOGLE-SHEETS.md
docs/19-DEPLOYMENT.md
docs/20-CODING-RULES.md
docs/21-IMAGE-SYSTEM.md
docs/22-LEGAL-SEO-PERF.md
docs/23-ETSY-REDBUBBLE.md
docs/25-FAQ-AND-PDP-COPY.md
docs/skills/frontend.md
docs/skills/backend.md

Copy env examples:
docs/assets/env/frontend.env.example → frontend/.env.example
docs/assets/env/backend.env.example → backend/.env.example

## Brand UI
- Name: Digi World (text wordmark, Syne 700)
- Header START edge: gold circle #C6A35A with “DW” in ink, then wordmark, then nav, then language toggle + cart on END edge
- Arabic RTL: circle sits on the RIGHT
- Colors, type, components, pages: exact docs
- Looks like we OWN the products: serials, DW Certified, Drop 01, studio photography

## Catalog & money
Seed all SKUs in 04. Systems: $19 solo / $29 duo / $34 pair (hook+caption pair $27). Add-ons $12. Vault $97. Cross-sells in CART DRAWER at full price. The ONLY discount is the 12s post-checkout upsell ($11 systems / $9 add-ons / $67 vault).

## Funnel (exact)
PDP CTA adds selected offer to cart AND opens cart drawer (cross-sells there).
Cart CTA opens checkout POPUP: order summary, social proof, scarcity, name + email only.
Submit → POST backend /orders → 12s upsell overlay → thank-you page.
Also write order to Google Sheet webhook. CAPI + web pixels with shared event_id.

## Tracking
Meta + TikTok + Snapchat web pixels DEFERRED (next/script lazyOnload, queue events; afterInteractive on thank-you if needed).
CAPI from FastAPI. Web: NO hashing of email. CAPI: SHA-256 after normalize. Dedup event_id. Capture fbclid/_fbc/_fbp, ttclid, ScCid/_scid. See docs/17.

## Checkout mode
CHECKOUT_MODE=lead default (name+email). Thank-you still feels like a completed purchase. Stripe-ready later, do not implement Stripe now.

## Images
Create frontend/public/images per docs/21. Generate or use high-quality directed stills (ink + gold). No random Unsplash coworking photos. Hero + 3–4 per product + collection covers + OG.

## Docker / EasyPanel
Dockerfiles for both apps. Backend runs Alembic on start. Postgres database name digi-world. Convert postgres:// to postgresql+asyncpg://. CORS locked to the store domain.

## i18n
next-intl. All copy in messages/ar.json (Saudi dialect marketing, MSA legal) and messages/en.json. Routes /ar and /en. Default ar.

## Done means
- docker build works for both
- /health and /health/db
- full funnel clickable on mobile + desktop
- sheet payload matches docs/assets/sheets/orders-template.csv
- pixels queued + CAPI hashed
- empty-state-proof: catalog seeded
- root README short; docs remain source of truth

Build it now. Do not ask to shrink scope. If something is missing, add it in the spirit of max CRO, authority, and a 2026 branded DTC house.
```

That is the prompt. The files in `docs/` are what it refers to.
