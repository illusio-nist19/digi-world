# 08 — CRO (conversion rate, AOV, confirmation)

Target: **cold paid traffic on mobile** from Snap/TikTok/Reels. Page must sell without a salesperson.

## Funnel

```
Ad → Home or PDP
  → Offer select
  → CTA: add offer + OPEN CART
  → Cart: summary + cross-sells
  → CTA: checkout popup
  → Name + email
  → 12s upsell
  → Thank you + CAPI Purchase + sheet
```

Ads should often land on **PDP** (`utm` + `?src=ad`). Home still has to close people who wander.

## CRO principles (do these)

1. **One primary CTA color** — gold, same everywhere.
2. **CTA verb = outcome** — “Add to vault” not “Submit”.
3. **Offer default** — Duo highlighted, Solo still one tap.
4. **Open cart on add** — mandatory. They must see cross-sells.
5. **Cross-sells in cart, not before the first add** — don’t stall the first conversion.
6. **Checkout is a modal** — keeps them in context; less bounce than `/checkout`.
7. **Two fields only** — name, email. HTML5 validation + Zod.
8. **Upsell after commit of email** — they already said yes. Discount only here.
9. **Thank-you is a product** — reduces “did it work?” rage-clicks.
10. **Speed** — LCP < 2.5s on 4G. Pixels deferred. Images AVIF/WebP.
11. **RTL/LTR** doesn’t break sticky CTA.
12. **Sticky mobile buy bar** on PDP: price + CTA, above thumb.

## Product card CRO

Every card (home, collection, cart cross-sell):

- Cover image
- Drop chip
- Title + sub
- Stars + review count
- Price from `$19` or addon `$12`
- Scarcity line if pool low
- CTA `View system` (cards) — PDP does the add

## PDP section order (do not reshuffle without reason)

1. Gallery (3–4 images) + offer stack (sticky on desktop right / LTR)
2. For RTL: offer stack on left visually (start edge)
3. Alternating story sections (image | text, then flip)
4. What’s inside (checklist)
5. Who it’s for / not for
6. Authority + science
7. Reviews
8. FAQ
9. Pair / vault strip
10. Final CTA band

Mobile: gallery → title/stars/scarcity → offer tiles → sticky bar → rest.

## Scarcity & offers

- License pool bar
- Drop countdown if `drop_ends_at` set
- Duo save $9 as **gain**, not panic

## Cart drawer CRO

- Line items with offer name (`Creator OS · Duo`)
- Edit offer? Keep simple: qty + remove
- Cross-sell carousel (2–3)
- Subtotal
- Micro proof
- CTA full width
- Secondary: continue shopping

## Checkout popup CRO

- Order summary (items, total)
- Proof + scarcity
- Name, email
- CTA
- Fine print 1 line
- Close X (don’t make it impossible — dark patterns kill ads accounts)

## Upsell CRO

- Full-screen overlay, product image, price `$11` with struck `$19`
- Timer ring 12s
- One CTA, one skip
- Do not stack 3 upsells in v1 (user asked one 10–15s upsell)

## Confirmation CRO (delivery / AOV after)

- Thank-you shares “send to a friend” duo residual? skip v1
- Email sequence (optional later): T+0 vault, T+1 start-here, T+3 unused upsell
- WhatsApp click-to-chat with prefilled order id

## Anti-patterns (forbidden)

- Auto-adding extras to cart
- Fake chat widgets with “Sarah is typing”
- Exit intent 40% off (breaks “only upsell discounts”)
- Popups on first 2 seconds of landing from ads
- Cookie walls that block the whole PDP before content (banner only)
