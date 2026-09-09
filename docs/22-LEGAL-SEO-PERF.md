# 22 — Legal, SEO, performance

## Pages (bilingual)

- Privacy: what we collect (name, email, IP, cookies, click IDs), ads measurement (Meta/TikTok/Snap CAPI), sheet storage, no selling lists.
- Terms: digital license personal, no redistribution, worldwide, USD.
- Refunds: 7-day digital guarantee if vault files corrupted or wrong SKU delivered; not “I didn’t use it”. Be clear — ads accounts hate unlimited refund bait.
- Cookies: pixels after consent in regulated regions.

Company line: `Digi World · digi-world.online · digital systems`.

Contact: `hello@digi-world.online`.

## SEO

- Title template: `{Page} · Digi World`
- Home title AR: `Digi World | أنظمة رقمية فاخرة`
- Home title EN: `Digi World | Premium digital systems`
- Unique H1 per page
- Sitemap via Next
- robots allow all except `/api` (frontend has no secret api)
- JSON-LD Organization + Product

## Performance budget

- JS: keep cart/pixels code-split
- Fonts: 3 families max, `display: swap`
- Hero `priority`
- No instant third-party except after consent/idle
- Target Lighthouse mobile 90+ perf on Home

## Security headers (Next or EasyPanel)

`X-Frame-Options: DENY`, `referrer-policy: strict-origin-when-cross-origin`, HSTS at proxy.
