"use client";

import { useState } from "react";
import type { SiteProduct } from "../../lib/products";
import { formatRupiah } from "../../lib/format";
import { siteConfig, waLink } from "../../lib/config";
import { Calculator, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Props {
  products: SiteProduct[];
}

export function CreditCalculatorClient({ products }: Props) {
  // Motor yang dipilih
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Varian terpilih
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const selectedVariant = selectedProduct.variants[selectedVariantIdx] || selectedProduct.variants[0];

  // Harga dasar OTR
  const motorPrice = selectedVariant.price || selectedProduct.priceFrom || 25000000;

  // DP Persen (default 20%)
  const [dpPercent, setDpPercent] = useState(20);
  const dpAmount = Math.round((motorPrice * dpPercent) / 100);
  const loanPrincipal = motorPrice - dpAmount;

  // Hitungan tenor
  const calculations = siteConfig.creditTenors.map((months) => {
    const totalInterest = loanPrincipal * siteConfig.creditFlatRate * months;
    const totalLoan = loanPrincipal + totalInterest;
    const monthlyInstallment = Math.round(totalLoan / months);
    return { months, monthlyInstallment };
  });

  const [chosenTenor, setChosenTenor] = useState(35);
  const currentCalc = calculations.find((c) => c.months === chosenTenor) || calculations[calculations.length - 1];

  const waSimulasiMessage = `Halo Pak Syaiful, saya sudah mencoba simulasi kredit di website Persada Motor dengan rincian berikut:\n- Motor: ${selectedProduct.name} (${selectedVariant.name})\n- Harga OTR: ${formatRupiah(motorPrice)}\n- DP (${dpPercent}%): ${formatRupiah(dpAmount)}\n- Tenor Pilihan: ${currentCalc.months} Bulan\n- Estimasi Angsuran: ${formatRupiah(currentCalc.monthlyInstallment)} / bulan\nApakah ada promo DP minim atau cashback diskon untuk unit ini?`;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
      {/* Step 1: Pilih Motor & Varian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            1. Pilih Motor Yamaha:
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setSelectedVariantIdx(0);
            }}
            className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Mulai {formatRupiah(p.priceFrom)})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            2. Pilih Varian:
          </label>
          <select
            value={selectedVariantIdx}
            onChange={(e) => setSelectedVariantIdx(Number(e.target.value))}
            className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-hidden cursor-pointer"
          >
            {selectedProduct.variants.map((v, idx) => (
              <option key={v.name} value={idx}>
                {v.name} - {formatRupiah(v.price)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ringkasan Motor Terpilih */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200 gap-4">
        <div>
          <span className="text-xs text-slate-500 block">Unit Terpilih:</span>
          <span className="text-lg font-black text-slate-900">
            {selectedProduct.name} &bull; {selectedVariant.name}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Harga OTR Jakarta:</span>
          <span className="text-xl font-extrabold text-red-600">{formatRupiah(motorPrice)}</span>
        </div>
      </div>

      {/* Step 2: Slider DP */}
      <div className="p-6 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Tentukan Uang Muka (DP):
          </label>
          <span className="text-xl font-black text-slate-900">
            {dpPercent}% &bull; {formatRupiah(dpAmount)}
          </span>
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

        <div className="flex justify-between text-xs text-slate-500">
          <span>Min. 10% ({formatRupiah(motorPrice * 0.1)})</span>
          <span>Maks. 50% ({formatRupiah(motorPrice * 0.5)})</span>
        </div>
      </div>

      {/* Step 3: Pilihan Tenor & Hasil Angsuran */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          4. Pilih Jangka Waktu (Tenor):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {calculations.map((calc) => (
            <button
              key={calc.months}
              type="button"
              onClick={() => setChosenTenor(calc.months)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                chosenTenor === calc.months
                  ? "border-red-600 bg-red-50/60 ring-2 ring-red-600 ring-offset-1"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-bold text-slate-600 block">{calc.months} Bulan</span>
              <span className="text-base font-extrabold text-red-600 block mt-1">
                {formatRupiah(calc.monthlyInstallment)}
              </span>
              <span className="text-[10px] text-slate-400">/ bulan</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hasil Akhir & CTA WhatsApp */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-emerald-400 font-semibold block uppercase tracking-wider mb-1">
            Hasil Estimasi Cicilan Anda
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white">
              {formatRupiah(currentCalc.monthlyInstallment)}
            </span>
            <span className="text-slate-400 text-sm">/ bulan ({currentCalc.months}x)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            DP: {formatRupiah(dpAmount)} ({dpPercent}%) &bull; Pokok Pinjaman: {formatRupiah(loanPrincipal)}
          </p>
        </div>

        <a
          href={waLink(waSimulasiMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Ajukan Simulasi Ini via WhatsApp</span>
        </a>
      </div>

      <div className="flex items-start gap-2.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          Perhitungan simulasi kredit ini merupakan estimasi indikatif. Suku bunga dan angsuran final dapat bervariasi tergantung program promo leasing rekanan (BAF, OTO, Adira, Mandiri Utama Finance, dll.) dan riwayat kredit nasabah saat survei.
        </p>
      </div>
    </div>
  );
}

