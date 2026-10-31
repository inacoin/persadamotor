"use client";

import { siteConfig, waLink } from "../lib/config";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <aside aria-label="Kontak Cepat WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group">
      <div className="hidden sm:block bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl border border-slate-800 opacity-90 group-hover:opacity-100 transition">
        <p className="font-semibold text-emerald-400">Ada Pertanyaan?</p>
        <p className="text-slate-300">Konsultasi gratis dengan {siteConfig.salesName}</p>
      </div>
      <a
        href={waLink("Halo Pak Syaiful, saya ingin konsultasi motor Yamaha.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Sales"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
}

