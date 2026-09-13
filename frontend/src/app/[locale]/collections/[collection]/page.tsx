import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getCatalog, productsIn } from "@/lib/catalog";
import { loc } from "@/lib/types";
import { Container, ProductCard, Split } from "@/components/ui";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ["creator-lab", "ai-command", "wealth-os", "glow-ritual", "the-vault"].map((collection) => ({ locale, collection })),
  );
}

export default async function CollectionPage({ params }: { params: Promise<{ locale: string; collection: string }> }) {
  const { locale, collection } = await params;
  setRequestLocale(locale);
  const catalog = await getCatalog();
  const col = catalog.collections.find((c) => c.slug === collection);
  if (!col) notFound();
  const items = productsIn(catalog, collection);
  const vault = catalog.products.find((p) => p.type === "vault");
  return (
    <>
      <section className="relative min-h-[40vh]">
        <Image src={col.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-ink/75" />
        <Container className="relative py-24">
          <h1 className="font-display text-5xl">{loc(col.name, locale)}</h1>
          <p className="mt-3 max-w-xl text-ivory/80">{loc(col.sub, locale)}</p>
        </Container>
      </section>
      <Container className="py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.sku} product={p} locale={locale} />
          ))}
        </div>
      </Container>
      <Split image="/images/product-vault-01.png" alt="" flip>
        <h2 className="font-display text-4xl">{loc(vault?.headline, locale)}</h2>
        <p className="mt-4 text-ivory/80">{loc(vault?.sub, locale)}</p>
        <Link href="/systems/the-vault" className="mt-6 inline-flex h-12 items-center rounded-full bg-gold px-6 text-ink">
          $97
        </Link>
      </Split>
    </>
  );
}
