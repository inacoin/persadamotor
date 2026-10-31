import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BASE_URL } from "./selectors";

const CACHE_DIR = path.resolve(".cache/html");
const DELAY_MS = 1500;
const MAX_RETRIES = 3;

const contact = process.env.SCRAPER_CONTACT ?? "kontak@persadamotor.id";
export const USER_AGENT = `PersadaMotorBot/1.0 (+mailto:${contact})`;

let lastRequest = 0;
let disallowed: string[] | null = null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Jeda minimal antar request (concurrency 1). */
async function throttle() {
  const wait = lastRequest + DELAY_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();
}

async function rawFetch(url: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    await throttle();
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, "Accept-Language": "id-ID,id;q=0.9" },
        signal: AbortSignal.timeout(30_000),
      });
      if (res.ok) return await res.text();
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status} ${url}`);
        await sleep(DELAY_MS * 2 ** attempt);
        continue;
      }
      throw new Error(`HTTP ${res.status} ${url}`);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES) await sleep(DELAY_MS * 2 ** attempt);
    }
  }
  throw lastErr;
}

/** Muat & patuhi robots.txt (User-Agent: *). */
export async function loadRobots(): Promise<void> {
  const txt = await rawFetch(`${BASE_URL}/robots.txt`);
  disallowed = txt
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^disallow:/i.test(l))
    .map((l) => l.replace(/^disallow:\s*/i, ""))
    .filter(Boolean);
}

export function isAllowed(url: string): boolean {
  const p = new URL(url).pathname;
  return !(disallowed ?? ["/uploads/"]).some((d) => p.startsWith(d));
}

export async function fetchText(url: string): Promise<string> {
  if (!isAllowed(url)) throw new Error(`Diblokir robots.txt: ${url}`);
  return rawFetch(url);
}

/** Fetch halaman produk + simpan HTML mentah ke cache. Mode offline: baca cache saja. */
export async function fetchProductHtml(slug: string, url: string, offline = false): Promise<string> {
  const file = path.join(CACHE_DIR, `${slug}.html`);
  if (offline) return readFile(file, "utf8");
  const html = await fetchText(url);
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(file, html, "utf8");
  return html;
}

