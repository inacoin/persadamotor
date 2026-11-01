# Deployment & Otomasi

## Environment Variable (`.env.local` / Vercel)

| Variabel | Contoh | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://persadamotor.id` | URL kanonik untuk SEO |
| `NEXT_PUBLIC_DEALER_NAME` | `Persada Motor` | |
| `NEXT_PUBLIC_SALES_NAME` | `Syaiful Ramli` | |
| `NEXT_PUBLIC_WA_NUMBER` | `6289531674991` | format internasional tanpa `+` (0895-3167-4991) |
| `NEXT_PUBLIC_DEALER_ADDRESS` | `Jl. Raya Bekasi No.Km 18 No 49, RT.9/RW.11, Cakung, Kec. Pulo Gadung, Kota Jakarta Timur, DKI Jakarta 13930` | untuk halaman kontak & JSON-LD |
| `NEXT_PUBLIC_MAPS_EMBED_URL` | `https://www.google.com/maps/embed?...` | |
| `CREDIT_FLAT_RATE` | `0.0125` | bunga flat/bulan untuk simulasi (estimasi) |
| `GOOGLE_SHEETS_ID` | `1AbC...` | penyimpanan lead |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | `{...}` | **rahasia**, hanya server |
| `RESEND_API_KEY` | `re_...` | opsional, notifikasi email lead |
| `SCRAPER_CONTACT` | `kontak@persadamotor.id` | dipakai di User-Agent scraper |

Jangan commit `.env.local`. Sediakan `.env.example` tanpa nilai rahasia.

## Deploy ke Vercel

1. Push repo ke GitHub.
2. Vercel → *Add New Project* → import repo (framework terdeteksi Next.js).
3. Isi environment variable di atas.
4. Deploy. Setiap push ke `main` (termasuk commit data hasil scrape) memicu deploy ulang.
5. Tambahkan domain custom di *Settings → Domains*.

## Scrape Otomatis (GitHub Actions)

`.github/workflows/scrape.yml`:

```yaml
name: Scrape Yamaha products
on:
  schedule:
    - cron: "0 19 * * 0"   # Senin 02:00 WIB (Minggu 19:00 UTC)
  workflow_dispatch: {}
permissions:
  contents: write
jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run scrape
        env:
          SCRAPER_CONTACT: ${{ secrets.SCRAPER_CONTACT }}
      - name: Commit jika ada perubahan
        run: |
          git config user.name "scraper-bot"
          git config user.email "bot@users.noreply.github.com"
          git add data/
          git diff --cached --quiet || git commit -m "chore(data): update produk Yamaha $(date +%F)"
          git push
```

- Jika scrape gagal (validasi/jumlah produk turun), job merah → GitHub mengirim email ke pemilik repo; data lama tetap live.
- Jalankan manual dari tab *Actions → Run workflow* saat ada peluncuran motor baru.

## Checklist Go-Live

- [ ] Izin penggunaan gambar/merek dari dealer/YIMM sudah dikonfirmasi
- [ ] Nomor WhatsApp & alamat dealer benar
- [ ] Disclaimer harga & sumber tampil di halaman produk
- [ ] Form lead teruji masuk ke Google Sheets
- [ ] Lighthouse mobile ≥ 90, sitemap terdaftar di Google Search Console
- [ ] Workflow scrape berhasil minimal 1× dari `workflow_dispatch`

