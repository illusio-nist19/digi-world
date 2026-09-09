# 07 — Social proof, authority, trust

ICP pays more when the store feels **institutional**. Build a proof stack. Prefer true data. If early, use **studio proof** not fake volume.

## Proof stack (every relevant page)

1. **Stars** — 4.8–5.0 display from real review table. Until ≥ 8 reviews, show qualitative studio quotes without a fake 12k count.
2. **Licenses issued** — live SUM from orders (`status` in `confirmed`, `paid`, `fulfilled`).
3. **Drop badge** — Drop 01 · 2026
4. **DW Certified** — gold ring mark
5. **Press / as-seen** — only real; v1 can omit rather than fake TechCrunch
6. **UGC strip** — phone screenshots / quote cards (seed 6 real-looking but **labeled** as studio community only if fictional — **do not fabricate user names + photos as customers**. Use first-name-only quotes from a `reviews` table you will fill. Seed 3 reviews clearly marked `source=studio_preview` and hide them when `PROOF_MODE=live` and real reviews exist.)
7. **Guarantee** — 7-day “vault replacement / not a fit” digital guarantee (see legal)
8. **Secure** — TLS, privacy, no we sell your email
9. **Delivery** — instant digital, worldwide
10. **Founder / studio** — About page, real photo later; v1 use studio still + manifesto

## Where they go

| Surface | Proof |
| --- | --- |
| Header | none (keep clean) except optional tiny “Drop 01” |
| Home | logo row (optional), stats, review marquee, certified, guarantee |
| Collection | stars on cards, licenses on card optional |
| Product card | stars + count, scarcity, certified chip |
| PDP | stars under title, review list, “why DW”, science, guarantee, FAQ, licenses bar |
| Cart | 2 mini quotes + “N licenses this week” |
| Checkout | lock icon, 1 quote, license scarcity, “no spam” |
| Upsell | “people who took this stacked X%” only if true; else skip stat |
| Thank you | “what happens next”, support email, community |

## Review object

```
id, product_sku, locale, stars, title, body, display_name, city_country, verified, source, created_at
```

`display_name` like `Sara · RUH` or `James · LON`. No stolen celebrity faces.

## Authority blocks (PDP section `AuthorityBoard`)

- Studio original serial
- Quality checklist (5 ticks): sequenced, bilingual where relevant, start-here, updated drop, licensed
- “Used by creators and operators in 40+ countries” — **only if true**. v1: “Shipped digitally to every country on earth.”
- Payment/data: “We never sell your email. Used to deliver your vault.”

## Certifications we can claim (v1)

Real:

- DW Certified System (our mark)
- Secure checkout over HTTPS
- GDPR-ready privacy policy
- Instant digital goods

Do **not** put fake ISO 9001, fake Meta Business Partner badges, fake “TikTok Official” unless you enroll.

Later: Meta/TikTok/Snap partner badges when actually enrolled.

## Trust near money

Checkout popup must include:

- Stars row
- 1 short review
- “Name + email only”
- “We’ll only email vault / order”
- Gold lock + `digi-world.online`
- Remaining licenses if < 80

## Confirmation / delivery (reduces refunds + chargebacks later)

Thank-you + email:

1. Order ID `DW-2026-XXXXXX`
2. What they bought (offer name)
3. When the vault arrives
4. How to get help (`hello@digi-world.online`)
5. Community / Snapchat waitlist CTA
6. “Add us to contacts so the mail doesn’t die in spam”
