import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PdpOffers } from "@/components/commerce";
import { Container, Split, StarRow } from "@/components/ui";
import { getCatalog, productBySlug } from "@/lib/catalog";
import { isPremium, loc, money } from "@/lib/types";
import { ViewContentPing } from "@/components/view-content";
import { ProductGallery, CLIENT_TRACKER_SHOTS } from "@/components/product-gallery";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const catalog = await getCatalog();
  const product = productBySlug(catalog, slug);
  if (!product) return {};
  if (slug === "client-tracker") {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
    return {
      title: "Business CRM Tracker | Offline Client, Invoice & Task Desk | Digi World",
      description:
        "Business CRM tracker for small studios: clients, invoices, budget, tasks, and calendar. One HTML file. Works offline. No subscription. Instant download from Digi World.",
      keywords: [
        "business CRM tracker",
        "CRM tracker",
        "offline CRM",
        "client tracker",
        "small business CRM",
        "HTML client tracker",
        "freelancer invoice tracker",
      ],
      alternates: {
        canonical: `${base}/${locale}/systems/client-tracker`,
        languages: Object.fromEntries(
          ["ar", "en", "fr", "es"].map((l) => [l, `${base}/${l}/systems/client-tracker`]),
        ),
      },
      openGraph: { images: product.images[0] ? [product.images[0]] : undefined },
    };
  }
  if (slug === "key-fob-programming-mastery") {
    return {
      title: "Key Fob Programming Mastery | Automotive Remote & Immobilizer Training E-Book",
      description: "Visual locksmith training for authorized Add Key / remote programming — ownership verification, procedures, testing, 90-day path. Digi World.",
      openGraph: { images: product.images[0] ? [product.images[0]] : undefined },
    };
  }
  return {
    title: loc(product.name, locale),
    description: loc(product.sub, locale),
    openGraph: { images: product.images[0] ? [product.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("product");
  const catalog = await getCatalog();
  const product = productBySlug(catalog, slug);
  if (!product) notFound();
  const own = catalog.reviews.filter((r) => r.product_sku === product.sku);
  const localized = own.filter((r) => r.locale === locale);
  const reviews = localized.length
    ? localized
    : own.filter((r) => r.locale === "en").length
      ? own.filter((r) => r.locale === "en")
      : catalog.reviews.filter((r) => r.product_sku === "DW-VAULT-001" && r.locale === locale);
  const faqs = product.faq || [];
  const premium = isPremium(product);
  const gov = product.slug === "ai-governance-kit";
  const photo = product.slug === "photographer-os";
  const keys = product.slug === "key-fob-programming-mastery";
  const crm = product.slug === "client-tracker";
  const featured = gov || photo || keys || crm;
  const productLd =
    crm
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Digi World Professional Tracker",
          alternateName: ["Business CRM Tracker", "Digital Tracker", "Digi World Client Tracker"],
          applicationCategory: "BusinessApplication",
          operatingSystem: "Windows, macOS, iOS, Android",
          offers: {
            "@type": "Offer",
            price: (product.price_cents / 100).toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `https://digi-world.online/${locale}/systems/client-tracker`,
          },
          brand: { "@type": "Brand", name: "Digi World" },
        }
      : null;

  return (
    <>
      {productLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      ) : null}
      <ViewContentPing sku={product.sku} value={product.price_cents / 100} />
      <Container className="grid gap-10 py-10 md:grid-cols-2">
        {crm ? (
          <ProductGallery shots={CLIENT_TRACKER_SHOTS} alt={loc(product.name, locale)} />
        ) : (
          <Gallery images={product.images} alt={loc(product.name, locale)} />
        )}
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">
            {t("original")} · {product.serial}
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{loc(product.headline, locale)}</h1>
          <p className="mt-3 text-ivory/80">{loc(product.sub, locale)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRow stars={5} count={reviews.length || undefined} />
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">{t("certified")}</span>
            {premium ? <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">{photo ? t("studioBadge") : t("orgBadge")}</span> : null}
            {keys ? <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">{t("techBadge")}</span> : null}
            {crm ? <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs text-ivory/70">{t("crmBadge")}</span> : null}
          </div>
          <p className="mt-4 font-display text-3xl text-gold">{money(product.price_cents)}</p>
          <p className="mt-1 text-sm text-stone">{crm ? t("crmPriceNote") : keys ? t("techPriceNote") : photo ? t("studioPriceNote") : premium ? t("orgPriceNote") : t("usd")}</p>
          <div className="mt-6">
            <PdpOffers product={product} catalog={catalog} />
          </div>
        </div>
      </Container>

      {featured ? (
        <section className="border-y border-line bg-ink-2/45 py-10">
          <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(keys
              ? [
                  [t("keysP1"), t("keysP1l")],
                  [t("keysP2"), t("keysP2l")],
                  [t("keysP3"), t("keysP3l")],
                  [t("keysP4"), t("keysP4l")],
                ]
              : crm
              ? [
                  [t("crmP1"), t("crmP1l")],
                  [t("crmP2"), t("crmP2l")],
                  [t("crmP3"), t("crmP3l")],
                  [t("crmP4"), t("crmP4l")],
                ]
              : photo
              ? [
                  [t("photoP1"), t("photoP1l")],
                  [t("photoP2"), t("photoP2l")],
                  [t("photoP3"), t("photoP3l")],
                  [t("photoP4"), t("photoP4l")],
                ]
              : [
                  [t("govP1"), t("govP1l")],
                  [t("govP2"), t("govP2l")],
                  [t("govP3"), t("govP3l")],
                  [t("govP4"), t("govP4l")],
                ]
            ).map(([a, b]) => (
              <div key={a} className="rounded-2xl border border-line p-5">
                <p className="font-display text-2xl text-gold">{a}</p>
                <p className="mt-2 text-sm text-ivory/70">{b}</p>
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      <Split image={product.images[1] || product.images[0]} alt="" flip={false} tone="light">
        <h2 className="font-display text-4xl">{loc(product.name, locale)}</h2>
        <p className="mt-4 whitespace-pre-line text-ivory/70">{loc(product.description, locale)}</p>
      </Split>
      <Split image={product.images[2] || product.images[0]} alt="" flip tone="dark">
        <h2 className="font-display text-4xl">{t("inside")}</h2>
        <p className="mt-4 whitespace-pre-line text-ivory/80">{loc(product.contents, locale)}</p>
      </Split>
      <Split image={product.images[3] || product.images[0]} alt="" flip={false} tone="light">
        <h2 className="font-display text-4xl">{t("for")}</h2>
        <p className="mt-4 text-ivory/70">{gov ? t("govFor") : photo ? t("photoFor") : keys ? t("keysFor") : crm ? t("crmFor") : t("notFor")}</p>
        {gov ? <p className="mt-4 text-ivory/70">{t("govNotFor")}</p> : null}
        {photo ? <p className="mt-4 text-ivory/70">{t("photoNotFor")}</p> : null}
        {crm ? <p className="mt-4 text-ivory/70">{t("crmNotFor")}</p> : null}
        {keys ? (
          <>
            <p className="mt-4 text-ivory/70">{t("keysNotFor")}</p>
            <p className="mt-4 text-ivory/70">{t("keysEthics")}</p>
          </>
        ) : null}
      </Split>

      <section className="py-16">
        <Container>
          <h2 className="font-display text-4xl">{t("science")}</h2>
          <p className="mt-4 max-w-2xl text-ivory/70">{gov ? t("govScience") : photo ? t("photoScience") : keys ? t("keysScience") : crm ? t("crmScience") : t("scienceBody")}</p>
        </Container>
      </section>

      <section className="bg-ink-2/45 py-16">
        <Container>
          <h2 className="font-display text-4xl">{featured ? t("studioNotes") : t("reviews")}</h2>
          {featured ? <p className="mt-3 max-w-2xl text-sm text-stone">{t("studioNotesSub")}</p> : null}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <blockquote key={r.title} className="rounded-2xl bg-ink-3 p-5">
                <StarRow stars={r.stars} />
                <p className="mt-3 font-display text-xl">{r.title}</p>
                <p className="mt-2 text-ivory/70">{r.body}</p>
                <p className="mt-3 text-xs text-stone">
                  {r.display_name} · {r.city_country}
                  {r.source === "studio_preview" ? ` · ${t("studioPreview")}` : null}
                </p>
              </blockquote>
            ))}
          </div>
        </Container>
      </section>

      {faqs.length > 0 ? (
        <section className="py-16">
          <Container className="max-w-3xl">
            <h2 className="font-display text-4xl">{t("faq")}</h2>
            <div className="mt-8 space-y-3">
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
          </Container>
        </section>
      ) : null}

      {premium || keys || photo || crm ? null : (
        <section className="border-t border-gold/30 py-12">
          <Container className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-2xl">{t("vaultStrip")}</p>
            <Link href="/systems/the-vault" className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-ink">
              {t("vaultCta")}
            </Link>
          </Container>
        </section>
      )}
    </>
  );
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [hero, ...rest] = images;
  return (
    <div className="grid grid-cols-2 gap-3">
      {hero ? (
        <div className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-2xl">
          <Image src={hero} alt={alt} fill className="object-cover" sizes="50vw" priority />
        </div>
      ) : null}
      {rest.map((src, i) => (
        <div key={src + i} className="relative aspect-square overflow-hidden rounded-2xl">
          <Image src={src} alt={alt} fill className="object-cover" sizes="25vw" />
        </div>
      ))}
    </div>
  );
}
