# 01 — Brand

## Name

**Digi World**

Never: DigiWorld, DIGIWORLD, digi world, Digi-World in the wordmark.

URL: `digi-world.online`  
Handle style: `@digiworld` if needed. On-site always **Digi World**.

## One-line

Digi World builds original digital operating systems for ambitious people who are done buying cheap files.

## Brand world

We are a **house of systems**, not a marketplace of downloads. The site must feel like the products were designed in one studio, numbered, certified, and released as a collection — the way a watchmaker releases calibers.

**Category we occupy:** Premium digital systems (creator, AI, money, beauty ritual).  
**Category we refuse:** Printable junk, Canva sludge, “5000 prompts PDF”.

## Logo

**No SVG mark.** Logo is type.

- Wordmark: `Digi World`
- Font: **Syne** (weight 700) for Latin. **IBM Plex Sans Arabic** (weight 600–700) when the UI is Arabic — still the same Latin wordmark `Digi World` next to the circle (brand name stays Latin globally, like “Apple”).
- Tracking: slightly tight, `-0.02em`
- Color: Ivory `#F4EFE6` on dark. Ink `#0B0C0E` on light.

### Brand circle (header)

A **filled circle**, 36px desktop / 32px mobile, brand gold `#C6A35A`. Inside the circle: letters **DW** in ink `#0B0C0E`, Syne 700, ~11–12px, optically centered.

Header start-edge:

```
[ ● DW ]  Digi World          Shop   Systems   About   Contact          🛒 2
```

Arabic RTL: circle + wordmark on the **right**, cart on the **left**.

The circle is the only “logo graphic”. Do not add a globe, a chip, a play button, or a gradient blob.

## Color system — Aurum Ink

| Token | Hex | Use |
| --- | --- | --- |
| `ink` | `#0B0C0E` | Page bg (dark), text on light |
| `ink-2` | `#14151A` | Elevated surfaces |
| `ink-3` | `#1C1E26` | Cards, drawers |
| `gold` | `#C6A35A` | Circle, CTAs, stars, key lines, price accent |
| `gold-2` | `#E2C98A` | Hover gold, highlights |
| `ivory` | `#F4EFE6` | Primary text on dark, light-section bg |
| `ivory-2` | `#FAF7F2` | Alternate light |
| `stone` | `#8A8478` | Muted labels |
| `line` | `#2A2C34` | Borders on dark |
| `line-light` | `#E6E0D4` | Borders on light |
| `danger` | `#C45C4A` | Errors, scarce “last units” (use sparingly) |
| `proof` | `#3E8C6A` | In-stock, verified, “delivered” |

**Rule:** 90% ink + ivory. Gold is a **signal** (CTA, circle, price, stars). If gold appears in more than ~8% of a viewport, you overused it.

Site default theme: **dark luxury**. Alternate sections on product pages flip to ivory so the page breathes. Alternate image/text sides (see pages doc).

## Type

| Role | Latin | Arabic |
| --- | --- | --- |
| Wordmark | Syne 700 | (keep Latin wordmark) |
| Display / H1 | Syne 600–700 | IBM Plex Sans Arabic 600–700 |
| Subheads | Instrument Sans 500 | IBM Plex Sans Arabic 500 |
| Body | Instrument Sans 400 | IBM Plex Sans Arabic 400 |
| UI / nav / buttons | Instrument Sans 500 | IBM Plex Sans Arabic 500 |
| Price / numbers | Syne 600 tabular | same (numbers stay western) |

Load via `next/font` (Google). No Typekit. Fallbacks: `ui-sans-serif, system-ui`.

**Never use:** Inter as the personality font (too default), Papyrus, Tajawal for display (fine as fallback only), Comic fonts, neon gradients on type.

## Voice

- Calm authority. Short sentences. Specific claims.
- We do not yell. Scarcity is factual (timer, remaining licenses this drop), not carnival.
- We never apologize for the price. Price is a filter.
- Arabic: Saudi white dialect for ads and emotional lines; MSA for legal/footer. See `03-ICP-AND-LANGUAGE.md`.
- English: direct, adult, no “hey fam / let’s goo”.

**We say:** system, operating system, vault, drop, license, certified, studio.  
**We never say:** cheap, hack, secret trick, 10x, hustle, guru, PLR, resell rights, bundle of bundles, “as seen on TV”.

## Brand objects (repeat everywhere)

Use these as visual + verbal motifs so the store feels like one world:

1. **The Circle** — gold, DW inside. Favicon, header, loading, email header.
2. **The Drop stamp** — small “Drop 01 — 2026” on product cards.
3. **The License line** — “Personal license · Instant vault access”.
4. **The Studio credit** — “Designed in the Digi World studio”.
5. **Certification chip** — “DW Certified System” with a thin gold ring.

## Favicon / OG

- Favicon: gold circle, DW in ink, 32 / 180 / 512.
- OG image: dark field, gold circle left, “Digi World” Syne, line “Digital systems. Not files.” 1200×630.

## What “owns the products” means in UI

Every product page includes:

- “A Digi World original”
- Studio serial: `DW-SYS-004` style
- “Not sold on random marketplaces as a white-label file” (true for the website SKUs; Etsy uses **different lighter SKUs** under the same brand — see `23-ETSY-REDBUBBLE.md`)
- Same photography lighting, same type, same gold circle on mockups
