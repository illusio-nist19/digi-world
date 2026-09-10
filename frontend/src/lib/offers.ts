import type { Product } from "./types";

export type OfferId = "solo" | "duo" | "pair" | "vault" | "vault_duo" | "addon";

export type CartLine = {
  key: string;
  sku: string;
  slug: string;
  offerId: OfferId;
  name: string;
  unitPriceCents: number;
  qty: number;
  image: string;
  isCrossSell?: boolean;
};

export function priceOffer(product: Product, offerId: OfferId, pair?: Product | null): { cents: number; lines: Omit<CartLine, "key" | "name" | "image">[] } {
  if (product.type === "addon") {
    return {
      cents: product.price_cents,
      lines: [{ sku: product.sku, slug: product.slug, offerId: "addon", unitPriceCents: product.price_cents, qty: 1 }],
    };
  }
  if (product.type === "vault") {
    const duo = offerId === "vault_duo";
    const cents = duo ? product.duo_price_cents || 14900 : product.price_cents;
    return {
      cents,
      lines: [{ sku: product.sku, slug: product.slug, offerId: duo ? "vault_duo" : "vault", unitPriceCents: cents, qty: 1 }],
    };
  }
  if (offerId === "duo") {
    const cents = product.duo_price_cents || 2900;
    return {
      cents,
      lines: [{ sku: product.sku, slug: product.slug, offerId: "duo", unitPriceCents: cents, qty: 1 }],
    };
  }
  if (offerId === "pair" && pair) {
    const total = product.pair_price_cents || 3400;
    const primary = product.price_cents;
    const secondary = total - primary;
    return {
      cents: total,
      lines: [
        { sku: product.sku, slug: product.slug, offerId: "pair", unitPriceCents: primary, qty: 1 },
        { sku: pair.sku, slug: pair.slug, offerId: "pair", unitPriceCents: secondary, qty: 1 },
      ],
    };
  }
  return {
    cents: product.price_cents,
    lines: [{ sku: product.sku, slug: product.slug, offerId: "solo", unitPriceCents: product.price_cents, qty: 1 }],
  };
}
