# 10 — Pages and information architecture

Locales: `/ar/...` `/en/...`. Redirect `/` → `/ar` or cookie/detect.

## Routes

| Path | Page |
| --- | --- |
| `/[locale]` | Home |
| `/[locale]/collections` | All collections |
| `/[locale]/collections/[collection]` | Collection |
| `/[locale]/systems/[slug]` | Product / system PDP |
| `/[locale]/about` | About |
| `/[locale]/contact` | Contact |
| `/[locale]/thank-you` | Thank you (`?order=`) |
| `/[locale]/legal/privacy` | Privacy |
| `/[locale]/legal/terms` | Terms |
| `/[locale]/legal/refunds` | Refunds / guarantee |
| `/[locale]/legal/cookies` | Cookies |
| `/[locale]/faq` | FAQ (can be section on About; still make route) |

Cart and checkout are **overlays**, not routes.

## Home — section list (in order)

1. **Header**
2. **Hero** — fullscreen-ish (min 88vh). Background: cinematic studio still (see images). Overlay gradient ink. Eyebrow, H1, sub, 2 CTAs, stats row, tiny “Drop 01”.
3. **Asymmetric intro** — Split: manifesto text + product still
4. **Systems grid** — 8 systems as cards + vault card featured
5. **Collections row** — 4 collection covers
6. **Why Digi World** — 3 pillars (original / certified / instant worldwide)
7. **Science strip** — 3 short cards
8. **Social proof marquee** — reviews
9. **UGC / ads style** — 3 phones (placeholder frames) “as seen in our Snap & TikTok”
10. **Guarantee + delivery**
11. **Final CTA band**
12. **Footer**

## Collection page

- Hero: collection name, sub, cover image
- Filter: none in v1 (small catalog)
- Grid of products (cards)
- Split story
- Vault upsell strip
- Footer

## Product page

See CRO section order. Gallery 3–4 directed images + dots. Offer tiles. Sticky CTA. Alternating splits (what it is, who it’s for, inside the vault). FAQ accordion 6 questions.

## About

- Studio manifesto
- Split: “Why we don’t sell files”
- Timeline Drop 01
- Certification explanation
- Team later; v1 “The studio”
- CTA to collections

Copy AR title: `الدار`  
EN: `The house`

## Contact

- Email `hello@digi-world.online`
- Optional form: name, email, message → backend `/contact` → sheet tab `contacts` optional or same webhook `type=contact`
- WhatsApp link env `NEXT_PUBLIC_WHATSAPP`
- Response time promise: 24h

## Thank you

- Checkmark gold circle
- Order id
- Items
- Email reminder
- Numbered next steps
- Support
- Secondary CTA: continue to systems (not a hard sell)

If order missing, friendly error + contact.

## 404

Wordmark, “This system doesn’t exist.” CTA home.
