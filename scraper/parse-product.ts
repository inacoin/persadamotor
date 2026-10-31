import * as cheerio from "cheerio";
import type { Accessory, Faq, Feature, Product, SpecGroup, Variant } from "../lib/schema";
import { BASE_URL, CATEGORY_MAP, KNOWN_PRODUCT_CATEGORIES, SEL } from "./selectors";

type CheerioAPI = ReturnType<typeof cheerio.load>;

export const clean = (s: string | undefined | null): string => (s ?? "").replace(/\s+/g, " ").trim();

/** "Rp 29.145.000" / "Rp 570,000" → 29145000 / 570000 */
export function parsePrice(text: string): number | null {
  const digits = text.replace(/\D/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return n > 0 ? n : null;
}

export function absUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  try {
    return new URL(src.trim(), BASE_URL).href;
  } catch {
    return undefined;
  }
}

type JsonLd = Record<string, unknown>;

function readJsonLd($: CheerioAPI): JsonLd[] {
  const out: JsonLd[] = [];
  $(SEL.jsonLd).each((_, el) => {
    try {
      const data = JSON.parse($(el).text());
      for (const d of Array.isArray(data) ? data : [data]) if (d && typeof d === "object") out.push(d);
    } catch {
      /* JSON-LD rusak → abaikan */
    }
  });
  return out;
}

const byType = (items: JsonLd[], type: string) => items.find((d) => d["@type"] === type);

function parseCategory(ld: JsonLd[]): string | undefined {
  const bc = byType(ld, "BreadcrumbList") as { itemListElement?: { item?: string; name?: string }[] } | undefined;
  for (const el of bc?.itemListElement ?? []) {
    const m = String(el.item ?? "").match(/\/products\/category\/([^/]+)/);
    if (m && CATEGORY_MAP[m[1].toLowerCase()]) return CATEGORY_MAP[m[1].toLowerCase()];
    const byName = CATEGORY_MAP[clean(el.name).toLowerCase().replace(/\s+/g, "-")];
    if (byName) return byName;
  }
  return undefined;
}

