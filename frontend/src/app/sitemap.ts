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
    "/systems/cartoon-buddies",
    "/systems/cozy-little-animals",
    "/systems/dino-friends",
    "/systems/magic-unicorn-days",
    "/systems/busy-little-wheels",
    "/systems/the-secret-sleep-keeps",
    "/systems/the-kindness-cave",
    "/systems/ember-who-shared-his-fire",
    "/systems/the-brave-little-lantern",
    "/systems/the-whispering-market",
    "/systems/the-fox-who-kept-his-word",
    "/systems/the-soft-word-door",
    "/systems/flash-and-nibble",
    "/systems/the-friendship-pot",
    "/systems/ruby-cloaks-true-path",
    "/systems/three-little-nest-builders",
    "/systems/luna-and-the-three-soft-chairs",
    "/systems/pip-and-the-sky-beans",
    "/systems/the-speckled-duckling",
    "/systems/cinders-and-the-kind-slippers",
    "/systems/tiny-paws-big-rescue",
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
    "/systems/cartoon-buddies",
    "/systems/cozy-little-animals",
    "/systems/dino-friends",
    "/systems/magic-unicorn-days",
    "/systems/busy-little-wheels",
    "/systems/the-secret-sleep-keeps",
    "/systems/the-kindness-cave",
    "/systems/ember-who-shared-his-fire",
    "/systems/the-brave-little-lantern",
    "/systems/the-whispering-market",
    "/systems/the-fox-who-kept-his-word",
    "/systems/the-soft-word-door",
    "/systems/flash-and-nibble",
    "/systems/the-friendship-pot",
    "/systems/ruby-cloaks-true-path",
    "/systems/three-little-nest-builders",
    "/systems/luna-and-the-three-soft-chairs",
    "/systems/pip-and-the-sky-beans",
    "/systems/the-speckled-duckling",
    "/systems/cinders-and-the-kind-slippers",
    "/systems/tiny-paws-big-rescue",
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
    p.includes("little-cozy-days") ||
    p.includes("cartoon-buddies") ||
    p.includes("cozy-little-animals") ||
    p.includes("dino-friends") ||
    p.includes("magic-unicorn-days") ||
    p.includes("busy-little-wheels") ||
    p.includes("the-secret-sleep-keeps") ||
    p.includes("the-kindness-cave") ||
    p.includes("ember-who-shared") ||
    p.includes("brave-little-lantern") ||
    p.includes("whispering-market") ||
    p.includes("fox-who-kept");
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
