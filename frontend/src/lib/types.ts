import type { Locale } from "@/i18n/routing";

export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Localized = Record<string, string>;

export type ProductType = "system" | "addon" | "vault";

export type Product = {
  sku: string;
  slug: string;
  type: ProductType;
  serial?: string | null;
  collection: string;
  name: Localized;
  sub: Localized;
  headline: Localized;
  description: Localized;
  contents: Localized;
  faq: Array<Record<string, { q: string; a: string }>>;
  images: string[];
  price_cents: number;
  compare_cents?: number | null;
  duo_price_cents?: number | null;
  pair_sku?: string | null;
  pair_price_cents?: number | null;
  upsell_sku?: string | null;
  upsell_price_cents?: number | null;
  cross_sell: string[];
  includes?: string[] | null;
  license_pool: number;
  licenses_issued: number;
  drop_label: string;
  gender?: string | null;
};

export type Collection = {
  slug: string;
  name: Localized;
  sub: Localized;
  image: string;
  sort: number;
};

export type Review = {
  product_sku: string;
  locale: string;
  stars: number;
  title: string;
  body: string;
  display_name: string;
  city_country: string;
  verified?: boolean;
  source?: string;
};

export type Catalog = {
  drop: string;
  currency: string;
  licenses_issued: number;
  collections: Collection[];
  products: Product[];
  reviews: Review[];
};

export function loc(map: Localized | undefined, locale: string, fallback = "") {
  if (!map) return fallback;
  return map[locale] || map.en || map.ar || fallback;
}

export function money(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function isPremium(product: Product) {
  return product.price_cents >= 10000;
}

export function soloCents(product: Product) {
  return product.price_cents;
}

export function duoCents(product: Product) {
  if (product.duo_price_cents) return product.duo_price_cents;
  if (product.type === "system") return 2900;
  return product.price_cents;
}
