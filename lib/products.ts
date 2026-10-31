import productsData from "../data/products.json";
import overridesData from "../data/overrides.json";
import { CATEGORIES, OverridesSchema, ProductsFileSchema, type Category, type Product } from "./schema";

export type SiteProduct = Product & { featured: boolean; badge?: string };

const file = ProductsFileSchema.parse(productsData);
const overrides = OverridesSchema.parse(overridesData);

/** Gabungkan hasil scrape dengan data/overrides.json (overrides selalu menang). */
function applyOverrides(p: Product): SiteProduct | null {
  const o = overrides.products?.[p.id] ?? {};
  if (o.hidden) return null;
  const adj = overrides.defaults?.priceAdjustment ?? 0;
  const regionLabel = overrides.defaults?.priceRegionLabel;

  const variants = p.variants.map((v) => {
    const manual = o.variantPrices?.[v.name];
    const price = manual ?? (v.price !== null ? v.price + adj : null);
    return {
      ...v,
      price,
      priceLabel: regionLabel ? v.priceLabel.replace(/OTR\s+\w+/i, regionLabel) : v.priceLabel,
      colors: v.colors.map((c) => ({ ...c, image: o.images?.[c.name] ?? c.image })),
    };
  });
  const prices = variants.map((v) => v.price).filter((x): x is number => x !== null);

  return {
    ...p,
    variants,
    priceFrom: prices.length ? Math.min(...prices) : null,
    featured: o.featured ?? false,
    badge: o.badge,
  };
}

const products: SiteProduct[] = file.products.map(applyOverrides).filter((p): p is SiteProduct => p !== null);

export const scrapedAt = file.scrapedAt;

export function getAllProducts(): SiteProduct[] {
  return products;
}

export function getProduct(id: string): SiteProduct | undefined {
  return products.find((p) => p.id === id.toLowerCase());
}

export function getCategories(): Category[] {
  return CATEGORIES.filter((c) => products.some((p) => p.category === c));
}

export function getFeaturedProducts(limit = 8): SiteProduct[] {
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export function getRelatedProducts(p: SiteProduct, limit = 4): SiteProduct[] {
  return products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, limit);
}

/** Gambar utama kartu produk: warna pertama varian pertama, fallback og:image. */
export function getCoverImage(p: Product): string | undefined {
  return p.variants.find((v) => v.colors[0]?.image)?.colors[0]?.image ?? p.featuredImage;
}

