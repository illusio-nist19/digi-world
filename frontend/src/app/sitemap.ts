import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localeAlternates, siteUrl } from "@/lib/seo";

export const revalidate = 3600;

/** Only indexable, real locale-prefixed URLs. No bare /systems or www. */
const PATHS = [
  "",
  "/collections",
  "/collections/trades-lab",
  "/collections/creator-lab",
  "/collections/ai-command",
  "/collections/wealth-os",
  "/collections/glow-ritual",
  "/collections/the-vault",
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
  "/systems/cozy-club-friends",
  "/systems/photographer-os",
] as const;

const WEEKLY = new Set([
  "",
  "/business-crm-tracker",
  "/digital-tracker",
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
  "/systems/photographer-os",
  "/systems/key-fob-programming-mastery",
]);

function priorityFor(path: string): number {
  if (path === "") return 1;
  if (
    path.includes("client-tracker") ||
    path.includes("business-crm") ||
    path.includes("invoice-desk") ||
    path.includes("photographer-os") ||
    path.includes("key-fob")
  ) {
    return 0.95;
  }
  if (path.startsWith("/systems/")) return 0.85;
  if (path.startsWith("/collections")) return 0.75;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of PATHS) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency: WEEKLY.has(path) ? "weekly" : "monthly",
        priority: priorityFor(path),
        alternates: {
          languages: localeAlternates(path),
        },
      });
    }
  }
  return entries;
}
