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
    "/systems/proposal-desk",
    "/systems/expense-desk",
    "/systems/content-planner",
    "/systems/meeting-desk",
    "/systems/time-rate-desk",
    "/systems/contract-desk",
    "/systems/onboarding-desk",
    "/systems/sop-desk",
    "/systems/testimonial-vault",
    "/systems/subscription-desk",
    "/systems/key-fob-programming-mastery",
    "/systems/little-cozy-days",
    "/systems/photographer-os",
  ];
  const weeklyPaths = new Set([
    "",
    "/business-crm-tracker",
    "/systems/client-tracker",
    "/systems/invoice-desk",
    "/systems/proposal-desk",
    "/systems/expense-desk",
    "/systems/content-planner",
    "/systems/meeting-desk",
    "/systems/time-rate-desk",
    "/systems/contract-desk",
    "/systems/onboarding-desk",
    "/systems/sop-desk",
    "/systems/testimonial-vault",
    "/systems/subscription-desk",
    "/systems/little-cozy-days",
  ]);
  const highPriority = (p: string) =>
    p.includes("client-tracker") ||
    p.includes("business-crm") ||
    p.includes("invoice-desk") ||
    p.includes("proposal-desk") ||
    p.includes("expense-desk") ||
    p.includes("content-planner") ||
    p.includes("meeting-desk") ||
    p.includes("time-rate-desk") ||
    p.includes("contract-desk") ||
    p.includes("onboarding-desk") ||
    p.includes("sop-desk") ||
    p.includes("testimonial-vault") ||
    p.includes("subscription-desk") ||
    p.includes("little-cozy-days");
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const p of paths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: now,
        changeFrequency: weeklyPaths.has(p) ? "weekly" : "monthly",
        priority: p === "" ? 1 : highPriority(p) ? 0.9 : 0.7,
      });
    }
  }
  return entries;
}
