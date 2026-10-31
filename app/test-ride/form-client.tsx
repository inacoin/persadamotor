"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { SiteProduct } from "../../lib/products";
import { siteConfig, waLink } from "../../lib/config";
import { MessageCircle, CheckCircle, Calendar, MapPin, User, Phone, ShieldCheck } from "lucide-react";

interface Props {
  products: SiteProduct[];
}

export function TestRideFormClient({ products }: Props) {
  const searchParams = useSearchParams();
  const initialMotor = searchParams.get("motor") || products[0]?.id || "";

  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [selectedMotor, setSelectedMotor] = useState(initialMotor);
  const [location, setLocation] = useState("");
  const [plan, setPlan] = useState<"Kredit" | "Cash">("Kredit");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  const motorObj = products.find((p) => p.id === selectedMotor) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text =
      `*FORM BOOKING TEST RIDE / KONSULTASI PEMBELIAN*\n` +
      `-------------------------------------------\n` +
      `Nama: ${name}\n` +
      `No. WhatsApp: ${wa}\n` +
      `Unit Diminati: ${motorObj.name}\n` +
      `Domisili: ${location || "Jakarta"}\n` +
      `Rencana Pembelian: ${plan}\n` +
      `Rencana Tanggal: ${preferredDate || "Secepatnya"}\n` +
      (notes ? `Catatan: ${notes}\n` : "") +
      `-------------------------------------------\n` +
      `Halo Pak Syaiful, mohon informasi ketersediaan unit untuk test ride & info promo terbarunya. Terima kasih.`;

    window.open(waLink(text), "_blank");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Nomor WhatsApp / HP <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="Contoh: 08123456789"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Pilihan Motor Yamaha <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedMotor}
            onChange={(e) => setSelectedMotor(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-red-600 focus:outline-hidden cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Rencana Pembelian
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPlan("Kredit")}
              className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                plan === "Kredit"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Kredit (Cicilan)
            </button>
            <button
              type="button"
              onClick={() => setPlan("Cash")}
              className={`py-3 px-4 rounded-xl text-xs font-bold border transition ${
                plan === "Cash"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Cash (Tunai)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Area Domisili Anda
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Cakung, Pulo Gadung, Bekasi, dll"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Rencana Tanggal Test Ride / Survey
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Catatan Tambahan (Opsional)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tanyakan hal spesifik, misal: warna tertentu, simulasi DP 2 juta, dll."
          className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-red-600 focus:outline-hidden"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-900/20 transition active:scale-95"
      >
        <MessageCircle className="w-5 h-5" />
        <span>Kirim Booking via WhatsApp ke {siteConfig.salesName}</span>
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Data Anda terjamin aman &bull; Langsung ditangani Sales Konsultan Resmi</span>
      </div>
    </form>
  );
}

