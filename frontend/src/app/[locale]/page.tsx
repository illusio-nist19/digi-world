import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getCatalog } from "@/lib/catalog";
import { loc, money } from "@/lib/types";
import { Container, ProductCard, Split, StarRow } from "@/components/ui";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const catalog = await getCatalog();

  return (
    <>
      <section className="relative min-h-[88vh]">
        <Image src="/images/hero-home.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/45" />
        <Container className="relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight md:text-6xl">{t("h1")}</h1>
          <p className="mt-4 max-w-xl text-lg text-ivory/80">{t("sub")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#systems" className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("cta")}
            </Link>
            <Link href="/#systems" className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6">
              {t("ghost")}
            </Link>
          </div>
          <p className="mt-8 text-sm text-stone">
            {catalog.licenses_issued > 0 ? `${catalog.licenses_issued} · ` : ""}
            {t("drop")} · ★★★★★
          </p>
        </Container>
      </section>

      <Split image="/images/hero-home.png" alt="" flip={false}>
        <p className="text-xs uppercase tracking-widest text-gold">{t("drop")}</p>
        <h2 className="mt-3 font-display text-4xl">{t("introTitle")}</h2>
        <p className="mt-4 text-ivory/80">{t("introBody")}</p>
      </Split>

      {catalog.products
        .filter((p) => p.slug === "invoice-desk")
        .map((p) => (
          <Split key={p.sku} image={p.images[0]} alt={loc(p.name, locale)} flip={false}>
            <p className="text-xs uppercase tracking-widest text-gold">{t("featuredInvoice")}</p>
            <h2 className="mt-3 font-display text-4xl">{loc(p.headline, locale)}</h2>
            <p className="mt-4 text-ivory/80">{loc(p.sub, locale)}</p>
            <p className="mt-4 font-display text-2xl text-gold">{money(p.price_cents)}</p>
            <Link href="/systems/invoice-desk" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("featuredCta")}
            </Link>
          </Split>
        ))}

      {catalog.products
        .filter((p) => p.slug === "client-tracker")
        .map((p) => (
          <Split key={p.sku} image={p.images[0]} alt={loc(p.name, locale)} flip>
            <p className="text-xs uppercase tracking-widest text-gold">{t("featuredCrm")}</p>
            <h2 className="mt-3 font-display text-4xl">{loc(p.headline, locale)}</h2>
            <p className="mt-4 text-ivory/80">{loc(p.sub, locale)}</p>
            <p className="mt-4 font-display text-2xl text-gold">{money(p.price_cents)}</p>
            <Link href="/systems/client-tracker" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("featuredCta")}
            </Link>
          </Split>
        ))}

      {catalog.products
        .filter((p) => p.slug === "key-fob-programming-mastery")
        .map((p) => (
          <Split key={p.sku} image={p.images[0]} alt={loc(p.name, locale)} flip>
            <p className="text-xs uppercase tracking-widest text-gold">{t("featuredKeys")}</p>
            <h2 className="mt-3 font-display text-4xl">{loc(p.headline, locale)}</h2>
            <p className="mt-4 text-ivory/80">{loc(p.sub, locale)}</p>
            <p className="mt-4 font-display text-2xl text-gold">{money(p.price_cents)}</p>
            <Link href="/systems/key-fob-programming-mastery" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("featuredCta")}
            </Link>
          </Split>
        ))}

      {catalog.products
        .filter((p) => p.slug === "photographer-os")
        .map((p) => (
          <Split key={p.sku} image={p.images[0]} alt={loc(p.name, locale)} flip={false}>
            <p className="text-xs uppercase tracking-widest text-gold">{t("featuredPhoto")}</p>
            <h2 className="mt-3 font-display text-4xl">{loc(p.headline, locale)}</h2>
            <p className="mt-4 text-ivory/80">{loc(p.sub, locale)}</p>
            <p className="mt-4 font-display text-2xl text-gold">{money(p.price_cents)}</p>
            <Link href="/systems/photographer-os" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("featuredCta")}
            </Link>
          </Split>
        ))}

      {catalog.products
        .filter((p) => p.slug === "ai-governance-kit")
        .map((p) => (
          <Split key={p.sku} image={p.images[0]} alt={loc(p.name, locale)} flip={false}>
            <p className="text-xs uppercase tracking-widest text-gold">{t("featuredTitle")}</p>
            <h2 className="mt-3 font-display text-4xl">{loc(p.headline, locale)}</h2>
            <p className="mt-4 text-ivory/80">{loc(p.sub, locale)}</p>
            <p className="mt-4 font-display text-2xl text-gold">{money(p.price_cents)}</p>
            <Link href="/systems/ai-governance-kit" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
              {t("featuredCta")}
            </Link>
          </Split>
        ))}

      <section id="systems" className="bg-ink-2/45 py-20">
        <Container>
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

      <section className="py-20">
        <Container>
          <h2 className="mb-10 font-display text-4xl">{t("whyTitle")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[t("p1t"), t("p2t"), t("p3t")].map((title, i) => (
              <div key={title} className="rounded-2xl bg-ink-3 p-6">
                <p className="text-gold">{title}</p>
                <p className="mt-3 text-ivory/80">{[t("p1"), t("p2"), t("p3")][i]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-mist/55 py-20 text-ivory">
        <Container>
          <h2 className="mb-10 font-display text-4xl">{t("scienceTitle")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [t("s1t"), t("s1")],
              [t("s2t"), t("s2")],
              [t("s3t"), t("s3")],
            ].map(([a, b]) => (
              <div key={a} className="rounded-2xl border border-line bg-ink-3 p-6">
                <p className="font-display text-xl">{a}</p>
                <p className="mt-3 text-ivory/70">{b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {catalog.reviews.length ? (
        <section className="overflow-hidden py-16">
          <Container>
            <h2 className="mb-8 font-display text-4xl">{t("reviewsTitle")}</h2>
          </Container>
          <div className="flex gap-4 overflow-x-auto px-5 pb-4">
            {catalog.reviews.map((r) => (
              <blockquote key={r.title} className="min-w-[280px] rounded-2xl bg-ink-3 p-5">
                <StarRow stars={r.stars} />
                <p className="mt-3 font-display text-lg">{r.title}</p>
                <p className="mt-2 text-sm text-ivory/70">{r.body}</p>
                <p className="mt-4 text-xs text-stone">
                  {r.display_name} · {r.city_country}
                  {r.source === "studio_preview" ? " · studio" : ""}
                </p>
              </blockquote>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-ink-2/45 py-16">
        <Container className="max-w-3xl text-center">
          <h2 className="font-display text-4xl">{t("guaranteeTitle")}</h2>
          <p className="mt-4 text-ivory/80">{t("guaranteeBody")}</p>
        </Container>
      </section>

      <section className="py-20">
        <Container className="text-center">
          <h2 className="font-display text-4xl md:text-5xl">{t("finalTitle")}</h2>
          <Link href="/#systems" className="mt-8 inline-flex h-12 items-center rounded-full bg-gold px-8 font-medium text-ink">
            {t("finalCta")}
          </Link>
        </Container>
      </section>
    </>
  );
}
