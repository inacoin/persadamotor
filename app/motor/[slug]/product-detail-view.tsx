"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteProduct } from "../../../lib/products";
import { formatRupiah, CATEGORY_LABELS } from "../../../lib/format";
import { siteConfig, waLink } from "../../../lib/config";
import { ProductCard } from "../../../components/product-card";
import { AutoScrollCarousel } from "../../../components/auto-scroll-carousel";
import {
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileText,
  Sliders,
  CheckCircle2,
  Calendar,
  Sparkles,
  Wrench,
  Cpu,
} from "lucide-react";

interface ProductDetailViewProps {
  product: SiteProduct;
  related: SiteProduct[];
}

export function ProductDetailView({ product, related }: ProductDetailViewProps) {
  // State Varian aktif
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];

  // State Warna aktif di varian tersebut
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const activeColor = activeVariant.colors[selectedColorIdx] || activeVariant.colors[0];

  // Gambar yang sedang tampil
  const currentImage =
    activeColor?.image ||
    activeVariant.colors.find((c) => c.image)?.image ||
    product.featuredImage ||
    "";

  // Tab spek aktif
  const [activeSpecTab, setActiveSpecTab] = useState(0);

  // State FAQ yang sedang terbuka (default index 0)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Perhitungan simulasi kredit mini
  const motorPrice = activeVariant.price || product.priceFrom || 25000000;
  const [dpPercent, setDpPercent] = useState(20);
  const dpAmount = Math.round((motorPrice * dpPercent) / 100);
  const loanPrincipal = motorPrice - dpAmount;

  // Perhitungan cicilan untuk tiap tenor (bunga flat per bulan)
  const tenorCalculations = siteConfig.creditTenors.map((months) => {
    const totalInterest = loanPrincipal * siteConfig.creditFlatRate * months;
    const totalLoan = loanPrincipal + totalInterest;
    const monthlyInstallment = Math.round(totalLoan / months);
    return { months, monthlyInstallment };
  });

  const waDetailMessage = `Halo Pak Syaiful, saya tertarik dengan *${product.name}*:\n- Varian: ${activeVariant.name}\n- Warna: ${activeColor?.name || "Semua Warna"}\n- Harga OTR: ${formatRupiah(activeVariant.price)}\nMohon info diskon, promo DP minim, dan ketersediaan stoknya. Terima kasih.`;

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-slate-900 transition">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/motor" className="hover:text-slate-900 transition">
            Katalog Motor
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link
            href={`/motor?kategori=${product.category}`}
            className="hover:text-slate-900 transition"
          >
            {CATEGORY_LABELS[product.category] || product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{product.name}</span>
        </nav>

        {/* SECTION 1: HEADER & MOTOR CUSTOMIZER (GALLERY, VARIANTS, COLORS, PRICE, CTA) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          {/* SISI KIRI: DISPLAY GAMBAR MOTOR */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-6 flex items-center justify-center border border-slate-100">
              {/* Category & Badge */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white">
                  {CATEGORY_LABELS[product.category]}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-600 text-white">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Tag Warna Terpilih */}
              {activeColor?.name && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 px-3 py-1 rounded-full border border-slate-200 shadow-xs flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-slate-400"
                    style={{ backgroundColor: activeColor.hex || "#333" }}
                  />
                  <span>{activeColor.name}</span>
                </div>
              )}

              {/* Gambar Motor Hotlink (Server Yamaha) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage}
                alt={`${product.name} ${activeVariant.name} ${activeColor?.name || ""}`}
                loading="eager"
                className="w-full h-full object-contain drop-shadow-md transition-all duration-300"
              />
            </div>

            {/* Disclaimer Hotlink */}
            <p className="text-[11px] text-slate-400 text-center mt-3">
              *Tampilan warna unit resmi ATPM PT Yamaha Indonesia Motor Manufacturing.
            </p>
          </div>

          {/* SISI KANAN: PILIHAN VARIAN, WARNA, HARGA & WA ACTION */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                {product.description && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Pemilih Varian */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  1. Pilih Tipe Varian:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.name}
                      onClick={() => {
                        setSelectedVariantIdx(idx);
                        setSelectedColorIdx(0); // reset ke warna pertama varian baru
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedVariantIdx === idx
                          ? "bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pemilih Warna */}
              {activeVariant.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Pilihan Warna ({activeColor?.name}):
                    </label>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {activeVariant.colors.map((c, idx) => (
                      <button
                        key={`${c.name}-${idx}`}
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedColorIdx === idx
                            ? "border-red-600 bg-red-50 text-red-950 ring-2 ring-red-600 ring-offset-1 font-bold"
                            : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: c.hex || "#94a3b8" }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Kotak Harga OTR Terpilih */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {activeVariant.priceLabel || `Harga Rekomendasi ${siteConfig.priceRegion}`}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                    {formatRupiah(activeVariant.price)}
                  </span>
                  <span className="text-xs text-slate-500">OTR</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Termasuk STNK &amp; BPKB wilayah DKI Jakarta.
                </p>
              </div>
            </div>

            {/* Tombol Aksi Sales */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <a
                href={waLink(waDetailMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-base text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi &amp; Ajukan Pembelian via WA</span>
              </a>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={`/test-ride?motor=${product.id}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Booking Test Ride</span>
                </Link>
                <a
                  href="#simulasi-kredit"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                >
                  <Sliders className="w-3.5 h-3.5 text-red-600" />
                  <span>Hitung Simulasi Cicilan</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dikelola oleh Sales Konsultan Resmi: <strong>{siteConfig.salesName}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SIMULASI KREDIT INTERAKTIF UNTUK MOTOR INI */}
        <section id="simulasi-kredit" className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
              Perhitungan Angsuran &bull; {activeVariant.name}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Simulasi Kredit {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Harga acuan OTR: <strong>{formatRupiah(motorPrice)}</strong>. Sesuaikan DP Anda di bawah ini:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Input DP Slider */}
            <div className="md:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Uang Muka (DP): {dpPercent}%
                </label>
                <div className="text-2xl font-black text-slate-900">
                  {formatRupiah(dpAmount)}
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={dpPercent}
                onChange={(e) => setDpPercent(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Min. 10% ({formatRupiah(motorPrice * 0.1)})</span>
                <span>Maks. 50%</span>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Pokok Hutang:</span>
                  <span className="font-semibold text-slate-900">{formatRupiah(loanPrincipal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimasi Bunga:</span>
                  <span className="font-semibold text-slate-900">~1.45% Flat/Bulan</span>
                </div>
              </div>

              <a
                href={waLink(`Halo Pak Syaiful, saya mau nego DP ${formatRupiah(dpAmount)} untuk motor ${product.name} (${activeVariant.name}). Bisa dibantu hitungkan angsuran pastinya?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Nego DP Ini via WhatsApp</span>
              </a>
            </div>

            {/* Tabel Pilihan Tenor */}
            <div className="md:col-span-7">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Estimasi Angsuran Per Bulan Berdasarkan Tenor:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tenorCalculations.map((calc) => (
                  <div
                    key={calc.months}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-red-500 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-500 block">
                        {calc.months} Bulan
                      </span>
                      <span className="text-lg font-black text-red-600 block mt-1">
                        {formatRupiah(calc.monthlyInstallment)}
                      </span>
                      <span className="text-[10px] text-slate-400">/ bulan</span>
                    </div>

                    <a
                      href={waLink(`Halo Pak Syaiful, saya tertarik tenor *${calc.months} Bulan* (${formatRupiah(calc.monthlyInstallment)}/bln) dengan DP ${formatRupiah(dpAmount)} untuk ${product.name}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-[11px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>Pilih Tenor Ini</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                *Simulasi bersifat perkiraan/indikatif. Angsuran dan DP resmi mengikuti kebijakan lembaga pembiayaan (leasing) rekanan (Baf, Adira, OTO, WOM, dll) saat pengajuan.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: FITUR UNGGULAN MOTOR (AUTO-SCROLL KE SAMPING) */}
        {product.features.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                  Teknologi &amp; Kenyamanan
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Fitur Unggulan {product.name}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {product.features.length} Fitur Inovasi
              </span>
            </div>

            <AutoScrollCarousel intervalMs={3200}>
              {product.features.map((f, idx) => (
                <div
                  key={`${f.title}-${idx}`}
                  className="shrink-0 w-[280px] sm:w-[340px] md:w-[380px] snap-start rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition"
                >
                  {f.image ? (
                    <div className="aspect-[16/9] mb-4 bg-slate-200 rounded-xl overflow-hidden border border-slate-200/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.image}
                        alt={f.title}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] mb-4 bg-gradient-to-tr from-slate-800 to-blue-900 rounded-xl flex items-center justify-center text-white">
                      <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-start">
                    <h3 className="font-bold text-slate-900 text-base mb-1.5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{f.title}</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </AutoScrollCarousel>
          </section>
        )}

        {/* SECTION 4: SPESIFIKASI TEKNIS (TABS & TABEL SEPERTI SEMULA) */}
        {product.specs.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                  Data Teknis Lengkap
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Spesifikasi {product.name}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Pilih tab kategori untuk melihat rincian
              </span>
            </div>

            {/* Spec Group Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 mb-6 scrollbar-none">
              {product.specs.map((group, idx) => (
                <button
                  key={group.group}
                  onClick={() => setActiveSpecTab(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeSpecTab === idx
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {group.group}
                </button>
              ))}
            </div>

            {/* Spec Table */}
            {product.specs[activeSpecTab] && (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {product.specs[activeSpecTab].items.map((item, idx) => (
                      <tr
                        key={`${item.label}-${idx}`}
                        className={idx % 2 === 0 ? "bg-white hover:bg-slate-50 transition" : "bg-slate-50/60 hover:bg-slate-50 transition"}
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-700 w-2/5 sm:w-1/3">
                          {item.label}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-medium">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* SECTION 5: AKSESORIS RESMI (AUTO-SCROLL KE SAMPING) */}
        {product.accessories.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                  Yamaha Genuine Accessories
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Aksesoris Resmi {product.name}
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {product.accessories.length} Aksesoris Tersedia
              </span>
            </div>

            <AutoScrollCarousel intervalMs={3000}>
              {product.accessories.map((acc, idx) => (
                <div
                  key={`${acc.name}-${idx}`}
                  className="shrink-0 w-[200px] sm:w-[240px] snap-start p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between hover:border-red-400 hover:shadow-md transition"
                >
                  {acc.image ? (
                    <div className="aspect-square mb-3 bg-white rounded-xl p-3 flex items-center justify-center border border-slate-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={acc.image}
                        alt={acc.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square mb-3 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                      <Wrench className="w-8 h-8" />
                    </div>
                  )}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug">
                        {acc.name}
                      </h3>
                      <p className="text-sm font-extrabold text-red-600 mt-1.5">
                        {formatRupiah(acc.price)}
                      </p>
                      {acc.priceLabel && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">{acc.priceLabel}</span>
                      )}
                    </div>

                    <a
                      href={waLink(`Halo Pak Syaiful, apakah aksesoris resmi *${acc.name}* untuk unit ${product.name} ready stok? Harganya ${formatRupiah(acc.price)}?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-200 text-[11px] font-bold text-emerald-700 shadow-2xs transition active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Tanya via WA</span>
                    </a>
                  </div>
                </div>
              ))}
            </AutoScrollCarousel>
          </section>
        )}

        {/* SECTION 6: FAQ RESMI YAMAHA (INTERAKTIF & MODERN ACCORDION) */}
        {product.faq.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                  Pusat Informasi &amp; Jawaban
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <HelpCircle className="w-7 h-7 text-red-600" />
                  <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
                {product.faq.length} Tanya Jawab Resmi
              </span>
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5">
              {product.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-red-500/50 bg-gradient-to-r from-red-50/30 to-slate-50 shadow-xs"
                        : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isOpen
                              ? "bg-red-600 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          Q{idx + 1}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight leading-snug">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-red-600" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 flex items-start gap-3">
                        <div className="w-7 flex justify-center shrink-0 text-red-600 font-extrabold text-sm pt-0.5">
                          A:
                        </div>
                        <p className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200/60 text-slate-700 shadow-2xs">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Banner Tanya Sales Langsung jika Masih Ada Pertanyaan */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  Masih ada pertanyaan seputar promo atau simulasi kredit {product.name}?
                </h4>
                <p className="text-xs text-slate-300">
                  Konsultasikan langsung dengan Sales Consultant kami tanpa komitmen.
                </p>
              </div>
              <a
                href={waLink(`Halo Pak Syaiful, saya mau tanya lebih lanjut mengenai unit Yamaha ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Syaiful Ramli via WA</span>
              </a>
            </div>
          </section>
        )}

        {/* SECTION 7: MOTOR TERKAIT / SEJENIS */}
        {related.length > 0 && (
          <section className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                Kategori {CATEGORY_LABELS[product.category]}
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Motor Yamaha Lainnya yang Mungkin Anda Suka
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

