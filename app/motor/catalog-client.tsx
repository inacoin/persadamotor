"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { SiteProduct } from "../../lib/products";
import { ProductCard } from "../../components/product-card";
import { CATEGORIES, type Category } from "../../lib/schema";
import { CATEGORY_LABELS } from "../../lib/format";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

interface MotorCatalogClientProps {
  products: SiteProduct[];
}

export function MotorCatalogClient({ products }: MotorCatalogClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("kategori") as Category | null;

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Filter kategori
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }
        // Filter pencarian teks
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchVariant = p.variants.some((v) => v.name.toLowerCase().includes(q));
          if (!matchName && !matchVariant) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.priceFrom ?? 0) - (b.priceFrom ?? 0);
        }
        if (sortBy === "price-desc") {
          return (b.priceFrom ?? 0) - (a.priceFrom ?? 0);
        }
        if (sortBy === "name") {
          return a.name.localeCompare(b.name, "id");
        }
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories = ["all", ...CATEGORIES];

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Sort */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama motor (misal: NMAX, Filano)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xs font-semibold text-slate-500">
            Menampilkan <strong className="text-slate-900">{filteredProducts.length}</strong> unit
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              aria-label="Urutkan Produk"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-red-600 cursor-pointer"
            >
              <option value="default">Urutan Standar</option>
              <option value="price-asc">Harga: Termurah</option>
              <option value="price-desc">Harga: Termahal</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const label = cat === "all" ? "Semua Kategori" : CATEGORY_LABELS[cat] || cat;
          const count =
            cat === "all"
              ? products.length
              : products.filter((p) => p.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-red-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid Produk */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto">
          <p className="text-base font-bold text-slate-800 mb-2">Motor tidak ditemukan</p>
          <p className="text-xs text-slate-500 mb-6">
            Tidak ada motor dengan filter &ldquo;{searchQuery || selectedCategory}&rdquo;. Silakan reset pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSortBy("default");
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      )}
    </div>
  );
}

