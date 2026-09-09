# 09 — Design system

## Surfaces

Default **ink** background. Sections alternate:

- `dark` — ivory text, gold CTA
- `light` — ink text, gold CTA
- `gold-wash` — rare, footer top border only

Radius: `16px` cards, `999px` pills/CTAs, `50%` brand circle.  
Shadow: barely there (`0 24px 80px rgba(0,0,0,.35)`).  
Max width: `1200px`. Page padding `20px` mobile, `32px` desktop.

## Layout rhythm

Desktop sections that include a photo:

- Odd: **image left, text right** (LTR). RTL: image right, text left (image on the visual start? **Follow locale start-edge for TEXT**, image on the end-edge for odd; flip next section). Simpler rule:

**Implement `Split` with `flip` boolean.**  
Page JSON: section 1 `flip=false`, section 2 `flip=true`, etc.

- `flip=false` + LTR: image left, text right  
- `flip=false` + RTL: image right, text left (mirrored)  
- `flip=true`: opposite

Vertical center the text. Image `aspect-[4/5]` on PDP, `16/9` on home hero.

## Header

Height 64px mobile / 72px desktop. Sticky, `backdrop-blur`, `bg-ink/80`.  
Start: circle 36px gold + gap 12px + wordmark.  
Center (desktop): nav links `Shop, Systems, About, Contact`. Shop → `/[locale]/collections`. Systems → `/[locale]/#systems` or collections index.  
End: language toggle `ع | EN` + cart button with count badge gold.

Mobile: hamburger + circle + wordmark compact; cart stays visible. Menu drawer: links + language.

## Footer

Dark. Columns:

1. Digi World + one-liner  
2. Shop (all collections)  
3. House (About, Contact, FAQ, Guarantee)  
4. Legal (Privacy, Terms, Refunds, Cookies)  
5. Social (TikTok, Snapchat, Instagram, YouTube) as text links  

Bottom: `© 2026 Digi World · digi-world.online · Digital systems, worldwide`

Email capture optional in footer: “Drop notes” — not required for v1.

## Buttons

| Variant | Look |
| --- | --- |
| primary | gold fill, ink text, full pill |
| ghost | ivory/20 border |
| dark on light | ink fill, ivory text |

Min height 48px (thumb). Hover: gold-2. Active scale 0.98. Disabled 40% opacity.

## Product card

Ink-3 card, image 4:5, padding 16px. Stars gold. Price gold. Sub stone 14px. No clutter.

## Motion

Framer Motion: fade+raise 16px, 400ms, `easeOut`. Respect `prefers-reduced-motion`. Cart drawer spring. No bounce-everywhere.

## Icons

`lucide-react` only. Stroke 1.5. Cart, close, chevron, lock, star (custom gold fill for reviews).

## Forms

Ivory/10 fill, 1px line, 14px labels in stone. Error danger text. Email input `dir=ltr` even on Arabic pages (emails are LTR). Name can be RTL.

## Breakpoints

`sm 640 md 768 lg 1024 xl 1280` Tailwind defaults.

## Accessibility

Focus gold ring. Alt text on all images. Buttons have names. Drawer `role=dialog` focus trap. Checkout too.
