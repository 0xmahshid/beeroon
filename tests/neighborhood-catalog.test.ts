import { describe, expect, it, vi } from "vitest";

vi.mock("../lib/supabase", () => ({ supabase: {} }));

import { neighborhoodCatalog } from "../lib/neighborhood-catalog";
import { getNeighborhoodsSync } from "../lib/neighborhoods";
import { seedCities } from "../lib/cities";

describe("the supplied neighborhood catalog", () => {
  it("includes all 300 named areas from the 30-city document", () => {
    expect(neighborhoodCatalog).toHaveLength(300);
    expect(new Set(neighborhoodCatalog.map((item) => item.citySlug)).size).toBe(30);
    const available = getNeighborhoodsSync();
    for (const item of neighborhoodCatalog) {
      expect(available.some((neighborhood) => neighborhood.citySlug === item.citySlug && neighborhood.name === item.name)).toBe(true);
    }
  });

  it("keeps unknown coordinates empty and includes the missing Hamedan city", () => {
    const pounak = getNeighborhoodsSync("tehran").find((item) => item.name === "پونک");
    expect(pounak).toMatchObject({ centerLat: null, centerLng: null });
    expect(seedCities.some((city) => city.id === "hamadan" && city.active)).toBe(true);
  });
});
