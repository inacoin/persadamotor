const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export function formatRupiah(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "Hubungi sales";
  return rupiah.format(value).replace(/\u00a0/g, " ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export const CATEGORY_LABELS: Record<string, string> = {
  matic: "Matic",
  maxi: "Maxi",
  classy: "Classy",
  sport: "Sport",
  moped: "Moped",
  "off-road": "Off-Road",
};

