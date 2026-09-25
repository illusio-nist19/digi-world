import { defineRouting } from "next-intl/routing";

export const locales = ["ar", "en", "fr", "es"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ar",
  localePrefix: "always",
  // We emit our own locale-prefixed hreflang + canonicals in metadata (seo.ts).
  // next-intl's default x-default pointed at unprefixed URLs that 301 → GSC "Page with redirect".
  alternateLinks: false,
});
