"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig, waLink } from "../lib/config";
import { Menu, X, Phone, MessageCircle } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Dealer Info */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center font-black tracking-wider text-white text-xl shadow-md group-hover:bg-red-700 transition">
              Y
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white block">
                {siteConfig.dealerName}
              </span>
              <span className="text-xs text-red-400 font-medium block">
                Authorized Yamaha Dealer &bull; Sales
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            <Link href="/" className="text-slate-300 hover:text-white transition">
              Beranda
            </Link>
            <Link href="/motor" className="text-slate-300 hover:text-white transition">
              Katalog Motor
            </Link>
            <Link href="/simulasi-kredit" className="text-slate-300 hover:text-white transition">
              Simulasi Kredit
            </Link>
            <Link href="/test-ride" className="text-slate-300 hover:text-white transition">
              Booking Test Ride
            </Link>
            <Link href="/kontak" className="text-slate-300 hover:text-white transition">
              Kontak
            </Link>
          </nav>

          {/* CTA Sales Info */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Sales Executive:</span>
              <span className="text-sm font-semibold text-slate-100">{siteConfig.salesName}</span>
            </div>
            <a
              href={waLink("Halo Pak Syaiful, saya ingin konsultasi pembelian motor Yamaha.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{siteConfig.waDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Beranda
          </Link>
          <Link
            href="/motor"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Katalog Motor
          </Link>
          <Link
            href="/simulasi-kredit"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Simulasi Kredit
          </Link>
          <Link
            href="/test-ride"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Booking Test Ride
          </Link>
          <Link
            href="/kontak"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Kontak Dealer
          </Link>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2">Sales Konsultan: {siteConfig.salesName}</p>
            <a
              href={waLink("Halo Pak Syaiful, saya ingin konsultasi motor Yamaha.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition"
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp ({siteConfig.waDisplay})
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

