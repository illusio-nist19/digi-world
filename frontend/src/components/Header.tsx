"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "./Brand";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cartCount, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

const LANG: Record<string, string> = { ar: "ع", en: "EN", fr: "FR", es: "ES" };

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const lines = useCart((s) => s.lines);
  const { setCartOpen, mobileNav, setMobileNav } = useUI();
  const count = cartCount(lines);
  const pathname = usePathname();
  const [openLang, setOpenLang] = useState(false);

  const links = [
    { href: "/" as const, label: t("about") },
    { href: "/collections" as const, label: t("shop") },
    { href: "/#systems" as const, label: t("systems") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-line/50 bg-ink/35 backdrop-blur-md md:h-[72px]">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button className="lg:hidden" aria-label={t("menu")} onClick={() => setMobileNav(true)}>
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <Link href="/" className="shrink-0">
            <Logo locale={locale} />
          </Link>
        </div>
        <nav className="hidden min-w-0 items-center gap-8 text-sm text-ivory/80 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <div className="relative">
            <button className="text-xs tracking-widest text-stone hover:text-gold" onClick={() => setOpenLang((v) => !v)} aria-expanded={openLang}>
              {LANG[locale]}
            </button>
            {openLang ? (
              <div className="absolute end-0 top-8 z-50 min-w-[120px] rounded-2xl border border-line bg-ink-3 p-2">
                {locales.map((l) => (
                  <Link key={l} href={pathname} locale={l} className={`block rounded-lg px-3 py-2 text-sm ${l === locale ? "text-gold" : "text-ivory"}`} onClick={() => setOpenLang(false)}>
                    {LANG[l]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <button className="relative" aria-label={t("cart")} onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            {count > 0 ? <span className="absolute -top-2 -end-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-ink">{count}</span> : null}
          </button>
        </div>
      </div>
      {mobileNav ? (
        <div className="fixed inset-0 z-50 bg-ink/95 p-6 lg:hidden" role="dialog">
          <button className="ms-auto block" onClick={() => setMobileNav(false)} aria-label="Close">
            <X />
          </button>
          <div className="mt-10 flex flex-col gap-6 text-2xl font-display">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileNav(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex gap-4 text-base tracking-widest">
              {locales.map((l) => (
                <Link key={l} href={pathname} locale={l} className={l === locale ? "text-gold" : "text-ivory/70"} onClick={() => setMobileNav(false)}>
                  {LANG[l]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
