import { Suspense } from "react";
import { getAllProducts } from "../../lib/products";
import { MotorCatalogClient } from "./catalog-client";

export const metadata = {
  title: "Katalog Sepeda Motor Yamaha Lengkap & Harga OTR Terbaru",
  description: "Daftar lengkap harga OTR motor Yamaha: MAXi Series (NMAX, Aerox, XMAX), Classy (Grand Filano, Fazzio), Matic, Sport, Moped, dan Off-Road.",
};

export default function MotorPage() {
  const products = getAllProducts();

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            Daftar Lengkap 28 Unit
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Katalog Sepeda Motor Yamaha
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            Pilih model, varian warna, dan cek spesifikasi lengkap. Hubungi sales untuk ketersediaan unit dan diskon khusus.
          </p>
        </div>

        <Suspense fallback={<div className="py-20 text-center text-slate-500">Memuat katalog...</div>}>
          <MotorCatalogClient products={products} />
        </Suspense>
      </div>
    </div>
  );
}

