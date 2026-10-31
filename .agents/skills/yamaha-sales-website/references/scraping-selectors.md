# Selector Scraping yamaha-motor.co.id

> Terakhir diverifikasi: **31 Oktober 2026** (halaman contoh: `/product/grand-filano/`).
> Situs server-rendered; `cheerio` cukup, tidak perlu Playwright.
> Jika ada selector yang tidak cocok lagi, perbarui file ini + `scraper/selectors.ts`.

## Sumber URL

| Sumber | URL | Catatan |
|---|---|---|
| Sitemap produk | `/products-sitemap.xml` | `<loc>` → `/product/<slug>/` (28 URL saat verifikasi) |
| Kategori | `/products/category/{matic,maxi-yamaha,classy,sport,moped,off-road}/` | Fallback; link `a[href*="/product/"]` |
| robots.txt | `/robots.txt` | `Disallow: /uploads/`, `/career/` |

Slug sitemap bisa campur huruf besar (mis. `all-new-R15-connected`) → simpan slug
asli untuk fetch, buat `id` lowercase untuk route website.

## JSON-LD (prioritas utama)

Selector: `script[type="application/ld+json"]` → `JSON.parse` tiap blok, pilih berdasarkan `@type`.

| `@type` | Field yang dipakai |
|---|---|
| `ProductGroup` | `name`, `description`, `url`, `aggregateRating` (opsional), `hasVariant` (jika ada) |
| `BreadcrumbList` | `itemListElement[2].name` = kategori (mis. "Classy"), `item` = URL kategori |
| `FAQPage` | `mainEntity[].name` (pertanyaan), `acceptedAnswer.text` (jawaban) |
| `Organization` | abaikan |

## Open Graph (fallback)

`meta[property="og:title"]`, `og:description`, `og:image` (featured image, di `/uploads/products/featured_image/`).

## Blok HTML

### Warna & harga per varian — `sec2-*`

```html
<div class="sec2-color-select" id="sec2-select">
  <div class="sec2-color-div active" id="sec2-div0-0"
       style="background-color: #bfd4f0;" data-no="0" data-src="Royal Iron"></div>
  ...
</div>
<p class="sec2-color-tag2">Royal Iron</p>      <!-- warna aktif -->
<p class="sec2-color-tag3">Hybrid Lux</p>      <!-- nama varian -->
<p class="sec2-color-tag3">Rp 29.145.000</p>   <!-- harga varian -->
<p class="sec2-color-tag4">Harga Rekomendasi OTR Jakarta</p>
<img class="sec2-swiper-img" src="/uploads/products/new_product_model_image/....png">
```

| Data | Selector | Parsing |
|---|---|---|
| Swatch warna | `.sec2-color-div` | nama = `data-src`, hex = regex `background-color:\s*(#[0-9a-f]{3,6})` dari `style` |
| Indeks varian/warna | atribut `id="sec2-div{V}-{C}"` | V = indeks varian, C = indeks warna |
| Nama varian | `.sec2-color-tag3` ke-1 dalam blok | trim |
| Harga varian | `.sec2-color-tag3` yang diawali `Rp` | `parseInt(text.replace(/\D/g,''))` |
| Label harga | `.sec2-color-tag4` | mis. "Harga Rekomendasi OTR Jakarta" |
| Gambar per warna | `.sec2-swiper-img[src]` | urutan sejajar dengan swatch; **simpan URL saja** |

> [!NOTE]
> Satu halaman bisa memiliki beberapa blok varian. Kelompokkan swatch berdasarkan
> `V` dari id, lalu ambil tag3 terdekat (parent container yang sama). Harga di
> FAQ JSON-LD bisa berbeda dari blok sec2 (beda tanggal update) — **blok sec2 lebih
> diutamakan**, FAQ hanya fallback.

### Fitur — `sec3-*`

| Data | Selector |
|---|---|
| Item | `.sec3-swiper-div` |
| Judul | `.sec3-swiper-title` |
| Deskripsi | `.sec3-swiper-txt` |
| Gambar | `.sec3-swiper-img[src]` (`/uploads/products/overview/`) |

### Spesifikasi — `sec4-*`

```html
<p class="sec4-title-txt">Mesin</p>
<div class="sec4-coll collapse row" id="collapse-1">
  <table class="sec4-table"><tbody>
    <tr><td class="sec4-td1">Tipe Mesin</td><td class="sec4-td2">:</td>
        <td class="sec4-td3">Pendingin Udara, 4-Langkah, SOHC</td></tr>
```

| Data | Selector |
|---|---|
| Nama grup | `.sec4-title-txt` (Mesin, Rangka, Dimensi, Kelistrikan) |
| Tabel grup | `.sec4-coll` berikutnya setelah judul (`id="collapse-N"`) |
| Baris | `tr` → label `.sec4-td1`, nilai `.sec4-td3` |

### Aksesoris terkait — `sec7-*`

| Data | Selector | Parsing |
|---|---|---|
| Item | `.sec7-col` | |
| Nama | `.sec7-txt1` | trim |
| Harga | `.sec7-txt2` | format `Rp 570,000` (koma!) → hapus non-digit |
| Label | `.sec7-txt3` | "HED (Harga Eceran yang Disarankan)" |
| Link | `a.sec7-img-a[href]` | relatif → absolut |
| Gambar | `.sec7-img[src]` | `/uploads/sparepart/` — URL saja |

## Normalisasi umum

- Semua teks: `.text().replace(/\s+/g, ' ').trim()`.
- URL: `new URL(src, 'https://www.yamaha-motor.co.id').href` (perhatikan spasi di path → encode).
- Abaikan gambar dari `/web_new/` (ikon UI situs).

