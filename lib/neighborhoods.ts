import type { Neighborhood } from "@/lib/types";

// Curated starting points keep the first local-discovery release useful before
// every city has a complete neighborhood dataset in Supabase.
export const neighborhoods: Neighborhood[] = [
  { id: "mashhad-ahmadabad", citySlug: "mashhad", name: "احمدآباد", slug: "ahmadabad", centerLat: 36.2975, centerLng: 59.6042 },
  { id: "mashhad-sajjad", citySlug: "mashhad", name: "سجاد", slug: "sajjad", centerLat: 36.3167, centerLng: 59.5668 },
  { id: "mashhad-ferdowsi", citySlug: "mashhad", name: "فردوسی", slug: "ferdowsi", centerLat: 36.3377, centerLng: 59.5395 },
  { id: "mashhad-hashemieh", citySlug: "mashhad", name: "هاشمیه", slug: "hashemieh", centerLat: 36.2676, centerLng: 59.5678 },
  { id: "mashhad-vakilabad", citySlug: "mashhad", name: "وکیل‌آباد", slug: "vakilabad", centerLat: 36.2891, centerLng: 59.5224 },
  { id: "mashhad-kowsar", citySlug: "mashhad", name: "کوهسنگی", slug: "kowsar", centerLat: 36.2783, centerLng: 59.5745 },
  { id: "mashhad-golshahr", citySlug: "mashhad", name: "گلشهر", slug: "golshahr", centerLat: 36.3543, centerLng: 59.5302 },
  { id: "mashhad-torqabeh", citySlug: "mashhad", name: "طرقبه", slug: "torqabeh", centerLat: 36.3072, centerLng: 59.3697 },
  { id: "tehran-vanak", citySlug: "tehran", name: "ونک", slug: "vanak", centerLat: 35.7577, centerLng: 51.4101 },
  { id: "tehran-tajrish", citySlug: "tehran", name: "تجریش", slug: "tajrish", centerLat: 35.8058, centerLng: 51.4282 },
  { id: "tehran-saadatabad", citySlug: "tehran", name: "سعادت‌آباد", slug: "saadatabad", centerLat: 35.7851, centerLng: 51.3705 },
  { id: "tehran-sadeghieh", citySlug: "tehran", name: "صادقیه", slug: "sadeghieh", centerLat: 35.7187, centerLng: 51.3372 },
  { id: "tehran-ekbatan", citySlug: "tehran", name: "اکباتان", slug: "ekbatan", centerLat: 35.6993, centerLng: 51.3047 },
  { id: "isfahan-central", citySlug: "isfahan", name: "مرکز شهر", slug: "central", centerLat: 32.6546, centerLng: 51.6680 },
  { id: "shiraz-central", citySlug: "shiraz", name: "مرکز شهر", slug: "central", centerLat: 29.5918, centerLng: 52.5837 },
  { id: "tabriz-central", citySlug: "tabriz", name: "مرکز شهر", slug: "central", centerLat: 38.0962, centerLng: 46.2738 },
  { id: "karaj-central", citySlug: "karaj", name: "مرکز شهر", slug: "central", centerLat: 35.8400, centerLng: 50.9391 },
];

export function getNeighborhoods(citySlug?: string): Neighborhood[] {
  return neighborhoods.filter((item) => item.citySlug === citySlug);
}

export function getNeighborhoodBySlug(citySlug?: string, slug?: string): Neighborhood | null {
  if (!citySlug || !slug) return null;
  return neighborhoods.find((item) => item.citySlug === citySlug && item.slug === slug) || null;
}
