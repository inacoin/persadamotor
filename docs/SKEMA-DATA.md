# Skema Data

Sumber kebenaran tipe ada di `lib/schema.ts` (zod). Dokumen ini harus sinkron dengan file tersebut.

## `data/products.json`

```jsonc
{
  "source": "https://www.yamaha-motor.co.id/",
  "scrapedAt": "2026-10-31T19:00:00+07:00",
  "count": 28,
  "products": [ /* Product[] */ ]
}
```

### Product

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `id` | string | ✔ | slug lowercase, untuk route `/motor/[id]` |
| `sourceSlug` | string | ✔ | slug asli di situs (bisa huruf besar) |
| `sourceUrl` | string (URL) | ✔ | |
| `name` | string | ✔ | mis. "Yamaha Grand Filano Hybrid" |
| `category` | enum | ✔ | `matic` \| `maxi` \| `classy` \| `sport` \| `moped` \| `off-road` |
| `description` | string | | dari JSON-LD / og:description |
| `featuredImage` | string (URL) | | og:image |
| `variants` | Variant[] | ✔ (≥1) | |
| `features` | Feature[] | | |
| `specs` | SpecGroup[] | | |
| `accessories` | Accessory[] | | |
| `faq` | Faq[] | | |
| `priceFrom` | number | ✔ | harga varian termurah (dihitung) |
| `scrapedAt` | string (ISO) | ✔ | |

### Variant

| Field | Tipe | Keterangan |
|---|---|---|
| `name` | string | mis. "Hybrid Lux" |
| `price` | number \| null | Rupiah, mis. `29145000` |
| `priceLabel` | string | mis. "Harga Rekomendasi OTR Jakarta" |
| `colors` | Color[] | |

### Color

| Field | Tipe | Keterangan |
|---|---|---|
| `name` | string | mis. "Royal Iron" |
| `hex` | string | mis. `#bfd4f0` |
| `image` | string (URL) | URL sumber (tidak diunduh) |

### Feature · SpecGroup · Accessory · Faq

```ts
type Feature    = { title: string; description: string; image?: string };
type SpecGroup  = { group: string; items: { label: string; value: string }[] }; // Mesin, Rangka, Dimensi, Kelistrikan
type Accessory  = { name: string; price: number | null; priceLabel?: string; url?: string; image?: string };
type Faq        = { question: string; answer: string };
```

### Contoh (dipersingkat)

```json
{
  "id": "grand-filano",
  "sourceSlug": "grand-filano",
  "sourceUrl": "https://www.yamaha-motor.co.id/product/grand-filano/",
  "name": "Yamaha Grand Filano Hybrid",
  "category": "classy",
  "priceFrom": 28665000,
  "variants": [
    {
      "name": "Hybrid Lux",
      "price": 29145000,
      "priceLabel": "Harga Rekomendasi OTR Jakarta",
      "colors": [
        { "name": "Royal Iron", "hex": "#bfd4f0", "image": "https://www.yamaha-motor.co.id/uploads/products/new_product_model_image/202601231028034876K13777.png" },
        { "name": "Magma Black", "hex": "#2c2324", "image": "https://www.yamaha-motor.co.id/uploads/products/new_product_model_image/2026012310455516358M58371.png" }
      ]
    }
  ],
  "specs": [
    { "group": "Mesin", "items": [
      { "label": "Tipe Mesin", "value": "Pendingin Udara, 4-Langkah, SOHC" },
      { "label": "Diameter x Langkah", "value": "52,4 x 57,9 mm" },
      { "label": "Perbandingan Kompresi", "value": "11,0 : 1" }
    ]}
  ],
  "features": [
    { "title": "USB Socket", "description": "Komunikasi yang selalu terhubung melalui fitur pengisian daya pada gadget pengendara." }
  ],
  "accessories": [
    { "name": "REAR SPORT RACK", "price": 570000, "priceLabel": "HED (Harga Eceran yang Disarankan)", "url": "https://www.yamaha-motor.co.id/part-accessories/accessories/rear-sport-rack/" }
  ],
  "scrapedAt": "2026-10-31T19:00:00+07:00"
}
```

## `data/overrides.json`

Diedit manual oleh admin/sales. Di-merge di atas `products.json` saat build.

```jsonc
{
  "defaults": {
    "priceRegionLabel": "OTR Jakarta",   // ganti mis. "OTR Bekasi"
    "priceAdjustment": 0                  // selisih Rupiah ke semua harga (opsional)
  },
  "products": {
    "grand-filano": {
      "hidden": false,
      "featured": true,                   // tampil di beranda
      "badge": "Promo DP 1 Juta",
      "variantPrices": { "Hybrid Lux": 29500000 },  // override harga daerah
      "images": { "Royal Iron": "/images/products/grand-filano/royal-iron.webp" },
      "pin": false                        // tetap tampil walau hilang dari sitemap
    }
  }
}
```

Aturan merge: nilai di `overrides` **selalu menang**; field yang tidak disebut tetap dari hasil scrape.

