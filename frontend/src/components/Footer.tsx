import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandCircle } from "./Brand";
import type { Catalog } from "@/lib/types";
import { loc } from "@/lib/types";

export async function Footer({ locale, catalog }: { locale: string; catalog: Catalog }) {
  const t = await getTranslations("footer");
  return (
    <footer className="border-t border-gold/30 bg-ink/40 backdrop-blur-sm">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 md:grid-cols-5 md:px-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <BrandCircle size={32} />
            <span className="font-display font-bold">Digi World</span>
          </div>
          <p className="text-sm text-stone">{t("tag")}</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold">{t("shop")}</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            {catalog.collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`}>{loc(c.name, locale)}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold">{t("house")}</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/about">{t("house")}</Link></li>
            <li><Link href="/contact">{t("contact")}</Link></li>
            <li><Link href="/faq">{t("faq")}</Link></li>
            <li><Link href="/legal/refunds">{t("guarantee")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold">{t("legal")}</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><Link href="/legal/privacy">{t("privacy")}</Link></li>
            <li><Link href="/legal/terms">{t("terms")}</Link></li>
            <li><Link href="/legal/refunds">{t("refunds")}</Link></li>
            <li><Link href="/legal/cookies">{t("cookies")}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-gold">{t("social")}</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            <li><a href="https://www.tiktok.com" target="_blank" rel="noreferrer">TikTok</a></li>
            <li><a href="https://www.snapchat.com" target="_blank" rel="noreferrer">Snapchat</a></li>
            <li><a href="https://www.instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-5 py-6 text-center text-xs text-stone">{t("copy")}</p>
    </footer>
  );
}
