import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact-form";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Contact({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const wa = process.env.NEXT_PUBLIC_WHATSAPP;
  return (
    <section className="mx-auto max-w-[640px] px-5 py-20">
      <h1 className="font-display text-5xl">{t("h1")}</h1>
      <p className="mt-4 text-ivory/80">{t("body")}</p>
      {wa ? (
        <a className="mt-4 inline-block text-gold" href={`https://wa.me/${wa.replace(/\D/g, "")}`}>
          {t("whatsapp")}
        </a>
      ) : null}
      <ContactForm />
    </section>
  );
}
