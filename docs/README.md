# Digi World — Documentation Hub

This folder is the **single source of truth** for building [digi-world.online](https://digi-world.online).

Digi World is a premium DTC digital-products brand. We do **not** look like an Etsy dump, a Gumroad link-in-bio, or a PLR reseller. We look like the company that **invented** these systems and licenses them worldwide.

**Sell everywhere. Speak in two languages.** Storefront is bilingual: Arabic (Saudi dialect, RTL) + English. Ads on Snapchat / TikTok / Meta will send traffic globally. Currency is **USD**.

## Read this first

If you are the AI coder implementing the site, open:

1. [00-START-HERE.md](./00-START-HERE.md)
2. [24-AI-CODER-PROMPT.md](./24-AI-CODER-PROMPT.md)
3. Then follow the reading order below. Do not skip brand, ICP, CRO, or tracking.

## Document map

| File | What it decides |
| --- | --- |
| [00-START-HERE.md](./00-START-HERE.md) | Delivery shape, non-negotiables, build order |
| [01-BRAND.md](./01-BRAND.md) | Name, color, logo, voice, visual world |
| [02-POSITIONING.md](./02-POSITIONING.md) | Category, enemy, promise, proof stack |
| [03-ICP-AND-LANGUAGE.md](./03-ICP-AND-LANGUAGE.md) | Who we sell to, dialect, bilingual rules |
| [04-PRODUCT-CATALOG.md](./04-PRODUCT-CATALOG.md) | SKUs we own, collections, what we do **not** sell |
| [05-PRICING-AND-OFFERS.md](./05-PRICING-AND-OFFERS.md) | $19 / $29 ladders, bundles, AOV math |
| [06-COPY-AND-EMOTION.md](./06-COPY-AND-EMOTION.md) | Pain, desire, KSA dialect + English copy blocks |
| [07-SOCIAL-PROOF-AND-AUTHORITY.md](./07-SOCIAL-PROOF-AND-AUTHORITY.md) | Stars, certs, science, trust furniture |
| [08-CRO.md](./08-CRO.md) | Funnel, scarcity, cart, upsell, confirmation |
| [09-DESIGN-SYSTEM.md](./09-DESIGN-SYSTEM.md) | Tokens, type, layout, motion, RTL |
| [10-PAGES-AND-IA.md](./10-PAGES-AND-IA.md) | Every page, every section, in order |
| [11-COMPONENTS.md](./11-COMPONENTS.md) | Component API the coder must build |
| [12-ARCHITECTURE.md](./12-ARCHITECTURE.md) | Frontend / backend / DB / pixels / sheet |
| [13-FRONTEND.md](./13-FRONTEND.md) | Next.js stack, folders, libraries |
| [14-BACKEND.md](./14-BACKEND.md) | FastAPI stack, endpoints, startup migrations |
| [15-DATABASE.md](./15-DATABASE.md) | PostgreSQL `digi-world` schema |
| [16-CHECKOUT-CART-UPSELL.md](./16-CHECKOUT-CART-UPSELL.md) | Exact purchase UX |
| [17-TRACKING-PIXELS-CAPI.md](./17-TRACKING-PIXELS-CAPI.md) | Meta / TikTok / Snap web + CAPI, hash, dedup |
| [18-GOOGLE-SHEETS.md](./18-GOOGLE-SHEETS.md) | Webhook, Apps Script, CSV columns |
| [19-DEPLOYMENT.md](./19-DEPLOYMENT.md) | Docker, EasyPanel, domains, env |
| [20-CODING-RULES.md](./20-CODING-RULES.md) | Hard rules for the AI editor |
| [21-IMAGE-SYSTEM.md](./21-IMAGE-SYSTEM.md) | Hero / product / collection image spec + prompts |
| [22-LEGAL-SEO-PERF.md](./22-LEGAL-SEO-PERF.md) | Policies, SEO, speed, cookies |
| [23-ETSY-REDBUBBLE.md](./23-ETSY-REDBUBBLE.md) | Off-site SKU strategy (do not look like a reseller) |
| [24-AI-CODER-PROMPT.md](./24-AI-CODER-PROMPT.md) | Paste-this prompt for the implementing agent |
| [25-FAQ-AND-PDP-COPY.md](./25-FAQ-AND-PDP-COPY.md) | FAQs, guarantee, “not for” lines |
| [skills/frontend.md](./skills/frontend.md) | Frontend implementation skill |
| [skills/backend.md](./skills/backend.md) | Backend implementation skill |

## Assets the coder must copy into the repo

| Asset | Copy to |
| --- | --- |
| [assets/env/frontend.env.example](./assets/env/frontend.env.example) | `frontend/.env.example` |
| [assets/env/backend.env.example](./assets/env/backend.env.example) | `backend/.env.example` |
| [assets/sheets/orders-template.csv](./assets/sheets/orders-template.csv) | Import as first Google Sheet tab |
| [assets/sheets/contacts-template.csv](./assets/sheets/contacts-template.csv) | Optional contacts tab |
| [assets/sheets/apps-script-webhook.js](./assets/sheets/apps-script-webhook.js) | Paste into Apps Script, deploy as web app |
| [assets/catalog/seed.json](./assets/catalog/seed.json) | Seed prices/SKUs (copy into backend seed) |
| [assets/images/](./assets/images/) | Directed product/hero stills |

## Domains

- Store: `https://digi-world.online`
- API: `https://api.digi-world.online`
- Database name: `digi-world` (PostgreSQL on EasyPanel)

## What this repo must look like when the coder is done

```
digi-world/
  docs/                  (this folder — already exists)
  frontend/              Next.js 15 App Router store
  backend/               FastAPI + Alembic + Docker
  .gitignore
  README.md              short project readme pointing at docs/
```

Do not invent a third app. Do not put storefront code in `docs/`.
