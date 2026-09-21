import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getCatalog } from "@/lib/catalog";
import { loc, money } from "@/lib/types";
import { Container, ProductCard, Split, StarRow } from "@/components/ui";
import { ScrollBackdrop } from "@/components/scroll-backdrop";
import { CrmSavingsSection } from "@/components/crm-savings";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

const SCROLL_SCENES = [
  { id: "home-help", src: "/images/intro-crm-hq.png" },
  { id: "systems", src: "/images/scroll-crm-office.png" },
  { id: "home-why", src: "/images/scroll-crm-desk.png" },
  { id: "home-close", src: "/images/hero-home-hq.png" },
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const ta = await getTranslations("about");
  const catalog = await getCatalog();

  const helpItems = [t("help1"), t("help2"), t("help3"), t("help4"), t("help5")];
  const stats = [
    [t("stat1"), t("stat1l")],
    [t("stat2"), t("stat2l")],
    [t("stat3"), t("stat3l")],
    [t("stat4"), t("stat4l")],
    [t("stat5"), t("stat5l")],
  ];

  return (
    <>
      <ScrollBackdrop scenes={SCROLL_SCENES} />

      <section className="relative min-h-[88vh]">
        <Image src="/images/hero-home-hq.png" alt="" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">{t("h1")}</h1>
          <p className="mt-4 max-w-xl text-lg text-ivory/80">{t("sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/systems/client-tracker" className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("cta")}
            </Link>
            <Link href="/#home-help" className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6">
              {t("ghost")}
            </Link>
          </div>
          <p className="mt-8 text-sm text-stone">
            {catalog.licenses_issued > 0 ? `${catalog.licenses_issued} · ` : ""}
            {t("drop")} · ★★★★★ · {ta("trustScore")}
          </p>
        </Container>
      </section>

      <section className="border-y border-line bg-ink-2/50 py-10">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-gold">{ta("title")}</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">{ta("h1")}</h2>
          <p className="mt-4 text-ivory/80 whitespace-pre-line">{ta("body")}</p>
        </Container>
      </section>

      <section id="home-help" className="relative py-20">
        <div className="absolute inset-0 bg-ink/60" />
        <Container className="relative">
          <h2 className="font-display text-4xl md:text-5xl">{t("helpTitle")}</h2>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {helpItems.map((item) => (
              <li key={item} className="rounded-2xl border border-ivory/10 bg-ink-3/80 px-5 py-4 text-lg text-ivory/90 backdrop-blur-sm">
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-ink/65" />
        <Container className="relative">
          <h2 className="font-display text-4xl">{t("statsTitle")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map(([n, label]) => (
              <div key={label} className="rounded-2xl border border-gold/25 bg-ink-3/80 p-5 backdrop-blur-sm">
                <p className="font-display text-4xl text-gold">{n}</p>
                <p className="mt-3 text-sm text-ivory/75">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-stone">{t("statsNote")}</p>
        </Container>
      </section>

      <Split image="/images/intro-crm-hq.png" alt="Digi World Professional CRM" flip={false}>
        <h2 className="font-display text-4xl">{t("whyCrmTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("whyCrmBody")}</p>
        <Link href="/systems/client-tracker" className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
          {t("cta")}
        </Link>
      </Split>

      <Split image="/images/scroll-crm-desk.png" alt="Lead and contact management" flip>
        <h2 className="font-display text-4xl">{t("leadsTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("leadsBody")}</p>
      </Split>

      <CrmSavingsSection
        title={ta("saveTitle")}
        highlightName={ta("saveHighlightName")}
        highlightPrice={ta("saveHighlightPrice")}
        highlightNote={ta("saveHighlightNote")}
        savingsLabel={ta("saveLabel")}
        cta={ta("saveCta")}
        imageSrc="/images/crm-onetime-savings.png"
        competitors={[
          { name: ta("saveComp1Name"), price: ta("saveComp1Price"), plan: ta("saveComp1Plan"), save: ta("saveComp1Save") },
          { name: ta("saveComp2Name"), price: ta("saveComp2Price"), plan: ta("saveComp2Plan"), save: ta("saveComp2Save") },
          { name: ta("saveComp3Name"), price: ta("saveComp3Price"), plan: ta("saveComp3Plan"), save: ta("saveComp3Save") },
        ]}
      />

      <section id="systems" className="relative py-20">
        <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" />
        <Container className="relative">
          <h2 className="mb-10 font-display text-4xl">{t("systemsTitle")}</h2>
          {catalog.products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.products.map((p) => (
                <ProductCard key={p.sku} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="max-w-xl text-ivory/70">{t("emptySystems")}</p>
          )}
        </Container>
      </section>

      <section id="home-why" className="relative py-20">
        <div className="absolute inset-0 bg-ink/60" />
        <Container className="relative">
          <h2 className="mb-10 font-display text-4xl">{t("whyTitle")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[t("p1t"), t("p2t"), t("p3t")].map((title, i) => (
              <div key={title} className="rounded-2xl border border-ivory/10 bg-ink-3/80 p-6 backdrop-blur-sm">
                <p className="text-gold">{title}</p>
                <p className="mt-3 text-ivory/80">{[t("p1"), t("p2"), t("p3")][i]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {catalog.reviews.length ? (
        <section className="relative overflow-hidden py-16">
          <div className="absolute inset-0 bg-ink/55" />
          <Container className="relative">
            <h2 className="mb-8 font-display text-4xl">{t("reviewsTitle")}</h2>
          </Container>
          <div className="relative flex gap-4 overflow-x-auto px-5 pb-4">
            {catalog.reviews.map((r) => (
              <blockquote key={r.title} className="min-w-[280px] rounded-2xl border border-ivory/10 bg-ink-3/85 p-5 backdrop-blur-sm">
                <StarRow stars={r.stars} />
                <p className="mt-3 font-display text-lg">{r.title}</p>
                <p className="mt-2 text-sm text-ivory/70">{r.body}</p>
                <p className="mt-4 text-xs text-stone">
                  {r.display_name} · {r.city_country}
                  {r.source === "customer" ? " · verified" : ""}
                </p>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      <section id="home-close" className="relative py-20">
        <div className="absolute inset-0 bg-ink/75" />
        <Container className="relative text-center">
          <h2 className="font-display text-4xl md:text-5xl">{t("finalTitle")}</h2>
          <Link href="/systems/client-tracker" className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-8 font-medium text-ink">
            {t("finalCta")}
          </Link>
        </Container>
      </section>
    </>
  );
}
