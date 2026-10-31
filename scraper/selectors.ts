/** Selector situs sumber — terpusat di satu file.
 * Referensi & tanggal verifikasi: .agents/skills/yamaha-sales-website/references/scraping-selectors.md
 */
export const BASE_URL = "https://www.yamaha-motor.co.id";
export const SITEMAP_URL = `${BASE_URL}/products-sitemap.xml`;

export const SEL = {
  jsonLd: 'script[type="application/ld+json"]',
  title: "h1.product-title",
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
  ogImage: 'meta[property="og:image"]',

  // Varian & warna
  variantTabText: ".sec2-version-txt",
  variantBlock: ".sec2-div",
  variantImage: ".sec2-swiper-img",
  colorSwatch: ".sec2-color-div",
  variantTag3: ".sec2-color-tag3",
  priceLabel: ".sec2-color-tag4",

  // Fitur
  feature: ".sec3-swiper-div",
  featureTitle: ".sec3-swiper-title",
  featureText: ".sec3-swiper-txt",
  featureImage: ".sec3-swiper-img",

  // Spesifikasi
  specTitle: ".sec4-title-txt",
  specCollapse: ".sec4-coll",
  specLabel: ".sec4-td1",
  specValue: ".sec4-td3",

  // Aksesoris
  accessory: ".sec7-col",
  accessoryName: ".sec7-txt1",
  accessoryPrice: ".sec7-txt2",
  accessoryLabel: ".sec7-txt3",
  accessoryLink: "a.sec7-img-a",
  accessoryImage: ".sec7-img",
} as const;

/** Nama kategori di breadcrumb / URL → kategori internal */
export const CATEGORY_MAP: Record<string, string> = {
  matic: "matic",
  "maxi-yamaha": "maxi",
  maxi: "maxi",
  classy: "classy",
  sport: "sport",
  moped: "moped",
  "off-road": "off-road",
  offroad: "off-road",
};

/** Pemetaan kategori resmi 28 produk Yamaha Indonesia (fallback jika breadcrumb hilang/salah) */
export const KNOWN_PRODUCT_CATEGORIES: Record<string, string> = {
  "gear-ultima": "matic",
  "gear-125": "matic",
  "freego-125": "matic",
  "x-ride": "matic",
  "mio-m3": "matic",
  fino: "matic",
  "tmax-tech-max": "maxi",
  "xmax-connected": "maxi",
  "nmax-turbo": "maxi",
  "aerox-alpha": "maxi",
  "lexi-lx-155": "maxi",
  "all-new-nmax155-connected": "maxi",
  "all-new-aerox155-connected": "maxi",
  "grand-filano": "classy",
  fazzio: "classy",
  "xsr-155": "sport",
  "all-new-r15-connected": "sport",
  r25: "sport",
  mt25: "sport",
  mt15: "sport",
  vixion: "sport",
  "mx-king-150": "moped",
  "jupiter-z1": "moped",
  "vega-force": "moped",
  wr155r: "off-road",
  yz125x: "off-road",
  yz250x: "off-road",
  yz250fx: "off-road",
};

