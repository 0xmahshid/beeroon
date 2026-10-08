import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { from } = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: { from } }));

function createQuery(rows: Record<string, unknown>[]) {
  const query: any = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    then: (resolve: (value: unknown) => unknown, reject: (error: unknown) => unknown) =>
      Promise.resolve({ data: rows, error: null }).then(resolve, reject),
  };
  return query;
}

describe("Supabase neighborhoods", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    from.mockReset();
  });

  it("loads rows using the database city_id column and maps it to the app city slug", async () => {
    const query = createQuery([
      {
        id: "db-neighborhood-1",
        city_id: "tehran",
        name: "ونک",
        slug: "vanak",
        center_lat: 35.7577,
        center_lng: 51.4101,
        active: true,
      },
    ]);
    from.mockReturnValue(query);

    const { getNeighborhoods } = await import("../lib/neighborhoods");
    const neighborhoods = await getNeighborhoods("tehran");

    expect(from).toHaveBeenCalledWith("neighborhoods");
    expect(query.eq).toHaveBeenCalledWith("active", true);
    expect(query.eq).toHaveBeenCalledWith("city_id", "tehran");
    expect(neighborhoods[0]).toEqual({
      id: "db-neighborhood-1",
      citySlug: "tehran",
      name: "ونک",
      slug: "vanak",
      centerLat: 35.7577,
      centerLng: 51.4101,
    });
  });

  it("returns null for an ambiguous neighborhood slug when no city is selected", async () => {
    const query = createQuery([]);
    from.mockReturnValue(query);

    const { getNeighborhoodBySlug } = await import("../lib/neighborhoods");
    await expect(getNeighborhoodBySlug(undefined, "central")).resolves.toBeNull();
  });
});
