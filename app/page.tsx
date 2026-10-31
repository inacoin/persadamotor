import Link from "next/link";
import { getFeaturedProducts, getAllProducts } from "../lib/products";
import { ProductCard } from "../components/product-card";
import { siteConfig, waLink } from "../lib/config";
import {
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
  Calculator,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const allProducts = getAllProducts();

  const categories = [
    { id: "maxi", name: "MAXi Yamaha", desc: "NMAX Turbo, Aerox, XMAX, LEXi", count: allProducts.filter(p => p.category === "maxi").length },
    { id: "classy", name: "Classy Yamaha", desc: "Grand Filano & Fazzio Hybrid", count: allProducts.filter(p => p.category === "classy").length },
    { id: "matic", name: "Matic Praktis", desc: "Gear Ultima, FreeGo, Mio M3", count: allProducts.filter(p => p.category === "matic").length },
    { id: "sport", name: "Sport & Naked", desc: "R15, R25, MT-15, MT-25, XSR", count: allProducts.filter(p => p.category === "sport").length },
    { id: "off-road", name: "Off-Road Dual", desc: "WR155R & Seri YZ Competition", count: allProducts.filter(p => p.category === "off-road").length },
    { id: "moped", name: "Moped Bebek", desc: "MX King 150 & Jupiter Z1", count: allProducts.filter(p => p.category === "moped").length },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Teks Hero */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Promo Spesial OTR Jakarta &bull; Persada Motor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Miliki Motor Yamaha <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-red-400">
                  Impian Anda Hari Ini
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Layanan penjualan resmi sepeda motor Yamaha di Jakarta & Sekitarnya.
                Dapatkan promo diskon menarik, DP ringan, angsuran terjangkau, dan proses kredit super cepat bersama <strong>{siteConfig.salesName}</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href={waLink("Halo Pak Syaiful, saya ingin konsultasi promo dan simulasi kredit motor Yamaha.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40 transition active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat WhatsApp Sales</span>
                </a>
                <Link
                  href="/motor"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700 transition"
                >
                  <span>Lihat Katalog 28 Unit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/simulasi-kredit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition"
                >
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span>Simulasi Kredit</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Proses Cepat 1 Hari</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Garansi Resmi YIMM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">DP & Angsuran Ringan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-xs text-slate-300 font-medium">Data Dijemput ke Rumah</span>
                </div>
              </div>
            </div>

            {/* Sales Profile & Featured Motor Spotlight */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-700">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-md">
                    SR
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{siteConfig.salesName}</h2>
                    <p className="text-xs text-slate-300">Sales Consultant &bull; {siteConfig.dealerName}</p>
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Siap Melayani Konsultasi & Pengajuan
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                    <span className="text-slate-400">Area Layanan:</span>
                    <span className="font-semibold text-slate-200">Jakarta, Bekasi, Depok, Tangerang</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                    <span className="text-slate-400">WhatsApp / Telp:</span>
                    <span className="font-semibold text-emerald-400">{siteConfig.waDisplay}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-700/50">
                    <span className="text-slate-400">Metode Pembelian:</span>
                    <span className="font-semibold text-slate-200">Cash, Kredit Syariah & Konvensional</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Bonus Pembelian:</span>
                    <span className="font-semibold text-amber-300">Helm Yamaha, Jaket, Toolkit, Kupon Servis</span>
                  </div>
                </div>

                <a
                  href={waLink(`Halo Pak Syaiful, saya melihat website ${siteConfig.dealerName} dan ingin menanyakan promo motor Yamaha terbaru.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Hubungi Syaiful Ramli via WA
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI PILIHAN */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
                Jelajahi Berdasarkan Kategori
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pilih Tipe Motor Yamaha Anda
              </h2>
            </div>
            <Link
              href="/motor"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 group"
            >
              <span>Lihat semua produk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/motor?kategori=${cat.id}`}
                className="group p-4 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/80 hover:border-slate-800 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-white text-sm sm:text-base">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 group-hover:text-slate-400 mt-1 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-200 group-hover:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-red-600 group-hover:text-red-400">
                    {cat.count} Model
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUK UNGGULAN (BEST SELLERS) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
              Paling Populer & Diminati
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Motor Yamaha Pilihan Terbaik
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Model terlaris dengan inovasi mesin Blue Core, konektivitas Y-Connect, dan desain mutakhir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/motor"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <span>Buka Katalog Lengkap (28 Motor Yamaha)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER SIMULASI KREDIT & KONSULTASI */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
                Kemudahan Pembelian
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Mau Hitung Angsuran & DP Sesuai Budget Anda?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Gunakan kalkulator simulasi kredit online kami untuk melihat estimasi cicilan per bulan. Anda juga bisa langsung berdiskusi dengan <strong>{siteConfig.salesName}</strong> untuk promo DP minim dan diskon angsuran.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/simulasi-kredit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Buka Simulasi Kredit</span>
              </Link>
              <a
                href={waLink("Halo Pak Syaiful, saya ingin konsultasi perhitungan kredit motor Yamaha.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konsultasi Hitungan via WA</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

