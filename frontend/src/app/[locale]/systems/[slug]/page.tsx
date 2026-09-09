import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PdpOffers } from "@/components/commerce";
import { Container, Split, StarRow } from "@/components/ui";
import { getCatalog, productBySlug } from "@/lib/catalog";
import { loc, money } from "@/lib/types";
import { routing } from "@/i18n/routing";
import { ViewContentPing } from "@/components/view-content";
import type { Metadata } from "next";

export function generateStaticParams() {
  const slugs = ["creator-os", "faceless-studio", "hook-vault", "ai-operator", "offer-engine", "wealth-os", "glow-ritual", "time-command", "caption-machine", "ad-swipe", "launch-sprint", "the-vault"];
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const catalog = await getCatalog();
  const product = productBySlug(catalog, slug);
  if (!product) return {};
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
  const reviews = catalog.reviews.filter((r) => r.product_sku === product.sku || r.product_sku === "DW-VAULT-001");
  const faqs = product.faq || [];

  return (
    <>
      <ViewContentPing sku={product.sku} value={product.price_cents / 100} />
      <Container className="grid gap-10 py-10 md:grid-cols-2">
        <Gallery images={product.images} alt={loc(product.name, locale)} />
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">{t("original")} · {product.serial}</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">{loc(product.headline, locale)}</h1>
          <p className="mt-3 text-ivory/80">{loc(product.sub, locale)}</p>
          <div className="mt-4 flex items-center gap-3">
            <StarRow stars={5} count={reviews.length || 8} />
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs text-gold">{t("certified")}</span>
          </div>
          <p className="mt-4 font-display text-3xl text-gold">{money(product.type === "system" ? 1900 : product.price_cents)}</p>
          <div className="mt-6">
            <PdpOffers product={product} catalog={catalog} />
          </div>
        </div>
      </Container>

      <Split image={product.images[1] || product.images[0]} alt="" flip={false} tone="light">
        <h2 className="font-display text-4xl">{loc(product.name, locale)}</h2>
        <p className="mt-4 text-ink/70">{loc(product.description, locale)}</p>
      </Split>
      <Split image={product.images[2] || product.images[0]} alt="" flip tone="dark">
        <h2 className="font-display text-4xl">{t("inside")}</h2>
        <p className="mt-4 whitespace-pre-line text-ivory/80">{loc(product.contents, locale)}</p>
      </Split>
      <Split image={product.images[3] || product.images[0]} alt="" flip={false} tone="light">
        <h2 className="font-display text-4xl">{t("for")}</h2>
        <p className="mt-4 text-ink/70">{t("notFor")}</p>
      </Split>

      <section className="py-16">
        <Container>
          <h2 className="font-display text-4xl">{t("science")}</h2>
          <p className="mt-4 max-w-2xl text-ivory/70">{t("scienceBody")}</p>
        </Container>
      </section>

      <section className="bg-ink-2 py-16">
        <Container>
          <h2 className="font-display text-4xl">{t("reviews")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <blockquote key={r.title} className="rounded-2xl bg-ink-3 p-5">
                <StarRow stars={r.stars} />
                <p className="mt-3 font-display text-xl">{r.title}</p>
                <p className="mt-2 text-ivory/70">{r.body}</p>
                <p className="mt-3 text-xs text-stone">{r.display_name} · {r.city_country}</p>
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

      <section className="border-t border-gold/30 py-12">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-2xl">{t("vaultStrip")}</p>
          <Link href="/systems/the-vault" className="inline-flex h-12 items-center rounded-full bg-gold px-6 text-ink">
            {t("vaultCta")}
          </Link>
        </Container>
      </section>
    </>
  );
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const shots = images.slice(0, 4);
  return (
    <div className="grid grid-cols-2 gap-3">
      {shots.map((src, i) => (
        <div key={src + i} className={`relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 aspect-[4/5]" : "aspect-square"}`}>
          <Image src={src} alt={alt} fill className="object-cover" sizes="50vw" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
