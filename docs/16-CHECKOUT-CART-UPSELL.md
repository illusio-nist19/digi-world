# 16 — Cart, checkout, upsell (exact UX)

## Add to vault (PDP)

1. User selects offer tile (solo $19 / duo $29 / pair $34).
2. Clicks primary CTA.
3. Cart store appends a **single line** representing the offer (not 2 anonymous lines without offer_id).
4. Fire `AddToCart` pixel + `/track` with same `event_id`.
5. **Open cart drawer immediately.**

If pair: two SKUs as **one offer line** or two lines grouped. Prefer **two lines** with `offer_id=pair` and prices that sum to $34 (split $19+$15 or $17+$17 — use **catalog split**: primary $19, pair item $15 to total $34).

## Cart drawer

- Backdrop dim
- Slide from end-edge (right in LTR, left in RTL)
- Lines, remove, subtotal
- Cross-sells (add without closing drawer)
- Adding cross-sell fires AddToCart again (new event_id)
- CTA `Confirm details` → fires `InitiateCheckout` + opens **CheckoutModal** (drawer can stay under or close; **close drawer, open modal**)

## Checkout modal

- Title, summary, proof, scarcity
- Fields: `name` (required, 2–80 chars), `email` (required)
- Submit:
  1. Disable button
  2. `POST /orders`
  3. Fire web `Lead` or `Purchase`? For ads optimization we need **Purchase**. In lead mode, still send **Purchase** with value = total (you are optimizing for completed checkout form). Also send `Lead`. Same or different event_ids: **different**. Purchase uses `event_id` from client that you also send to CAPI.
  4. Close modal
  5. Open **UpsellOverlay** (12s) with mapped SKU
  6. Persist `order.public_id` in sessionStorage

Do not redirect yet.

## Upsell overlay

- If mapped SKU already in order, pick next fallback
- Accept → `POST /orders/{id}/upsell` with new `event_id`, fire Purchase for upsell value, then `router.push(/thank-you?order=PUBLIC_ID)`
- Skip / timeout → thank-you original order

## Thank you

`GET` order by public_id (endpoint may be public-read by id only — use unguessable `public_id` 10 chars Crockford).

Show confirmation. Fire `PageView` only; Purchase already fired.

## Cart persistence

Zustand persist key `dw_cart`. Clear cart **after** successful order POST (before upsell). Keep `lastOrderId` for upsell API.

## Failures

If order POST fails: re-enable form, show error AR/EN, keep cart.