function parseVariants($: CheerioAPI): Variant[] {
  const tabNames = $(SEL.variantTabText)
    .map((_, el) => clean($(el).text()))
    .get();

  return $(SEL.variantBlock)
    .map((i, block) => {
      const $b = $(block);
      const tag3 = $b.find(SEL.variantTag3).map((_, el) => clean($(el).text())).get();
      const priceText = tag3.find((t) => /^rp/i.test(t)) ?? "";
      const name = tabNames[i] || tag3.find((t) => !/^rp/i.test(t)) || `Varian ${i + 1}`;
      const images = $b.find(SEL.variantImage).map((_, el) => absUrl($(el).attr("src"))).get();
      const colors = $b
        .find(SEL.colorSwatch)
        .map((j, el) => {
          const $c = $(el);
          const hex = ($c.attr("style") ?? "").match(/background-color:\s*(#[0-9a-f]{3,8})/i)?.[1] ?? "";
          const no = Number.parseInt($c.attr("data-no") ?? String(j), 10);
          return { name: clean($c.attr("data-src")), hex: hex.toLowerCase(), image: images[no] ?? images[j] };
        })
        .get()
        .filter((c) => c.name);
      return {
        name,
        price: parsePrice(priceText),
        priceLabel: clean($b.find(SEL.priceLabel).first().text()) || "Harga Rekomendasi OTR Jakarta",
        colors,
      } satisfies Variant;
    })
    .get();
}

/** Fallback harga dari FAQ JSON-LD: "Hybrid Rp 24.300.000, Hybrid Connected Rp 26.200.000" */
function variantsFromFaq(faq: Faq[]): Variant[] {
  const priceFaq = faq.find((f) => /harga/i.test(f.question) && /rp/i.test(f.answer));
  if (!priceFaq) return [];
  const body = priceFaq.answer.replace(/^[^:]*:\s*/, "");
  return [...body.matchAll(/([^,.:]+?)\s+Rp\s*([\d.]+)/gi)].map((m) => ({
    name: clean(m[1]),
    price: parsePrice(m[2]),
    priceLabel: "Harga Rekomendasi OTR Jakarta",
    colors: [],
  }));
}

function parseFeatures($: CheerioAPI): Feature[] {
  const seen = new Set<string>();
  const out: Feature[] = [];
  $(SEL.feature).each((_, el) => {
    const $f = $(el);
    const title = clean($f.find(SEL.featureTitle).text());
    if (!title || seen.has(title)) return;
    seen.add(title);
    out.push({
      title,
      description: clean($f.find(SEL.featureText).text()),
      image: absUrl($f.find(SEL.featureImage).attr("src")),
    });
  });
  return out;
}

function parseSpecs($: CheerioAPI): SpecGroup[] {
  const titles = $(SEL.specTitle).map((_, el) => clean($(el).text())).get();
  return $(SEL.specCollapse)
    .map((i, el) => {
      const items = $(el)
        .find("tr")
        .map((_, tr) => ({
          label: clean($(tr).find(SEL.specLabel).text()),
          value: clean($(tr).find(SEL.specValue).text()),
        }))
        .get()
        .filter((r) => r.label);
      return { group: titles[i] || `Spesifikasi ${i + 1}`, items };
    })
    .get()
    .filter((g) => g.items.length > 0);
}

function parseAccessories($: CheerioAPI): Accessory[] {
  const seen = new Set<string>();
  const out: Accessory[] = [];
  $(SEL.accessory).each((_, el) => {
    const $a = $(el);
    const name = clean($a.find(SEL.accessoryName).text());
    if (!name || seen.has(name)) return;
    seen.add(name);
    out.push({
      name,
      price: parsePrice($a.find(SEL.accessoryPrice).text()),
      priceLabel: clean($a.find(SEL.accessoryLabel).text()) || undefined,
      url: absUrl($a.find(SEL.accessoryLink).attr("href")),
      image: absUrl($a.find(SEL.accessoryImage).attr("src")),
    });
  });
  return out;
}

function parseFaq(ld: JsonLd[]): Faq[] {
  const page = byType(ld, "FAQPage") as
    | { mainEntity?: { name?: string; acceptedAnswer?: { text?: string } }[] }
    | undefined;
  return (page?.mainEntity ?? [])
    .map((q) => ({ question: clean(q.name), answer: clean(q.acceptedAnswer?.text) }))
    .filter((q) => q.question && q.answer);
}

export type ParseResult = { product: Partial<Product>; warnings: string[] };

/** HTML halaman produk → objek Product (belum divalidasi). */
export function parseProduct(html: string, sourceSlug: string, sourceUrl: string, scrapedAt: string): ParseResult {
  const $ = cheerio.load(html);
  const ld = readJsonLd($);
  const warnings: string[] = [];
  const group = byType(ld, "ProductGroup") ?? byType(ld, "Product");

  const h1Name = clean($(SEL.title).first().text());
  const ogTitle = clean($(SEL.ogTitle).attr("content"));
  // JSON-LD sering copy-paste salah dari template produk lain di situs Yamaha,
  // maka prioritaskan h1 / og:title jika ada
  const name = h1Name || ogTitle || clean(group?.name as string) || clean($("title").text().split(",")[0]);
  const faq = parseFaq(ld);

  let variants = parseVariants($);
  if (variants.length === 0 || variants.every((v) => v.price === null)) {
    const fromFaq = variantsFromFaq(faq);
    if (fromFaq.length) {
      warnings.push("harga varian diambil dari FAQ (fallback)");
      variants = variants.length ? variants : fromFaq;
    }
  }

  // Cek kategori dari map resmi (karena breadcrumb di situs Yamaha sering salah copy-paste), fallback ke breadcrumb
  const category = KNOWN_PRODUCT_CATEGORIES[sourceSlug.toLowerCase()] || parseCategory(ld);
  if (!category) warnings.push("kategori tidak ditemukan");

  const features = parseFeatures($);
  const specs = parseSpecs($);
  if (!specs.length) warnings.push("spesifikasi kosong");
  if (!features.length) warnings.push("fitur kosong");

  const prices = variants.map((v) => v.price).filter((p): p is number => p !== null);

  return {
    warnings,
    product: {
      id: sourceSlug.toLowerCase(),
      sourceSlug,
      sourceUrl,
      name,
      category: category as Product["category"],
      description: clean(group?.description as string) || clean($(SEL.ogDescription).attr("content")) || undefined,
      featuredImage: absUrl($(SEL.ogImage).attr("content")),
      variants,
      features,
      specs,
      accessories: parseAccessories($),
      faq,
      priceFrom: prices.length ? Math.min(...prices) : null,
      scrapedAt,
    },
  };
}

