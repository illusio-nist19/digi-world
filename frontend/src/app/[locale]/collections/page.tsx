import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getCatalog } from "@/lib/catalog";
import { loc } from "@/lib/types";
import { Container } from "@/components/ui";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Collections({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const catalog = await getCatalog();
  return (
    <Container className="py-16">
      <h1 className="font-display text-5xl">{t("collectionsTitle")}</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {catalog.collections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={c.image} alt={loc(c.name, locale)} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
            <div className="absolute bottom-5 start-5">
              <h2 className="font-display text-3xl">{loc(c.name, locale)}</h2>
              <p className="text-ivory/70">{loc(c.sub, locale)}</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
