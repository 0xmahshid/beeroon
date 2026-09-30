import { describe, it, expect } from "vitest";
import { computeScore, RANKING_WEIGHTS } from "../lib/ranking";

describe("ranking score", () => {
  it("adds weights up to ~1 for all perfect signals", () => {
    const perfect = computeScore({
      relevance: 1,
      distanceKm: 0,
      openNow: true,
      profileCompleteness: 1,
      verified: true,
      updatedDaysAgo: 0,
    });
    expect(perfect).toBeGreaterThan(0.95);
    expect(perfect).toBeLessThanOrEqual(1);
  });

  it("returns a low score for zero signals", () => {
    const zero = computeScore({
      relevance: 0,
      openNow: false,
      profileCompleteness: 0,
      verified: false,
      distanceKm: 100,
      updatedDaysAgo: 1000,
    });
    expect(zero).toBeLessThan(0.2);
  });

  it("weights sum matches plan", () => {
    const total = Object.values(RANKING_WEIGHTS).reduce((sum, w) => sum + w, 0);
    expect(total).toBeCloseTo(1, 4);
  });

  it("close businesses score higher than far ones", () => {
    const near = computeScore({ relevance: 0.8, distanceKm: 0.5, openNow: true, profileCompleteness: 0.8, verified: true, updatedDaysAgo: 30 });
    const far = computeScore({ relevance: 0.8, distanceKm: 7, openNow: true, profileCompleteness: 0.8, verified: true, updatedDaysAgo: 30 });
    expect(near).toBeGreaterThan(far);
  });

  it("open beats closed even with same otherwise", () => {
    const open = computeScore({ relevance: 0.7, distanceKm: 2, openNow: true, profileCompleteness: 0.7, verified: false });
    const closed = computeScore({ relevance: 0.7, distanceKm: 2, openNow: false, profileCompleteness: 0.7, verified: false });
    expect(open).toBeGreaterThan(closed);
  });
});
