import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCatalog } from "@/lib/catalog";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return { title: t("title") };
}

export default async function FAQ({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faqPage");
  const catalog = await getCatalog();
  const faqs = catalog.products.find((p) => p.faq?.length)?.faq || [];
  return (
    <article className="mx-auto max-w-[720px] px-5 py-20">
      <h1 className="font-display text-5xl">{t("h1")}</h1>
      <div className="mt-10 space-y-3">
        {faqs.length === 0 ? <p className="text-ivory/70">{t("empty")}</p> : null}
        {faqs.map((item, i) => {
          const block = item[locale] || item.en;
          if (!block) return null;
          return (
            <details key={i} className="rounded-2xl border border-line p-4">
              <summary className="cursor-pointer font-medium">{block.q}</summary>
              <p className="mt-2 text-ivory/70">{block.a}</p>
            </details>
          );
        })}
      </div>
    </article>
  );
}
