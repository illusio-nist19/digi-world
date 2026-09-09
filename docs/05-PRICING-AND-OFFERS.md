# 05 — Pricing and offers (high AOV)

Currency: **USD**. Show `$19` and microcopy `USD`. Optional SAR approximate in AR UI as `≈ 71 ر.س` using a fixed rate env `SAR_PER_USD` (default `3.75`) — **charge is still USD** in v1.

## Philosophy

- PDP price looks accessible ($19) so cold ads convert.
- Structure pulls AOV to **$35–$70** without feeling scammy.
- **The only discounted SKU price is the post-checkout upsell.**
- Duo $29 is a **quantity offer** (2 licenses of the same system), framed as gift / second brain / partner — not “50% off”.

## Core system ladder (SKU type `system`)

On every system PDP, an **OfferCard** with 3 selectable tiles (default = Duo on mobile after 8s if they haven’t chosen — do not force; highlight Duo as `الأكثر طلباً / Most chosen`).

| Offer id | What they get | Price | Compare | Badge |
| --- | --- | --- | --- | --- |
| `solo` | 1 license of this system | **$19** | — | — |
| `duo` | 2 licenses of this system | **$29** | $38 | MOST CHOSEN / الأكثر اختياراً |
| `pair` | This system + mapped pair system (1 license each) | **$34** | $38 | SYSTEM PAIR / ثنائي النظام |

Mapped pairs:

| Product | Pair (for `pair` offer) |
| --- | --- |
| creator-os | hook-vault |
| faceless-studio | creator-os |
| hook-vault | caption-machine (if pairing with addon, still $34 vs $31 — **exception:** hook+caption pair = **$27** vs $31) |
| ai-operator | offer-engine |
| offer-engine | ai-operator |
| wealth-os | time-command |
| glow-ritual | time-command |
| time-command | wealth-os |

Vault is **not** a tile on every PDP; it is a strip below: “Unlock the whole house — $97”.

## Add-on pricing

`$12` each. No duo tile. Cart can increment qty (2 for $24 — no automatic $29, that ladder is for systems).

## Vault

`$97` (show struck `$188`). Duo vault `$149`.

## Cart cross-sells (full price)

Drawer shows 2–3 cards: “Complete the system”. Price = catalog price. One-tap add. Recalc totals live.

Rules:

- Prefer SKUs not already in cart
- Prefer `cross-sell` list from the first system in cart
- If cart is vault, cross-sell **nothing** (they own the house). Show “You’re holding the vault.” + reviews.

## Post-checkout upsell (ONLY discount)

Timer **12 seconds** (range 10–15; use 12). One product. One CTA. Skip link.

Price: **$11** for a $19 system, **$9** for a $12 add-on, **$67** for vault.

Do not upsell something already in the order. Fallback: `launch-sprint` at $9, then vault at $67.

Yes / No:

- Accept: add line `upsell`, price as discounted, `discount_reason=post_purchase_upsell`, extend timer? **No.** Close overlay, go thank-you.
- Skip or timeout: thank-you with original order.

## Target AOV paths

| Path | Math | AOV |
| --- | --- | --- |
| Solo + 1 cross-sell + upsell | 19+12+11 | $42 |
| Duo + cross-sell | 29+12 | $41 |
| Pair + upsell | 34+11 | $45 |
| Duo + 2 cross-sells + upsell | 29+12+12+11 | $64 |
| Vault | 97 | $97 |
| Any + vault upsell | e.g. 29+67 | $96 |

Homepage and ads can say “from $19”. Never say “from $9”.

## Price presentation

- Big number in Syne: `$19`
- Small: `USD · instant vault`
- Duo tile shows `$29` and `You save $9` / `توفر 9$`
- Never show fake MSRP like `$199` on a $19 item. Vault may show true stack `$188`.

## Scarcity (must be real)

Each drop has `license_pool` (e.g. 500) and `licenses_issued`. UI: “184 / 500 licenses this drop”. When pool < 40, show urgency styles. When 0, waitlist.

Optional offer timer: `drop_ends_at` ISO datetime. If unset, hide countdown.

Do not fake “5 people viewing” with random numbers. If you show viewers, use real active sessions (optional later). v1: license pool + “Drop 01”.

## Taxes

v1: no tax calculated. Prices are gross USD. Footer: “Digital item · USD”.
