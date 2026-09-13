import { getTranslations, setRequestLocale } from "next-intl/server";
import { Split } from "@/components/ui";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <>
      <section className="mx-auto max-w-[800px] px-5 py-20">
        <p className="text-xs uppercase tracking-widest text-gold">{t("title")}</p>
        <h1 className="mt-4 font-display text-5xl">{t("h1")}</h1>
        <p className="mt-6 text-lg text-ivory/80">{t("body")}</p>
      </section>
      <Split image="/images/hero-home.png" alt="" flip={false} tone="light">
        <h2 className="font-display text-4xl">{t("whyTitle")}</h2>
        <p className="mt-4 text-ivory/70">{t("why")}</p>
      </Split>
      <Split image="/images/product-vault-01.png" alt="" flip>
        <h2 className="font-display text-4xl">{t("dropTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("drop")}</p>
        <h3 className="mt-8 font-display text-2xl text-gold">{t("certTitle")}</h3>
        <p className="mt-3 text-ivory/80">{t("cert")}</p>
      </Split>
    </>
  );
}
