import { getAllProducts } from "../../lib/products";
import { CreditCalculatorClient } from "./calculator-client";

export const metadata = {
  title: "Simulasi Kredit Motor Yamaha - Hitung DP & Angsuran Bulanan",
  description: "Kalkulator simulasi kredit sepeda motor Yamaha terbaru OTR Jakarta. Hitung perkiraan uang muka (DP) dan cicilan bulanan untuk NMAX Turbo, Aerox, Grand Filano, dan lainnya.",
};

export default function SimulasiKreditPage() {
  const products = getAllProducts();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            Kalkulator Finansial
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Simulasi Kredit Sepeda Motor Yamaha
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Pilih motor yang Anda inginkan, tentukan besaran DP, dan dapatkan perkiraan cicilan bulanan yang sesuai dengan kemampuan anggaran Anda.
          </p>
        </div>

        <CreditCalculatorClient products={products} />
      </div>
    </div>
  );
}

