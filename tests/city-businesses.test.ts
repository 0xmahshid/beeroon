import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/supabase", () => ({ supabase: {} }));
afterEach(() => vi.unstubAllEnvs());

describe("city-wide business results", () => {
  it("returns approved businesses from the selected city without a neighborhood filter", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.resetModules();

    const { getBusinesses } = await import("../lib/data");
    const businesses = await getBusinesses({ citySlug: "mashhad" });

    expect(businesses.length).toBeGreaterThan(0);
    expect(businesses.every((business) => business.city_id === "mashhad")).toBe(true);
  });
});
