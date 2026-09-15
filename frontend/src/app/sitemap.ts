import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  const paths = ["", "/collections", "/collections/trades-lab", "/about", "/contact", "/faq", "/systems/client-tracker", "/systems/key-fob-programming-mastery", "/systems/photographer-os"];
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const p of paths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}${p}`])) },
      });
    }
  }
  return entries;
}
