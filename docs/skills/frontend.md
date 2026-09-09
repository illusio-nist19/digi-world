# Skill: Digi World frontend

Use with the rest of `docs/`.

## Stack

Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, next-intl, Zustand persist, Zod, framer-motion, lucide-react, next/font, next/script, next/image. pnpm.

## Must implement

- Locale middleware and `[locale]` tree
- Header with BrandCircle + wordmark + nav + lang + cart
- Footer IA from pages doc
- Home, collections, PDP, about, contact, thank-you, legal, faq
- Cart drawer, checkout modal, 12s upsell
- Sticky mobile CTA on PDP
- Split sections flipping
- Pixel queue + click IDs
- SEO metadata + JSON-LD
- Cookie banner
- Responsive, RTL, no horizontal scroll at 375px

## Cart API

`addOffer({ sku, offerId })` encodes pricing from `lib/offers.ts` matching `05-PRICING-AND-OFFERS.md`.

## Tracking

`lib/tracking/track.ts`:

```ts
track(eventName, { meta, tiktok, snap, params, value, currency, contents, event_id? })
```

Always mint or accept `event_id`. Flush to pixels when loaded. POST `/track` except Purchase (orders endpoint sends CAPI Purchase). Still fire Purchase on the **web** pixels from the client with the same id the order payload used.

## Copy

Never inline; use `useTranslations`. Arabic Glow pages feminine.

## Images

`public/images/...` as in 21. Placeholder gold-on-ink gradient only if generation fails, with TODO comment.
