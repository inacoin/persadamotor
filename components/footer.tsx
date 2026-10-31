import Link from "next/link";
import { siteConfig, waLink } from "../lib/config";
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Dealer Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-black text-white text-base">
                Y
              </div>
              <span className="text-xl font-bold text-white">{siteConfig.dealerName}</span>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Dealer & Sales Resmi Sepeda Motor Yamaha melayani area Jakarta, Bekasi, Depok, Tangerang, dan sekitarnya.
              Proses kredit cepat, syarat mudah, dan DP bersahabat.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Unit Resmi & Bergaransi YIMM</span>
            </div>
          </div>

          {/* Col 2: Kategori Motor */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kategori Motor
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/motor?kategori=maxi" className="hover:text-white transition">
                  MAXi Yamaha (NMAX, Aerox, XMAX)
                </Link>
              </li>
              <li>
                <Link href="/motor?kategori=classy" className="hover:text-white transition">
                  Classy Yamaha (Grand Filano, Fazzio)
                </Link>
              </li>
              <li>
                <Link href="/motor?kategori=matic" className="hover:text-white transition">
                  Matic Praktis (Gear, FreeGo, Mio)
                </Link>
              </li>
              <li>
                <Link href="/motor?kategori=sport" className="hover:text-white transition">
                  Sport (R15, R25, MT-15, XSR 155)
                </Link>
              </li>
              <li>
                <Link href="/motor?kategori=off-road" className="hover:text-white transition">
                  Off-Road (WR155R, YZ Series)
                </Link>
              </li>
              <li>
                <Link href="/motor?kategori=moped" className="hover:text-white transition">
                  Moped Bebek (MX King, Jupiter Z1)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan & Fitur */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Layanan Konsumen
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/simulasi-kredit" className="hover:text-white transition">
                  Kalkulator Simulasi Kredit
                </Link>
              </li>
              <li>
                <Link href="/test-ride" className="hover:text-white transition">
                  Jadwalkan Test Ride
                </Link>
              </li>
              <li>
                <a
                  href={waLink("Halo Pak Syaiful, saya ingin cek promo diskon / DP murah bulan ini.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <span>Promo & Diskon Bulan Ini</span>
                </a>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition">
                  Lokasi Dealer & Maps
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Sales */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak Sales Resmi
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed text-slate-400">
                  {siteConfig.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs text-slate-400 block">WhatsApp Sales ({siteConfig.salesName}):</span>
                  <a
                    href={waLink("Halo Pak Syaiful, saya ingin tanya ketersediaan unit Yamaha.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-400 hover:underline"
                  >
                    {siteConfig.waDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>Senin - Sabtu: 08:00 - 17:00 | Chat WA 24 Jam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 text-xs text-slate-500 space-y-2">
          <p>
            <strong>Disclaimer:</strong> Website ini dikelola secara independen oleh sales dealer resmi Yamaha ({siteConfig.salesName} &bull; {siteConfig.dealerName}). Data spesifikasi, varian warna, dan rekomendasi harga bersumber langsung dari situs resmi PT Yamaha Indonesia Motor Manufacturing (yamaha-motor.co.id). Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya mengikuti kebijakan ATPM dan leasing.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 text-slate-600">
            <p>&copy; {new Date().getFullYear()} {siteConfig.dealerName}. All rights reserved.</p>
            <p>Yamaha, logo garputala, serta nama model motor adalah hak milik Yamaha Motor Co., Ltd.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

