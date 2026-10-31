import { describe, expect, it } from "vitest";
import { parseProduct, parsePrice } from "../parse-product";
import { ProductSchema } from "../../lib/schema";

const SAMPLE_FILANO_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="Yamaha Grand Filano Hybrid" />
  <meta property="og:image" content="https://www.yamaha-motor.co.id/uploads/products/featured_image/filano.png" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "name": "Yamaha Grand Filano Hybrid",
    "description": "Yamaha Grand Filano Hybrid Classy 125cc"
  }
  </script>
</head>
<body>
  <h1 class="product-title">Yamaha Grand Filano</h1>
  <section id="section2">
    <div class="sec2-version active"><p class="sec2-version-txt">Hybrid Lux</p></div>
    <div class="sec2-div">
      <div class="sec2-color-select">
        <div class="sec2-color-div" style="background-color: #bfd4f0;" data-no="0" data-src="Royal Iron"></div>
      </div>
      <img class="sec2-swiper-img" src="/uploads/products/new_product_model_image/filano-iron.png" />
      <p class="sec2-color-tag3">Hybrid Lux</p>
      <p class="sec2-color-tag3">Rp 29.145.000</p>
      <p class="sec2-color-tag4">Harga Rekomendasi OTR Jakarta</p>
    </div>
  </section>
  <section id="section3">
    <div class="sec3-swiper-div">
      <p class="sec3-swiper-title">TFT Sub Display</p>
      <p class="sec3-swiper-txt">Animasi welcome message dan speedometer modern.</p>
    </div>
  </section>
  <section id="section4">
    <p class="sec4-title-txt">Mesin</p>
    <div class="sec4-coll">
      <table class="sec4-table">
        <tr>
          <td class="sec4-td1">Tipe Mesin</td>
          <td class="sec4-td2">:</td>
          <td class="sec4-td3">Pendingin Udara, 4-Langkah, SOHC</td>
        </tr>
      </table>
    </div>
  </section>
</body>
</html>
`;

describe("Scraper Parser", () => {
  it("parsePrice handles different formats", () => {
    expect(parsePrice("Rp 29.145.000")).toBe(29145000);
    expect(parsePrice("Rp 570,000")).toBe(570000);
    expect(parsePrice("Rp. 31.500.000,-")).toBe(31500000);
    expect(parsePrice("TBA")).toBeNull();
  });

  it("parses sample product correctly", () => {
    const { product } = parseProduct(
      SAMPLE_FILANO_HTML,
      "grand-filano",
      "https://www.yamaha-motor.co.id/product/grand-filano/",
      "2026-10-31T00:00:00Z"
    );

    expect(product.name).toContain("Grand Filano");
    expect(product.category).toBe("classy");
    expect(product.variants?.length).toBe(1);
    expect(product.variants?.[0].price).toBe(29145000);
    expect(product.priceFrom).toBe(29145000);

    const parsed = ProductSchema.safeParse(product);
    expect(parsed.success).toBe(true);
  });
});
