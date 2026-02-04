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

const JEWELRY_CATALOG_URL = '/jewelry-catalog.json';
const CATALOG_URL = '/data/catalog.json';
const emptyCatalog: Catalog = {
  rings: [],
  bracelets: [],
  earrings: [],
  necklaces: [],
};

let cached: Catalog | null = null;

interface JewelryCatalogProduct {
  category: string;
  displayName?: string;
  variants: Record<string, string>;
}

function jewelryToCatalog(raw: { products: Record<string, JewelryCatalogProduct> }): Catalog {
  const catalog: Catalog = {
    rings: [],
    bracelets: [],
    earrings: [],
    necklaces: [],
  };
  const categoryKey = (c: string): CatalogCategory =>
    (c === 'rings' || c === 'necklaces' || c === 'bracelets' || c === 'earrings' ? c : 'rings');
  for (const [productKey, p] of Object.entries(raw.products)) {
    const category = categoryKey(p.category);
    const name = p.displayName ?? productKey.replace(/_/g, ' ');
    const variants = Object.entries(p.variants).map(([name, image]) => ({ name, image }));
    catalog[category].push({ id: productKey, name, variants });
  }
  return catalog;
}

export async function getCatalog(): Promise<Catalog> {
  if (cached) return cached;
  const jewelryRes = await fetch(JEWELRY_CATALOG_URL);
  if (jewelryRes.ok) {
    const data = (await jewelryRes.json()) as { products: Record<string, JewelryCatalogProduct> };
    if (data.products && typeof data.products === 'object') {
      cached = jewelryToCatalog(data);
      return cached;
    }
  }
  const res = await fetch(CATALOG_URL);
  if (!res.ok) {
    cached = emptyCatalog;
    return cached;
  }
  cached = (await res.json()) as Catalog;
  return cached;
}

export function getCategoryProducts(catalog: Catalog, category: CatalogCategory): CatalogProduct[] {
  return catalog[category] ?? [];
}
