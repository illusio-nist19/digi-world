# 11 — Components (build these)

All UI in `frontend/src/components`. Client islands only when needed (cart, pixels, forms). Prefer server components for pages.

## Layout

- `BrandCircle` — gold circle, `DW`
- `Logo` — circle + wordmark
- `Header` — locale aware
- `Footer`
- `MobileNav`
- `LanguageToggle`
- `CartButton`
- `Container`
- `Section` — `tone: dark|light`, `flip` for splits
- `Split` — image + children
- `StickyCtaBar` — PDP mobile

## Product

- `ProductCard`
- `ProductGallery` — 3–4 images, swipe mobile
- `StarRow`
- `ScarcityBar` — licenses remaining
- `OfferTiles` — solo / duo / pair
- `AddToVaultButton` — adds selected offer, opens cart, fires AddToCart
- `WhatsInside`
- `ReviewList`
- `AuthorityBoard`
- `ScienceStrip`
- `FaqAccordion`
- `VaultStrip`
- `CrossSellRail`

## Cart / checkout

- `CartDrawer` — overlay, focus trap
- `CartLine`
- `CrossSellCard`
- `CheckoutModal`
- `OrderSummary`
- `UpsellOverlay` — 12s
- `ThankYouView`

## Trust

- `ProofMarquee`
- `GuaranteeNote`
- `CertifiedChip`
- `LockLine`

## Tracking / consent

- `CookieBanner` — accept/reject marketing. Pixels load after accept **or** after implicit if law allows. Default: show banner, load pixels on accept. Also honor `dw_consent=1` cookie. Still capture click IDs in first-party cookies on landing (non-PII).
- `PixelProvider` — queue + scripts

## Content

- `Hero`
- `JsonLd` — Product, Organization, FAQ

## Props contracts (must)

`AddToVaultButton`:

```ts
{
  sku: string
  offerId: 'solo' | 'duo' | 'pair' | 'vault' | 'addon'
  onAdded?: () => void
}
```

`CheckoutModal` submits `{ name, email, locale, cart, attribution, event_ids }`.

Do not build a generic shadcn dashboard. If you use shadcn, restyle to tokens. Recommended: **no shadcn** — custom components, fewer defaults that look like every SaaS.
