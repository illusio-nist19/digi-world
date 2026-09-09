import { FALLBACK_CATALOG } from "./fallback-catalog";
import { API, type Catalog, type Product } from "./types";

export async function getCatalog(): Promise<Catalog> {
  try {
    const res = await fetch(`${API}/catalog`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("catalog");
    const data = (await res.json()) as Catalog;
    if (!data?.products?.length) throw new Error("empty");
    return data;
  } catch {
    return FALLBACK_CATALOG;
  }
}

export function productBySlug(catalog: Catalog, slug: string): Product | undefined {
  return catalog.products.find((p) => p.slug === slug || p.sku === slug);
}

export function productsIn(catalog: Catalog, collection: string): Product[] {
  return catalog.products.filter((p) => p.collection === collection);
}

export function systems(catalog: Catalog): Product[] {
  return catalog.products.filter((p) => p.type === "system");
}
