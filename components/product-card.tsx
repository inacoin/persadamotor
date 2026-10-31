"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteProduct } from "../lib/products";
import { formatRupiah, CATEGORY_LABELS } from "../lib/format";
import { siteConfig, waLink } from "../lib/config";
import { MessageCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: SiteProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  // Kumpulkan semua warna yang tersedia dari semua varian
  const allColors = product.variants.flatMap((v) =>
    v.colors.map((c) => ({
      ...c,
      variantName: v.name,
    }))
  );

  // Ambil gambar pertama atau featuredImage
  const initialImage =
    allColors.find((c) => c.image)?.image || product.featuredImage || "/placeholder-motor.svg";
  const [activeImage, setActiveImage] = useState<string>(initialImage);
  const [activeColorName, setActiveColorName] = useState<string>(allColors[0]?.name || "");

  const categoryName = CATEGORY_LABELS[product.category] || product.category;

  const waMessage = `Halo Pak Syaiful, saya ingin tanya informasi promo, DP, dan stok untuk unit *${product.name}* (Warna: ${activeColorName || "Pilihan"}).`;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Gambar Motor */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-900 text-white shadow-sm">
            {categoryName}
          </span>
          {product.badge && (
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-red-600 text-white shadow-sm">
              {product.badge}
            </span>
          )}
        </div>

        {/* Gambar asli dari server Yamaha (hotlink lazy load) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={`${product.name} ${activeColorName}`}
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Jika gambar gagal dimuat, fallback ke featuredImage jika beda
            if (activeImage !== product.featuredImage && product.featuredImage) {
              setActiveImage(product.featuredImage);
            }
          }}
        />

        {/* Hover quick label warna */}
        {activeColorName && (
          <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-medium text-slate-700 px-2 py-0.5 rounded shadow-xs">
            {activeColorName}
          </div>
        )}
      </div>

      {/* Konten Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Swatches Warna */}
          {allColors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Warna:</span>
              {allColors.slice(0, 6).map((c, idx) => (
                <button
                  key={`${c.name}-${idx}`}
                  type="button"
                  title={`${c.name} (${c.variantName})`}
                  onClick={() => {
                    if (c.image) setActiveImage(c.image);
                    setActiveColorName(c.name);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    activeColorName === c.name
                      ? "ring-2 ring-red-600 ring-offset-1 scale-110 border-slate-900"
                      : "border-slate-300 hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.hex || "#94a3b8" }}
                />
              ))}
              {allColors.length > 6 && (
                <span className="text-[10px] text-slate-400 font-medium">
                  +{allColors.length - 6}
                </span>
              )}
            </div>
          )}

          {/* Nama Motor */}
          <Link href={`/motor/${product.id}`} className="block group-hover:text-red-600 transition">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Varian Info */}
          <p className="text-xs text-slate-500 mt-1 mb-3">
            Tersedia {product.variants.length} Varian &bull; {allColors.length} Pilihan Warna
          </p>

          {/* Harga OTR */}
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Harga Rekomendasi ({siteConfig.priceRegion})
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-semibold text-slate-500">Mulai</span>
              <span className="text-xl font-extrabold text-red-600 tracking-tight">
                {formatRupiah(product.priceFrom)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/motor/${product.id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition active:scale-95"
          >
            <span>Detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat WA</span>
          </a>
        </div>
      </div>
    </article>
  );
}
