export const RANKING_WEIGHTS = {
  relevance: 0.4,
  distance: 0.25,
  openNow: 0.12,
  profileCompleteness: 0.1,
  verified: 0.08,
  freshness: 0.05,
} as const;

export type RankingSignals = {
  relevance: number;
  distanceKm?: number;
  distanceMaxKm?: number;
  openNow: boolean;
  profileCompleteness: number;
  verified: boolean;
  updatedDaysAgo?: number;
  staleDays?: number;
};

function clamp(value: number, min = 0, max = 1): number {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}

function normalizeDistance(distanceKm?: number, distanceMaxKm = 8): number {
  if (distanceKm == null || !Number.isFinite(distanceKm)) return 0.3;
  if (distanceKm <= 0) return 1;
  if (distanceKm >= distanceMaxKm) return 0;
  return 1 - distanceKm / distanceMaxKm;
}

function normalizeFreshness(updatedDaysAgo?: number, staleDays = 180): number {
  if (updatedDaysAgo == null || !Number.isFinite(updatedDaysAgo)) return 0.5;
  if (updatedDaysAgo <= 7) return 1;
  if (updatedDaysAgo >= staleDays) return 0;
  return 1 - (updatedDaysAgo - 7) / (staleDays - 7);
}

export function computeScore(signals: RankingSignals): number {
  const w = RANKING_WEIGHTS;
  const distanceScore = normalizeDistance(signals.distanceKm, signals.distanceMaxKm);
  const freshnessScore = normalizeFreshness(signals.updatedDaysAgo, signals.staleDays);
  const base =
    w.relevance * clamp(signals.relevance) +
    w.distance * distanceScore +
    w.openNow * (signals.openNow ? 1 : 0) +
    w.profileCompleteness * clamp(signals.profileCompleteness) +
    w.verified * (signals.verified ? 1 : 0) +
    w.freshness * freshnessScore;
  return clamp(base, 0, 1);
}

export type SortMode = "relevance" | "distance" | "newest";

export function sortBusinesses<T extends { score?: number; distanceKm?: number; updatedAt?: string }>(list: T[], mode: SortMode = "relevance"): T[] {
  const copy = [...list];
  if (mode === "distance") {
    return copy.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
  }
  if (mode === "newest") {
    return copy.sort((a, b) => +new Date(b.updatedAt || 0) - +new Date(a.updatedAt || 0));
  }
  return copy.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
