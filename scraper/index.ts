import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ProductSchema, type Product, type ProductsFile } from "../lib/schema";
import { fetchProductHtml, loadRobots } from "./fetch";
import { parseProduct } from "./parse-product";
import { BASE_URL } from "./selectors";
import { getProductRefs, type ProductRef } from "./sitemap";

/**
 * npm run scrape [-- --only=slug] [--verbose] [--offline] [--dry-run]
 * Dokumentasi: docs/SCRAPER.md
 */
const args = process.argv.slice(2);
const flag = (n: string) => args.includes(`--${n}`);
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1];
const verbose = flag("verbose");
const offline = flag("offline");
const dryRun = flag("dry-run");

const DATA_DIR = path.resolve("data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const REPORT_FILE = path.join(DATA_DIR, "scrape-report.json");
const MIN_RATIO = 0.8;

const CATEGORY_ORDER = ["matic", "maxi", "classy", "sport", "moped", "off-road"];

async function readPrevious(): Promise<ProductsFile | null> {
  try {
    return JSON.parse(await readFile(PRODUCTS_FILE, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const started = Date.now();
  const scrapedAt = new Date().toISOString();

  let refs: ProductRef[];
  if (offline) {
    const { readdir } = await import("node:fs/promises");
    const files = await readdir(path.resolve(".cache/html")).catch(() => [] as string[]);
    refs = files
      .filter((f) => f.endsWith(".html"))
      .map((f) => f.replace(/\.html$/, ""))
      .map((slug) => ({ slug, url: `${BASE_URL}/product/${slug}/` }));
  } else {
    await loadRobots();
    refs = await getProductRefs();
  }
  if (only) refs = refs.filter((r) => r.slug.toLowerCase() === only.toLowerCase());
  console.log(`[scrape] ${refs.length} produk${offline ? " (offline)" : ""}`);

  const products: Product[] = [];
  const report: { slug: string; status: "ok" | "error"; warnings: string[]; error?: string }[] = [];

  for (const [i, ref] of refs.entries()) {
    const tag = `[${i + 1}/${refs.length}] ${ref.slug}`;
    try {
      const html = await fetchProductHtml(ref.slug, ref.url, offline);
      const { product, warnings } = parseProduct(html, ref.slug, ref.url, scrapedAt);
      const parsed = ProductSchema.safeParse(product);
      if (!parsed.success) {
        const msg = parsed.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ");
        throw new Error(`validasi gagal — ${msg}`);
      }
      products.push(parsed.data);
      report.push({ slug: ref.slug, status: "ok", warnings });
      const v = parsed.data.variants;
      console.log(
        `${tag} ✔ ${parsed.data.name} | ${parsed.data.category} | ${v.length} varian | ` +
          `${v.reduce((n, x) => n + x.colors.length, 0)} warna${warnings.length ? ` | ⚠ ${warnings.join(", ")}` : ""}`,
      );
      if (verbose) console.dir(parsed.data, { depth: 4 });
    } catch (err) {
      const error = (err as Error).message;
      report.push({ slug: ref.slug, status: "error", warnings: [], error });
      console.error(`${tag} ✖ ${error}`);
    }
  }

  products.sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.name.localeCompare(b.name, "id"),
  );

  const previous = await readPrevious();
  const errors = report.filter((r) => r.status === "error").length;
  const summary = {
    scrapedAt,
    durationMs: Date.now() - started,
    total: refs.length,
    ok: products.length,
    errors,
    previousCount: previous?.count ?? null,
    items: report,
  };

  if (dryRun) {
    console.log(`[scrape] dry-run: ${products.length} OK, ${errors} error — tidak menulis file`);
    return;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(REPORT_FILE, JSON.stringify(summary, null, 2) + "\n", "utf8");

  // Mode --only: gabungkan ke data lama, jangan timpa seluruh file
  let finalProducts = products;
  if (only && previous) {
    const map = new Map(previous.products.map((p) => [p.id, p]));
    for (const p of products) map.set(p.id, p);
    finalProducts = [...map.values()];
  } else if (previous && products.length < previous.count * MIN_RATIO) {
    console.error(
      `[scrape] ✖ hanya ${products.length} produk valid (sebelumnya ${previous.count}). ` +
        `products.json TIDAK ditimpa.`,
    );
    process.exitCode = 1;
    return;
  }

  if (finalProducts.length === 0) {
    console.error("[scrape] ✖ tidak ada produk valid. products.json TIDAK ditulis.");
    process.exitCode = 1;
    return;
  }

  const file: ProductsFile = {
    source: `${BASE_URL}/`,
    scrapedAt,
    count: finalProducts.length,
    products: finalProducts,
  };
  await writeFile(PRODUCTS_FILE, JSON.stringify(file, null, 2) + "\n", "utf8");
  console.log(`[scrape] ✔ ${finalProducts.length} produk ditulis ke data/products.json (${errors} error)`);
  if (errors > 0) console.warn(`[scrape] ⚠ ${errors} produk gagal — lihat data/scrape-report.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
