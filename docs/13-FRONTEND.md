# 13 — Frontend (libraries and structure)

## Stack (locked)

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15** App Router, React 19, TypeScript | SSR, metadata, Script, i18n, speed |
| Styling | **Tailwind CSS v4** | Fast, RTL plugin |
| i18n | **next-intl** | `/ar` `/en`, messages JSON |
| State | **Zustand** + persist | Cart |
| Validation | **Zod** | Forms |
| Animation | **framer-motion** | Drawers, upsell |
| Icons | **lucide-react** | |
| HTTP | **ofetch** or native fetch | Thin API client |
| Images | `next/image` | LCP |
| Fonts | `next/font/google` — Syne, Instrument Sans, IBM Plex Sans Arabic | |
| Tests | optional Playwright later | |

**Do not add:** Redux, jQuery, Bootstrap, MUI, styled-components, Moment.js.

Package manager: `pnpm`.

## Folder

```
frontend/
  Dockerfile
  .dockerignore
  .env.example
  next.config.ts
  tailwind.config.ts
  messages/ar.json
  messages/en.json
  public/images/...
  public/favicon.ico
  src/
    app/
      [locale]/
        layout.tsx
        page.tsx
        collections/...
        systems/[slug]/page.tsx
        about/page.tsx
        contact/page.tsx
        thank-you/page.tsx
        legal/...
        faq/page.tsx
      globals.css
      sitemap.ts
      robots.ts
    components/
    lib/
      api.ts
      catalog.ts
      cart.ts
      tracking/
        queue.ts
        meta.ts
        tiktok.ts
        snap.ts
        clickids.ts
      hashing.ts          # unused on web for PII; keep empty note
      money.ts
      offers.ts
    store/cart.ts
    i18n/request.ts
    middleware.ts         # next-intl + click id capture can be client
```

## next.config

- `images.remotePatterns` only if needed; prefer local public images
- `poweredByHeader: false`
- compress true

## Scripts (pixels)

Use `next/script`.

- **Never** `beforeInteractive` for pixels (blocks hydration in App Router).
- Default: `strategy="lazyOnload"` after consent — user asked deferred for speed.
- **Exception:** on `/thank-you` and after checkout success, if pixel not loaded yet, load with `afterInteractive` immediately so Purchase doesn’t drop.
- Implement `PixelQueue`: `dwq.push(['Purchase', payload, eventID])` flushes when `fbq`/`ttq`/`snaptr` exist.

Base pixel snippets live in `PixelScripts` client component, injected in locale layout **only if consent**.

Meta Pixel (web): pass Advanced Matching **unhashed** when email known (`fbq('init', ID, { em, fn })`). Pixel hashes. Confirmed: Meta docs — “Values will be hashed automatically by the pixel using SHA-256”.

TikTok Pixel: `ttq.load`, `ttq.page`, `ttq.identify({ email, phone })` **plain** email; TikTok pixel hashes for matching. Events API hashes server-side.

Snap Pixel: `snaptr('init', ID, { user_email })` plain email.

## Click IDs (first-party, 90 days)

On any page load, persist:

| URL param | Cookie |
| --- | --- |
| `fbclid` | `_fbc` constructed as `fb.1.{ts}.{fbclid}` if `_fbc` missing; also keep `fbclid` |
| (auto) | `_fbp` from Meta pixel; read later for CAPI |
| `ttclid` | `ttclid` cookie — **must capture manually** |
| `ScCid` or `sccid` | `sc_click_id` |
| `_scid` | set by Snap pixel; read as `sc_cookie1` for CAPI |

Also store `utm_*` in `dw_attrib` JSON cookie.

Send all of these with checkout payload.

## SEO

`generateMetadata` per page. Canonical. hreflang ar/en. OG images. JSON-LD Product with price.

## RTL

`html dir={locale==='ar'?'rtl':'ltr'} lang={locale}`. Tailwind `rtl:` variants.

## Performance

- Hero image `priority`
- Pixels lazy
- No heavy 3D
- Dynamic import cart drawer
- `prefetch` collection links
