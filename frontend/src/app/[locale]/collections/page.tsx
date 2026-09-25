import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { Container, ProductCard } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("systemsTitle"),
    alternates: pageAlternates(locale, "/collections"),
  };
}

export default async function Collections({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const catalog = await getCatalog();
  return (
    <Container className="py-16">
      <h1 className="font-display text-5xl">{t("systemsTitle")}</h1>
      {catalog.products.length ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.products.map((p) => (
            <ProductCard key={p.sku} product={p} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="mt-8 max-w-xl text-ivory/70">{t("emptySystems")}</p>
      )}
    </Container>
  );
}
