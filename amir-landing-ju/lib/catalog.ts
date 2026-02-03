export interface CatalogVariant {
  name: string;
  image: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  variants: CatalogVariant[];
}

export type CatalogCategory = 'rings' | 'bracelets' | 'earrings' | 'necklaces';

export interface Catalog {
  rings: CatalogProduct[];
  bracelets: CatalogProduct[];
  earrings: CatalogProduct[];
  necklaces: CatalogProduct[];
}

const CATALOG_URL = '/data/catalog.json';
let cached: Catalog | null = null;

export async function getCatalog(): Promise<Catalog> {
  if (cached) return cached;
  const res = await fetch(CATALOG_URL);
  if (!res.ok) {
    cached = {
      rings: [],
      bracelets: [],
      earrings: [],
      necklaces: [],
    };
    return cached;
  }
  cached = (await res.json()) as Catalog;
  return cached;
}

export function getCategoryProducts(catalog: Catalog, category: CatalogCategory): CatalogProduct[] {
  return catalog[category] ?? [];
}
