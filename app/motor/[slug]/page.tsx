import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllProducts, getProduct, getRelatedProducts } from "../../../lib/products";
import { ProductDetailView } from "./product-detail-view";
import { siteConfig } from "../../../lib/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const title = `${product.name} - Spesifikasi, Pilihan Warna & Harga OTR`;
  const description =
    product.description ||
    `Lihat spesifikasi teknis, daftar harga OTR Jakarta, varian warna, dan simulasi kredit ${product.name} di ${siteConfig.dealerName}. Hubungi ${siteConfig.salesName} untuk promo terbaru.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.featuredImage ? [{ url: product.featuredImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 4);

  return <ProductDetailView product={product} related={related} />;
}

