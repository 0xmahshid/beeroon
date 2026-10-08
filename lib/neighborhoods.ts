import { supabase } from "./supabase";
import { neighborhoodCatalog } from "./neighborhood-catalog";
import type { Neighborhood } from "@/lib/types";

export const seedNeighborhoods: Neighborhood[] = [
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

function normalizedName(name: string): string {
  return name.normalize("NFKC").replace(/[ك]/g, "ک").replace(/[يى]/g, "ی").replace(/[\u200c\s\-–—().,؛،]/g, "").toLowerCase();
}

function neighborhoodKey(citySlug: string, name: string): string {
  return citySlug + ":" + normalizedName(name);
}

const legacyNames = new Set(seedNeighborhoods.map((item) => neighborhoodKey(item.citySlug, item.name)));
const catalogFallback: Neighborhood[] = neighborhoodCatalog
  .filter((item) => !legacyNames.has(neighborhoodKey(item.citySlug, item.name)))
  .map((item) => ({
    id: item.citySlug + "-" + item.slug,
    citySlug: item.citySlug,
    name: item.name,
    slug: item.slug,
    centerLat: null,
    centerLng: null,
  }));
const fallbackNeighborhoods: Neighborhood[] = [...seedNeighborhoods, ...catalogFallback];

const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function remoteToNeighborhood(row: Record<string, unknown>): Neighborhood | null {
  const citySlug = typeof row.city_id === "string" ? row.city_id : typeof row.city_slug === "string" ? row.city_slug : typeof row.citySlug === "string" ? row.citySlug : undefined;
  const slug = typeof row.slug === "string" ? row.slug : undefined;
  const name = typeof row.name === "string" ? row.name : undefined;
  const id = typeof row.id === "string" ? row.id : citySlug && slug ? citySlug + "-" + slug : undefined;
  if (!id || !citySlug || !slug || !name) return null;
  const lat = typeof row.center_lat === "number" ? row.center_lat : typeof row.centerLat === "number" ? row.centerLat : null;
  const lng = typeof row.center_lng === "number" ? row.center_lng : typeof row.centerLng === "number" ? row.centerLng : null;
  return { id, citySlug, name, slug, centerLat: lat, centerLng: lng };
}

export async function getNeighborhoods(citySlug?: string): Promise<Neighborhood[]> {
  if (!configured) return getNeighborhoodsSync(citySlug);
  try {
    let query = supabase.from("neighborhoods").select("*").eq("active", true);
    if (citySlug) query = query.eq("city_id", citySlug);
    const { data, error } = await (citySlug
      ? query.order("name")
      : query.order("city_id").order("name"));
    const remote: Neighborhood[] = [];
    if (!error && Array.isArray(data)) {
      for (const row of data) {
        const n = remoteToNeighborhood(row as Record<string, unknown>);
        if (n) remote.push(n);
      }
    }
    const seedFallback = getNeighborhoodsSync(citySlug);
    const remoteKeys = new Set(remote.map((n) => n.citySlug + ":" + n.slug));
    const remoteNames = new Set(remote.map((n) => neighborhoodKey(n.citySlug, n.name)));
    return [...remote, ...seedFallback.filter((n) => !remoteKeys.has(n.citySlug + ":" + n.slug) && !remoteNames.has(neighborhoodKey(n.citySlug, n.name)))];
  } catch {
    return getNeighborhoodsSync(citySlug);
  }
}

export async function getNeighborhoodBySlug(citySlug?: string, slug?: string): Promise<Neighborhood | null> {
  if (!slug) return null;
  const list = await getNeighborhoods(citySlug);
  const matches = list.filter((item) => item.slug === slug && (!citySlug || item.citySlug === citySlug));
  return matches.length === 1 ? matches[0] : null;
}

export function getNeighborhoodsSync(citySlug?: string): Neighborhood[] {
  return citySlug ? fallbackNeighborhoods.filter((item) => item.citySlug === citySlug) : [...fallbackNeighborhoods];
}

export function getNeighborhoodBySlugSync(citySlug?: string, slug?: string): Neighborhood | null {
  if (!citySlug || !slug) return null;
  return fallbackNeighborhoods.find((item) => item.citySlug === citySlug && item.slug === slug) || null;
}
