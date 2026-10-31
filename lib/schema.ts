import { z } from "zod";

/**
 * Skema data produk — sumber kebenaran untuk scraper & aplikasi.
 * Dokumentasi: docs/SKEMA-DATA.md (harus sinkron dengan file ini).
 */

export const CATEGORIES = ["matic", "maxi", "classy", "sport", "moped", "off-road"] as const;
export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

export const ColorSchema = z.object({
  name: z.string().min(1),
  hex: z.string(),
  /** URL asli di server Yamaha (hotlink, tidak diunduh) */
  image: z.string().optional(),
});

export const VariantSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().positive().nullable(),
  priceLabel: z.string(),
  colors: z.array(ColorSchema),
});

export const FeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  image: z.string().optional(),
});

export const SpecGroupSchema = z.object({
  group: z.string().min(1),
  items: z.array(z.object({ label: z.string().min(1), value: z.string() })),
});

export const AccessorySchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative().nullable(),
  priceLabel: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
});

export const FaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const ProductSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  sourceSlug: z.string().min(1),
  sourceUrl: z.string().min(1),
  name: z.string().min(1),
  category: CategorySchema,
  description: z.string().optional(),
  featuredImage: z.string().optional(),
  variants: z.array(VariantSchema).min(1),
  features: z.array(FeatureSchema),
  specs: z.array(SpecGroupSchema),
  accessories: z.array(AccessorySchema),
  faq: z.array(FaqSchema),
  priceFrom: z.number().int().positive().nullable(),
  scrapedAt: z.string(),
});

export const ProductsFileSchema = z.object({
  source: z.string(),
  scrapedAt: z.string(),
  count: z.number().int(),
  products: z.array(ProductSchema),
});

export const OverridesSchema = z.object({
  defaults: z
    .object({
      priceRegionLabel: z.string().optional(),
      priceAdjustment: z.number().optional(),
    })
    .optional(),
  products: z
    .record(
      z.string(),
      z.object({
        hidden: z.boolean().optional(),
        featured: z.boolean().optional(),
        badge: z.string().optional(),
        variantPrices: z.record(z.string(), z.number()).optional(),
        images: z.record(z.string(), z.string()).optional(),
      }),
    )
    .optional(),
});

export type Color = z.infer<typeof ColorSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type Feature = z.infer<typeof FeatureSchema>;
export type SpecGroup = z.infer<typeof SpecGroupSchema>;
export type Accessory = z.infer<typeof AccessorySchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductsFile = z.infer<typeof ProductsFileSchema>;
export type Overrides = z.infer<typeof OverridesSchema>;

