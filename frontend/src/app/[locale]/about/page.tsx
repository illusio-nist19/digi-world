import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Split, StarRow } from "@/components/ui";
import { CrmSavingsSection } from "@/components/crm-savings";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const CUSTOMER_REVIEWS = [
  {
    stars: 5,
    title: "Opened it the same night",
    body: "Professional CRM replaced three apps on my laptop. Clients, tasks, and invoices finally sit in one desk I own.",
    name: "Elena Vargas",
    place: "Barcelona · Photographer",
  },
  {
    stars: 5,
    title: "Serial and start-here matter",
    body: "I have bought plenty of marketplace PDFs. Digi World is the first that felt like a product — install, run, done.",
    name: "James Okafor",
    place: "London · Consultant",
  },
  {
    stars: 5,
    title: "Quote to paid in one file",
    body: "Quote & Invoice Desk stopped me rewriting totals in WhatsApp. Print PDF, mark paid, move on.",
    name: "Sophie Laurent",
    place: "Lyon · Freelance designer",
  },
  {
    stars: 5,
    title: "Clear ethics chapter",
    body: "Key Fob Programming Mastery is written for authorized work. Paperwork first. That alone is worth the price.",
    name: "Daniel Whitmore",
    place: "Manchester · Mobile locksmith",
  },
  {
    stars: 5,
    title: "Studio answered in hours",
    body: "Zip would not open on my first download. hello@ replied the same afternoon with a clean replacement.",
    name: "Amelia Brooks",
    place: "Austin · Agency founder",
  },
  {
    stars: 5,
    title: "No monthly CRM bill",
    body: "I needed Customer Relationship Management without another SaaS login. Digi World Professional CRM stays on my machine.",
    name: "Marco Bianchi",
    place: "Milan · Solo studio",
  },
];

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  return (
    <>
      <section className="mx-auto max-w-[800px] px-5 py-20">
        <p className="text-xs uppercase tracking-widest text-gold">{t("title")}</p>
        <h1 className="mt-4 font-display text-5xl">{t("h1")}</h1>
        <p className="mt-6 text-lg text-ivory/80 whitespace-pre-line">{t("body")}</p>
      </section>

      <section className="border-y border-line bg-ink-2/45 py-12">
        <Container className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">{t("trustTitle")}</p>
            <p className="mt-2 font-display text-3xl text-gold">{t("trustScore")}</p>
            <p className="mt-1 text-sm text-ivory/70">{t("trustCount")}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-gold/35 bg-ink-3 px-5 py-4">
            <StarRow stars={5} />
            <span className="text-sm text-ivory/80">Trustpilot</span>
          </div>
        </Container>
      </section>

      <CrmSavingsSection
        title={t("saveTitle")}
        highlightName={t("saveHighlightName")}
        highlightPrice={t("saveHighlightPrice")}
        highlightNote={t("saveHighlightNote")}
        savingsLabel={t("saveLabel")}
        cta={t("saveCta")}
        imageSrc="/images/crm-onetime-savings.png"
        competitors={[
          { name: t("saveComp1Name"), price: t("saveComp1Price"), plan: t("saveComp1Plan"), save: t("saveComp1Save") },
          { name: t("saveComp2Name"), price: t("saveComp2Price"), plan: t("saveComp2Plan"), save: t("saveComp2Save") },
          { name: t("saveComp3Name"), price: t("saveComp3Price"), plan: t("saveComp3Plan"), save: t("saveComp3Save") },
        ]}
      />

      <Split image="/images/intro-crm-hq.png" alt="Digi World CRM desk" flip={false} tone="light">
        <h2 className="font-display text-4xl">{t("commitmentTitle")}</h2>
        <p className="mt-4 text-ivory/70">{t("commitment")}</p>
      </Split>

      <Split image="/images/scroll-crm-office.png" alt="CRM analytics office" flip tone="dark">
        <h2 className="font-display text-4xl">{t("goalsTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("goals")}</p>
        <h3 className="mt-8 font-display text-2xl text-gold">{t("achievementsTitle")}</h3>
        <p className="mt-3 text-ivory/80">{t("achievements")}</p>
      </Split>

      <Split image="/images/scroll-crm-desk.png" alt="Customer Relationship Management workspace" flip={false} tone="light">
        <h2 className="font-display text-4xl">{t("officesTitle")}</h2>
        <p className="mt-4 text-ivory/70">{t("offices")}</p>
        <h3 className="mt-8 font-display text-2xl text-gold">{t("phonesTitle")}</h3>
        <p className="mt-3 whitespace-pre-line text-ivory/80">{t("phones")}</p>
      </Split>

      <section className="py-16">
        <Container>
          <h2 className="font-display text-4xl">{t("reviewsTitle")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CUSTOMER_REVIEWS.map((r) => (
              <blockquote key={r.name + r.title} className="rounded-2xl bg-ink-3 p-5">
                <StarRow stars={r.stars} />
                <p className="mt-3 font-display text-xl">{r.title}</p>
                <p className="mt-2 text-sm text-ivory/70">{r.body}</p>
                <p className="mt-4 text-xs text-stone">
                  {r.name} · {r.place}
                </p>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      <Split image="/images/hero-home-hq.png" alt="" flip tone="dark">
        <h2 className="font-display text-4xl">{t("whyTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("why")}</p>
        <h3 className="mt-8 font-display text-2xl text-gold">{t("dropTitle")}</h3>
        <p className="mt-3 text-ivory/80">{t("drop")}</p>
        <h3 className="mt-8 font-display text-2xl text-gold">{t("certTitle")}</h3>
        <p className="mt-3 text-ivory/80">{t("cert")}</p>
      </Split>
    </>
  );
}
