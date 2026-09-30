import type { Business } from "./types";

export type CompletenessFieldWeights = Partial<Record<keyof Business, number>>;

const DEFAULT_WEIGHTS: CompletenessFieldWeights = {
  name: 8,
  category_id: 6,
  subcategory_id: 4,
  address: 10,
  lat: 7,
  lng: 0,
  phone: 12,
  whatsapp: 4,
  hours: 8,
  image_url: 6,
  search_terms: 4,
  description: 8,
  instagram: 3,
  telegram: 2,
  website_url: 4,
  neighborhood_slug: 6,
};

function hasValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return Number.isFinite(value);
  return Boolean(value);
}

export function computeProfileCompleteness(business: Partial<Business> | null | undefined, weights: CompletenessFieldWeights = DEFAULT_WEIGHTS): number {
  if (!business) return 0;
  let total = 0;
  let scored = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (!weight) continue;
    total += weight;
    if (key === "lng" && hasValue(business.lat) && hasValue(business.lng)) {
      scored += weight;
      continue;
    }
    if (hasValue((business as Record<string, unknown>)[key])) scored += weight;
  }
  if (total <= 0) return 0;
  return scored / total;
}

export function daysSince(isoDate: string | null | undefined, now: Date = new Date()): number | undefined {
  if (!isoDate) return undefined;
  const then = new Date(isoDate).getTime();
  if (!Number.isFinite(then)) return undefined;
  return Math.floor((now.getTime() - then) / (24 * 60 * 60 * 1000));
}
