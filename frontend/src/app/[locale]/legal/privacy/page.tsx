import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function Legal({ locale, k }: { locale: string; k: "privacy" | "terms" | "refunds" | "cookies" }) {
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const title = t(`${k}Title`);
  const body = t(k);
  return (
    <article className="mx-auto max-w-[720px] px-5 py-20">
      <h1 className="font-display text-5xl">{title}</h1>
      <p className="mt-6 whitespace-pre-line text-ivory/80">{body}</p>
    </article>
  );
}

export default async function Privacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Legal locale={locale} k="privacy" />;
}
