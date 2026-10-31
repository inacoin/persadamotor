---
name: yamaha-sales-website
description: >-
  Panduan membangun & memelihara website sales Yamaha (Persada Motor) yang datanya
  di-scrape dari https://www.yamaha-motor.co.id/. Gunakan saat membuat/memperbaiki
  scraper produk Yamaha, mengubah skema data produk, membangun halaman katalog/detail
  motor, fitur sales (WhatsApp CTA, simulasi kredit, form test ride), atau saat
  scraper gagal karena struktur situs Yamaha berubah.
---

# Yamaha Sales Website

Website katalog untuk sales Yamaha. Data produk diambil oleh scraper dari situs
resmi, disimpan sebagai JSON, lalu dirender statis oleh Next.js.

## Konteks wajib dibaca

| Kebutuhan | File |
|---|---|
| Selector HTML & JSON-LD situs sumber | [references/scraping-selectors.md](references/scraping-selectors.md) |
| Skema data produk (sumber kebenaran) | `docs/SKEMA-DATA.md` |
| Arsitektur & struktur folder | `docs/ARSITEKTUR.md` |
| Cara kerja & operasional scraper | `docs/SCRAPER.md` |

## Data dealer (default di `lib/config.ts`, bisa dioverride env)

| Item | Nilai |
|---|---|
| Nama sales | Syaiful Ramli |
| WhatsApp | 085111315521 → `6285111315521` (format `wa.me`) |
| Alamat | Jl. Raya Bekasi No.Km 18 No 49, RT.9/RW.11, Cakung, Kec. Pulo Gadung, Kota Jakarta Timur, DKI Jakarta 13930 |
| Wilayah harga | OTR Jakarta |

## Stack

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · scraper Node.js
(`fetch` + `cheerio` + `zod`) · data `data/products.json` + `data/overrides.json`
· GitHub Actions (cron) · deploy Vercel.

## Aturan keras (jangan dilanggar)

1. **Patuhi robots.txt** `https://www.yamaha-motor.co.id/robots.txt`.
   `/uploads/` di-*Disallow* → scraper **tidak boleh mengunduh** gambar dari
   `/uploads/`; cukup simpan URL absolutnya. Keputusan proyek: gambar
   **di-hotlink** dengan tag `<img src="https://www.yamaha-motor.co.id/uploads/...">`
   (dimuat browser pengunjung). **Jangan** pakai `next/image` untuk gambar ini
   (optimizer server akan mengunduhnya) — gunakan `<img loading="lazy">` biasa.
2. **Rate limit**: concurrency 1, jeda ≥ 1500 ms, retry maks 3 dengan backoff,
   User-Agent jujur: `PersadaMotorBot/1.0 (+kontak@domain-dealer)`.
3. **Tidak pernah scrape saat runtime** (request pengunjung). Scrape hanya via
   `npm run scrape` / cron.
4. **Jangan timpa data bagus dengan data rusak**: jika validasi `zod` gagal,
   atau jumlah produk < 80% run sebelumnya → exit code ≠ 0, `products.json`
   lama dipertahankan.
5. Harga dari sumber adalah **OTR Jakarta**. Harga daerah/promo hanya lewat
   `data/overrides.json`, jangan edit `products.json` manual.
6. Selalu tampilkan disclaimer sumber & “harga dapat berubah” di halaman produk.

## Workflow: membangun / memperbaiki scraper

1. Ambil daftar URL dari `https://www.yamaha-motor.co.id/products-sitemap.xml`
   (`<loc>` berisi `/product/<slug>/`). Fallback: halaman
   `/products/category/<kategori>/` → link `a[href*="/product/"]`.
2. Untuk tiap URL: fetch HTML → simpan mentah ke `.cache/html/<slug>.html`.
3. Parse dengan urutan prioritas:
   1. **JSON-LD** (`script[type="application/ld+json"]`): `ProductGroup`
      (nama, deskripsi), `BreadcrumbList` (kategori = posisi 3), `FAQPage`.
   2. **HTML blocks** untuk data yang tidak ada di JSON-LD (warna, harga per
      varian, fitur, spesifikasi, aksesoris) — lihat selector di referensi.
   3. **Open Graph** (`og:title`, `og:image`, `og:description`) sebagai fallback.
4. Normalisasi: trim whitespace, harga `"Rp 29.145.000"` → `29145000`
   (hapus semua non-digit), URL relatif → absolut, slug dari URL.
5. Validasi dengan schema `zod` (lihat `docs/SKEMA-DATA.md`).
6. Tulis `data/products.json` (urut berdasarkan kategori lalu nama) +
   `data/scrape-report.json` (jumlah produk, warning per produk, durasi).

## Workflow: saat scraper rusak (struktur situs berubah)

1. Jalankan `npm run scrape -- --only=<slug> --verbose`.
2. Buka `.cache/html/<slug>.html`, cari teks yang diketahui (mis. nama warna,
   “Tipe Mesin”, “Rp ”) untuk menemukan class baru.
3. Perbarui selector di `scraper/selectors.ts` **dan**
   `references/scraping-selectors.md` (sertakan tanggal verifikasi).
4. Tambahkan/refresh fixture di `scraper/__fixtures__/` dan jalankan
   `npm test`.

## Workflow: fitur website

- Katalog `/motor`: filter kategori dari `product.category`, urut harga min varian.
- Detail `/motor/[slug]`: `generateStaticParams` dari `products.json`; pemilih
  varian → warna; tampilkan harga varian terpilih; tabel spesifikasi per grup
  (Mesin, Rangka, Dimensi, Kelistrikan).
- WhatsApp CTA: `https://wa.me/<NOMOR>?text=<encodeURIComponent(pesan)>`,
  pesan berisi nama motor + varian + warna terpilih. Nomor dari env
  `NEXT_PUBLIC_WA_NUMBER`.
- Simulasi kredit: input harga (default harga varian), DP (%/nominal), tenor
  (11/17/23/29/35 bulan), bunga flat dari env/config; tampilkan disclaimer
  “estimasi, bukan penawaran leasing resmi”.
- Form lead/test ride: Server Action → Google Sheets / email; validasi `zod`,
  honeypot anti-spam.
- SEO: `generateMetadata` per produk, JSON-LD `Product` + `Offer` (priceCurrency
  `IDR`), `LocalBusiness` untuk dealer, `app/sitemap.ts`.

## Checklist selesai

- [ ] `npm run scrape` → ±28 produk, 0 error validasi
- [ ] `npm test` (parser fixtures) lulus
- [ ] `npm run build` sukses tanpa warning tipe
- [ ] Halaman detail tampil benar di mobile (varian, warna, harga, spek)
- [ ] Tidak ada request crawler ke `/uploads/`

