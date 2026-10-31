import { Suspense } from "react";
import { getAllProducts } from "../../lib/products";
import { TestRideFormClient } from "./form-client";

export const metadata = {
  title: "Booking Test Ride & Konsultasi Pembelian Sepeda Motor Yamaha",
  description: "Daftar uji kendara (test ride) sepeda motor Yamaha gratis bersama dealer resmi Persada Motor. Rasakan performa NMAX Turbo, Grand Filano, Aerox, dan lainnya.",
};

export default function TestRidePage() {
  const products = getAllProducts();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            Layanan Prioritas Sales
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Jadwalkan Test Ride &amp; Uji Kendara
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Ingin merasakan langsung kenyamanan, akselerasi, dan fitur canggih motor Yamaha sebelum membeli? Daftarkan jadwal Anda bersama sales konsultan kami.
          </p>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-slate-500">Memuat formulir...</div>}>
          <TestRideFormClient products={products} />
        </Suspense>
      </div>
    </div>
  );
}
