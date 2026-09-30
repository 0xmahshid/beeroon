export type SortMode = "relevance" | "distance" | "newest";

export type Filters = {
  sort: SortMode;
  openNow: boolean;
  verifiedOnly: boolean;
  hasPhone: boolean;
  hasDirections: boolean;
  inPersonOnly: boolean;
  onlineOnly: boolean;
};

const DEFAULT: Filters = {
  sort: "relevance",
  openNow: false,
  verifiedOnly: false,
  hasPhone: false,
  hasDirections: false,
  inPersonOnly: false,
  onlineOnly: false,
};

export function parseFiltersFromUrl(params: URLSearchParams): Filters {
  return {
    sort: (params.get("sort") as SortMode) || DEFAULT.sort,
    openNow: params.get("open") === "1",
    verifiedOnly: params.get("verified") === "1",
    hasPhone: params.get("has_phone") === "1",
    hasDirections: params.get("has_dir") === "1",
    inPersonOnly: params.get("in_person") === "1",
    onlineOnly: params.get("online") === "1",
  };
}
