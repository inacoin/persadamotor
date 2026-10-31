import { siteConfig, waLink } from "../../lib/config";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Truck,
  FileCheck,
  CreditCard,
} from "lucide-react";

export const metadata = {
  title: "Kontak Dealer & Sales Yamaha Jakarta Timur - Syaiful Ramli",
  description: `Hubungi sales resmi motor Yamaha ${siteConfig.salesName} (${siteConfig.dealerName}). Alamat: Jl. Raya Bekasi Km 18 Cakung Jakarta Timur. WhatsApp: ${siteConfig.waDisplay}.`,
};

export default function KontakPage() {
  const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    siteConfig.address
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dealer &amp; Sales Resmi Yamaha
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Konsultasikan kebutuhan sepeda motor Yamaha Anda langsung dengan Sales Consultant resmi kami. Kami siap membantu proses dari awal hingga motor tiba di rumah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Card Profil Sales & Dealer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center font-black text-2xl text-white shadow-md">
                  SR
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{siteConfig.salesName}</h2>
                  <p className="text-xs font-semibold text-red-600">Sales Consultant</p>
                  <p className="text-xs text-slate-500">{siteConfig.dealerName}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Alamat Dealer:</span>
                    <p className="leading-relaxed text-slate-600 mt-0.5">{siteConfig.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">WhatsApp Sales:</span>
                    <a
                      href={waLink("Halo Pak Syaiful, saya ingin konsultasi motor Yamaha.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-extrabold text-base hover:underline"
                    >
                      {siteConfig.waDisplay}
                    </a>
                    <span className="text-[11px] text-slate-400 block">Respon cepat 24 jam</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Jam Operasional Dealer:</span>
                    <p className="text-slate-600">Senin - Sabtu: 08:00 - 17:00 WIB</p>
                    <p className="text-slate-600">Minggu / Tanggal Merah: Buka dengan Perjanjian</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={waLink(`Halo Pak Syaiful, saya ingin bertanya tentang pembelian motor Yamaha di ${siteConfig.dealerName}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Mulai Chat WhatsApp Sekarang</span>
                </a>
              </div>
            </div>

            {/* Keunggulan Membeli Melalui Sales Syaiful Ramli */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Keuntungan Membeli di Persada Motor:
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garansi Resmi 3 &amp; 5 Tahun Mesin Blue Core YIMM</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kerjasama dengan Leasing Terpercaya (BAF, OTO, Adira, dll)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Pengiriman Unit Gratis ke Rumah se-Jabodetabek</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Pengurusan STNK, BPKB, &amp; Plat Nomor Dijamin Cepat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sisi Kanan: Google Maps Embed */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col h-[520px]">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Peta Lokasi Dealer</h3>
                <p className="text-xs text-slate-500">Jl. Raya Bekasi Km 18 Cakung, Pulo Gadung, Jakarta Timur</p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  siteConfig.address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Buka di Google Maps &rarr;
              </a>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <iframe
                title="Peta Lokasi Persada Motor"
                src={mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

