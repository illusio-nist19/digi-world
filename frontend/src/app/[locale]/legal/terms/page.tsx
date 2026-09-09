import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Terms({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return (
    <article className="mx-auto max-w-[720px] px-5 py-20">
      <h1 className="font-display text-5xl">{t("termsTitle")}</h1>
      <p className="mt-6 text-ivory/80">{t("terms")}</p>
    </article>
  );
}
