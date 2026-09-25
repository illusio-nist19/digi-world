import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online").replace(/\/$/, "");
}

/** Path without locale, e.g. "" | "/systems/client-tracker" | "/about" */
export function localeAlternates(path: string = ""): Record<string, string> {
  const base = siteUrl();
  const clean = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${base}/${locale}${clean}`;
  }
  // Prefer English as x-default for unmatched languages (Google)
  languages["x-default"] = `${base}/en${clean}`;
  return languages;
}

export function pageAlternates(locale: string, path: string = ""): Metadata["alternates"] {
  const base = siteUrl();
  const clean = path === "/" ? "" : path;
  return {
    canonical: `${base}/${locale}${clean}`,
    languages: localeAlternates(clean),
  };
}

export function absoluteUrl(locale: string, path: string = ""): string {
  const clean = path === "/" ? "" : path;
  return `${siteUrl()}/${locale}${clean}`;
}
