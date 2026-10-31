/** Data dealer & sales. Nilai default bisa dioverride lewat environment variable. */
const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback;

export const siteConfig = {
  siteUrl: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  dealerName: env("NEXT_PUBLIC_DEALER_NAME", "Persada Motor"),
  salesName: env("NEXT_PUBLIC_SALES_NAME", "Syaiful Ramli"),
  /** Format internasional tanpa "+" untuk wa.me */
  waNumber: env("NEXT_PUBLIC_WA_NUMBER", "6285111315521"),
  waDisplay: env("NEXT_PUBLIC_WA_DISPLAY", "0851-1131-5521"),
  address: env(
    "NEXT_PUBLIC_DEALER_ADDRESS",
    "Jl. Raya Bekasi No.Km 18 No 49, RT.9/RW.11, Cakung, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13930",
  ),
  mapsQuery: env("NEXT_PUBLIC_MAPS_QUERY", "Jl. Raya Bekasi Km 18 No 49 Cakung Pulo Gadung Jakarta Timur 13930"),
  priceRegion: "OTR Jakarta",
  /** Bunga flat per bulan untuk simulasi kredit (estimasi) */
  creditFlatRate: Number(env("NEXT_PUBLIC_CREDIT_FLAT_RATE", "0.0145")),
  creditTenors: [11, 17, 23, 29, 35],
  sourceUrl: "https://www.yamaha-motor.co.id/",
};

export function waLink(message: string): string {
  return `https://wa.me/${siteConfig.waNumber}?text=${encodeURIComponent(message)}`;
}

