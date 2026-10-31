# Persada Motor — Website Sales Yamaha

Website katalog & penjualan motor Yamaha untuk sales/dealer **Persada Motor**.
Data produk (varian, harga OTR, warna, fitur, spesifikasi, aksesoris) diambil
otomatis dari situs resmi [yamaha-motor.co.id](https://www.yamaha-motor.co.id/)
menggunakan scraper terjadwal.

> Status: **Selesai Diimplementasikan & Teruji (Production Ready)**

| Kontak Sales | |
|---|---|
| Nama | Syaiful Ramli |
| WhatsApp | [0851-1131-5521](https://wa.me/6285111315521) |
| Alamat | Jl. Raya Bekasi No.Km 18 No 49, RT.9/RW.11, Cakung, Kec. Pulo Gadung, Kota Jakarta Timur, DKI Jakarta 13930 |

Gambar produk ditampilkan langsung dari server Yamaha (hotlink), tidak diunduh/disimpan sesuai aturan `robots.txt`.

## Status Scraper & Database
- 28/28 model motor Yamaha Indonesia berhasil di-scrape dan divalidasi ke `data/products.json`
- 37 halaman statis (SSG) berhasil di-compile oleh Next.js 16
- Pengujian unit test vitest parser lulus (3/3 passed)
- Otomasi GitHub Actions scraper mingguan siap di `.github/workflows/scrape.yml`

## Dokumentasi

| Dokumen | Isi |
|---|---|
| [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) | Arsitektur, stack, struktur folder, alur data |
| [docs/SCRAPER.md](docs/SCRAPER.md) | Cara kerja scraper, perintah, etika, troubleshooting |
| [docs/SKEMA-DATA.md](docs/SKEMA-DATA.md) | Skema `products.json` & `overrides.json` |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Environment variable, deploy Vercel, cron GitHub Actions |
| [.agents/skills/yamaha-sales-website](.agents/skills/yamaha-sales-website/SKILL.md) | Skill untuk AI agent (Antigravity) |

## Fitur

- Katalog motor per kategori (Matic, Maxi, Classy, Sport, Moped, Off-Road)
- Detail motor: pilihan varian & warna, harga OTR, fitur, spesifikasi, aksesoris, FAQ
- Tombol WhatsApp ke sales dengan pesan otomatis
- Simulasi kredit (DP, tenor, estimasi angsuran)
- Form booking test ride / minta penawaran
- Bandingkan 2–3 motor
- SEO: metadata, JSON-LD, sitemap

## Quick Start (setelah kode dibuat)

```bash
npm install
cp .env.example .env.local     # isi nomor WA, nama dealer, dll.
npm run scrape                 # ambil data terbaru → data/products.json
npm run dev                    # http://localhost:3000
```

| Script | Fungsi |
|---|---|
| `npm run dev` | Server development |
| `npm run scrape` | Scrape semua produk |
| `npm run scrape -- --only=nmax-turbo --verbose` | Scrape satu produk (debug) |
| `npm test` | Unit test parser (fixture HTML) |
| `npm run build` | Build produksi (SSG) |

## Disclaimer

Data produk bersumber dari yamaha-motor.co.id dan dapat berubah sewaktu-waktu.
Merek & logo Yamaha milik Yamaha Motor Co., Ltd. / PT Yamaha Indonesia Motor
Manufacturing. Penggunaan gambar produk mengikuti izin dari dealer/YIMM.

