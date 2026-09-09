# 21 — Image system

Paid social converts on **desire**. Images must look directed: night studio, gold light, tactile objects (phone, paper system, skin, metal circle), not Canva mockup spam, not laptops on beanbags.

Store files in `frontend/public/images/`:

```
hero-home.jpg
og-default.jpg
collections/creator-lab.jpg
collections/ai-command.jpg
collections/wealth.jpg
collections/glow.jpg
collections/vault.jpg
products/creator-os/01.jpg … 04.jpg
… same for each slug
```

Aspect: hero 16:9, cards 4:5, OG 1.91:1, gallery 4:5.

## Generated stills already in this repo

Copy these into `frontend/public/images/` when building:

| File | Use as |
| --- | --- |
| `docs/assets/images/hero-home.png` | `/images/hero-home.jpg` (convert) |
| `docs/assets/images/og-default.png` | `/images/og-default.jpg` |
| `docs/assets/images/product-creator-os-01.png` | `products/creator-os/01.jpg` |
| `docs/assets/images/product-faceless-studio-01.png` | `products/faceless-studio/01.jpg` |
| `docs/assets/images/product-hook-vault-01.png` | `products/hook-vault/01.jpg` |
| `docs/assets/images/product-ai-operator-01.png` | `products/ai-operator/01.jpg` |
| `docs/assets/images/product-offer-engine-01.png` | `products/offer-engine/01.jpg` |
| `docs/assets/images/product-wealth-os-01.png` | `products/wealth-os/01.jpg` |
| `docs/assets/images/product-glow-ritual-01.png` | `products/glow-ritual/01.jpg` |
| `docs/assets/images/product-time-command-01.png` | `products/time-command/01.jpg` |
| `docs/assets/images/product-vault-01.png` | `products/the-vault/01.jpg` and collections/vault |

Generate 3 more angles per SKU using the prompts below. Collection covers can crop product stills for v1.

## Style lock

- Color grade: ink blacks, warm gold highlights `#C6A35A`, ivory paper
- Shallow depth of field
- No readable fake UI text that contradicts brand
- No celebrity lookalikes
- Hands OK; faces optional and diverse; Glow can be close-up skin/gold jewelry without cliché stock smile
- Physicalize the digital: cloth-bound folio, gold foil “DW”, stacked cards, phone with dark UI

## Generate these (coder or designer)

Use the prompts below in your image model. Export JPG quality 80, max 1920px wide.

### Home hero

> Cinematic still, ultra premium, dark studio. A matte black table, a gold ring object, an open folio with cream pages, a phone showing a dark interface with a small gold circle logo. Rim light champagne gold. No text. Photoreal, 35mm, f/1.8, 16:9.

### Creator OS

> Night desk of a serious creator: microphone edge, phone on small tripod, printed hook cards with gold edges, dark room, gold accent light. No logos of other brands. 4:5.

### Faceless Studio

> Camera pointed at a beautifully lit empty set (plant, plaster wall, gold object), operator unseen. Premium, quiet. 4:5.

### Hook Vault

> Hundreds of ivory index cards in a black drawer, one gold card pulled, typography unreadable bokeh. 4:5.

### AI Operator

> Dark control-room aesthetic but warm: one monitor glow, notebook with a gold circle stamp, no Big Tech logos. 4:5.

### Offer Engine

> Close-up of a price ladder on thick paper, gold foil numbers, hand with a pen. 4:5.

### Wealth OS

> Cash envelopes and a metal pen on black stone, tasteful, not gaudy stacks of bills. 4:5.

### Glow Ritual

> Soft gold hour, glass, cream silk, a ritual tray, skin-safe, expensive quiet, no brand names. 4:5.

### Time Command

> Analog clock unfocused, closed laptop, sunrise slit of light on an ink desk. 4:5.

### Vault

> A black steel box slightly open, gold light leaking, papers inside, luxury advertising. 4:5.

Generate **4 angles per system**: cover, interior still, lifestyle, detail (foil stamp).

## Alt text

EN/AR pairs in catalog JSON, e.g. “Creator OS folio on a dark studio desk”.
