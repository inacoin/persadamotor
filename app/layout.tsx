import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { FloatingWhatsApp } from "../components/floating-whatsapp";
import { siteConfig } from "../lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.dealerName} - Dealer & Sales Resmi Motor Yamaha Jakarta`,
    template: `%s | ${siteConfig.dealerName}`,
  },
  description: `Website resmi sales sepeda motor Yamaha (${siteConfig.salesName} &bull; ${siteConfig.dealerName}). Informasi promo terbaru, daftar harga OTR Jakarta, spesifikasi, simulasi kredit, dan booking test ride motor Yamaha NMAX Turbo, Aerox, Grand Filano, Fazzio, R15, dll.`,
  keywords: [
    "Yamaha Motor",
    "Dealer Yamaha Jakarta",
    "Sales Yamaha Jakarta Timur",
    "Harga NMAX Turbo",
    "Harga Grand Filano",
    "Harga Aerox Alpha",
    "Kredit Motor Yamaha",
    "Persada Motor",
    "Syaiful Ramli Yamaha",
  ],
  authors: [{ name: siteConfig.salesName }],
  openGraph: {
    title: `${siteConfig.dealerName} - Dealer Resmi Sepeda Motor Yamaha`,
    description: `Dapatkan promo DP ringan dan angsuran terjangkau motor Yamaha bersama ${siteConfig.salesName}. Proses cepat, data dijemput.`,
    url: siteConfig.siteUrl,
    siteName: siteConfig.dealerName,
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.dealerName,
    description: `Dealer Resmi Sepeda Motor Yamaha - Sales Executive: ${siteConfig.salesName}`,
    url: siteConfig.siteUrl,
    telephone: siteConfig.waDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Bekasi No.Km 18 No 49, RT.9/RW.11, Cakung",
      addressLocality: "Jakarta Timur",
      addressRegion: "DKI Jakarta",
      postalCode: "13930",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -6.1866,
      longitude: 106.9067,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-red-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

