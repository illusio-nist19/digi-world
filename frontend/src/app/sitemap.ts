import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  const paths = [
    "",
    "/collections",
    "/collections/trades-lab",
    "/about",
    "/contact",
    "/faq",
    "/digital-tracker",
    "/business-crm-tracker",
    "/systems/client-tracker",
    "/systems/invoice-desk",
    "/systems/key-fob-programming-mastery",
    "/systems/photographer-os",
  ];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const p of paths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: now,
        changeFrequency: p === "" || p === "/business-crm-tracker" || p === "/systems/client-tracker" || p === "/systems/invoice-desk" ? "weekly" : "monthly",
        priority: p === "" ? 1 : p.includes("client-tracker") || p.includes("business-crm") || p.includes("invoice-desk") ? 0.9 : 0.7,
      });
    }
  }
  return entries;
}
