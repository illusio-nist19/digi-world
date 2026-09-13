import { FALLBACK_CATALOG } from "./fallback-catalog";
import { API, type Catalog, type Product } from "./types";

export async function getCatalog(): Promise<Catalog> {
  // EasyPanel `next build` must not prerender whatever is still on the live API.
  // Missing product images then fail the Docker image with exit code 1.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return FALLBACK_CATALOG;
  }
  try {
    const res = await fetch(`${API}/catalog`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error("catalog");
    const data = (await res.json()) as Catalog;
    if (!data || !Array.isArray(data.products)) throw new Error("catalog");
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
