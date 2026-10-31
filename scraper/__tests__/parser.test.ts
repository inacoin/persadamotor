import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { parseProduct, parsePrice } from "../parse-product";
import { ProductSchema } from "../../lib/schema";

describe("Scraper Parser", () => {
  it("parsePrice handles different formats", () => {
    expect(parsePrice("Rp 29.145.000")).toBe(29145000);
    expect(parsePrice("Rp 570,000")).toBe(570000);
    expect(parsePrice("Rp. 31.500.000,-")).toBe(31500000);
    expect(parsePrice("TBA")).toBeNull();
  });

  it("parses Grand Filano correctly", () => {
    const htmlPath = path.resolve(".cache/html/grand-filano.html");
    const html = readFileSync(htmlPath, "utf8");
    const { product, warnings } = parseProduct(html, "grand-filano", "https://www.yamaha-motor.co.id/product/grand-filano/", "2026-10-31T00:00:00Z");
    
    expect(product.name).toContain("Grand Filano");
    expect(product.category).toBe("classy");
    expect(product.variants?.length).toBeGreaterThanOrEqual(2);
    expect(product.priceFrom).toBeGreaterThan(20000000);

    const parsed = ProductSchema.safeParse(product);
    expect(parsed.success).toBe(true);
  });

  it("parses TMAX with correct Maxi category and TMAX name", () => {
    const htmlPath = path.resolve(".cache/html/tmax-tech-max.html");
    const html = readFileSync(htmlPath, "utf8");
    const { product } = parseProduct(html, "tmax-tech-max", "https://www.yamaha-motor.co.id/product/tmax-tech-max/", "2026-10-31T00:00:00Z");
    
    expect(product.name).toContain("TMAX");
    expect(product.category).toBe("maxi");

    const parsed = ProductSchema.safeParse(product);
    expect(parsed.success).toBe(true);
  });
});
