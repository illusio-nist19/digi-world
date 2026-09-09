import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { loc, money, type Product } from "@/lib/types";

export function StarRow({ stars = 5, count }: { stars?: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-gold text-sm">
      {"★★★★★".slice(0, stars)}
      {typeof count === "number" ? <span className="text-stone ms-1">({count})</span> : null}
    </span>
  );
}

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>{children}</div>;
}

export function Split({
  image,
  alt,
  flip,
  children,
  tone = "dark",
}: {
  image: string;
  alt: string;
  flip?: boolean;
  children: React.ReactNode;
  tone?: "dark" | "light";
}) {
  const bg = tone === "light" ? "bg-ivory text-ink" : "bg-ink text-ivory";
  return (
    <section className={`${bg} py-16 md:py-24`}>
      <Container>
        <div className={`grid items-center gap-10 md:grid-cols-2 ${flip ? "md:[&>div:first-child]:order-2" : ""}`}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src={image} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div>{children}</div>
        </div>
      </Container>
    </section>
  );
}

export async function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const t = await getTranslations("product");
  const href = `/systems/${product.slug}` as const;
  const price = product.type === "addon" ? product.price_cents : product.type === "vault" ? product.price_cents : 1900;
  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl bg-ink-3">
      <div className="relative aspect-[4/5]">
        <Image src={product.images[0] || "/images/og-default.png"} alt={loc(product.name, locale)} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(min-width: 1024px) 25vw, 50vw" />
        <span className="absolute top-3 start-3 rounded-full bg-ink/70 px-3 py-1 text-xs text-gold">{product.drop_label}</span>
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-widest text-gold">{t("certified")}</p>
        <h3 className="font-display text-xl font-semibold">{loc(product.name, locale)}</h3>
        <p className="text-sm text-stone">{loc(product.sub, locale)}</p>
        <StarRow stars={5} count={12} />
        <p className="font-display text-lg text-gold">
          {t("from")} {money(price)}
        </p>
        <span className="inline-flex text-sm text-ivory/80">{t("view")} →</span>
      </div>
    </Link>
  );
}
