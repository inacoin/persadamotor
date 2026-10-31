import { fetchText } from "./fetch";
import { BASE_URL, SITEMAP_URL } from "./selectors";

export type ProductRef = { slug: string; url: string };

const CATEGORY_PAGES = ["matic", "maxi-yamaha", "classy", "sport", "moped", "off-road"];

function toRef(href: string): ProductRef | null {
  const url = new URL(href, BASE_URL);
  const m = url.pathname.match(/^\/product\/([^/]+)\/?$/);
  if (!m) return null;
  return { slug: m[1], url: `${BASE_URL}/product/${m[1]}/` };
}

function dedupe(refs: ProductRef[]): ProductRef[] {
  const map = new Map<string, ProductRef>();
  for (const r of refs) map.set(r.slug.toLowerCase(), r);
  return [...map.values()];
}

/** Daftar produk dari sitemap; fallback ke halaman kategori. */
export async function getProductRefs(): Promise<ProductRef[]> {
  try {
    const xml = await fetchText(SITEMAP_URL);
    const refs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
      .map((m) => toRef(m[1]))
      .filter((r): r is ProductRef => r !== null);
    if (refs.length > 0) return dedupe(refs);
  } catch (err) {
    console.warn(`[sitemap] gagal, fallback ke halaman kategori: ${(err as Error).message}`);
  }

  const refs: ProductRef[] = [];
  for (const cat of CATEGORY_PAGES) {
    const html = await fetchText(`${BASE_URL}/products/category/${cat}/`);
    for (const m of html.matchAll(/href="([^"]*\/product\/[^"?#]+)/g)) {
      const r = toRef(m[1]);
      if (r) refs.push(r);
    }
  }
  return dedupe(refs);
}
