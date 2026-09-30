import { describe, it, expect } from "vitest";
import { computeOpenStatus, isOpenNow, formatOpenStatus, normalizeHours } from "../lib/business-hours";

describe("business hours open/closed", () => {
  it("no hours string -> no_hours", () => {
    expect(computeOpenStatus(null).kind).toBe("no_hours");
    expect(computeOpenStatus("").kind).toBe("no_hours");
    expect(isOpenNow(null)).toBeNull();
  });

  it("detects 24-hour strings", () => {
    const status = computeOpenStatus("۲۴ ساعته");
    expect(status.kind).toBe("open_24");
    expect(formatOpenStatus(status)).toContain("۲۴ ساعته");
  });

  it("detects explicit closed/تعطیل strings", () => {
    expect(computeOpenStatus("تعطیل").kind).toBe("closed_today");
    expect(computeOpenStatus("closed").kind).toBe("closed_today");
    expect(computeOpenStatus("بسته").kind).toBe("closed_today");
  });

  it("formatOpenStatus produces persian text for all status kinds", () => {
    expect(typeof formatOpenStatus({ kind: "no_hours" })).toBe("string");
    expect(typeof formatOpenStatus({ kind: "closed_today" })).toBe("string");
    expect(typeof formatOpenStatus({ kind: "open_24" })).toBe("string");
    expect(typeof formatOpenStatus({ kind: "open_until", until: "18:00" })).toBe("string");
    expect(typeof formatOpenStatus({ kind: "closed_opening_at", at: "09:00" })).toBe("string");
  });

  it("normalizeHours parses HH:MM into start/end ranges and detects 24h and closed", () => {
    const range = normalizeHours("9:00 تا 18:00");
    expect(range.type).toBe("range");
    if (range.type === "range") {
      expect(range.start).toBe("09:00");
      expect(range.end).toBe("18:00");
    }
    expect(normalizeHours("24 ساعته").type).toBe("always_open");
    expect(normalizeHours("تعطیل").type).toBe("always_closed");
    expect(normalizeHours(undefined).type).toBe("unknown");
    expect(normalizeHours("").type).toBe("unknown");
  });

  it("computeOpenStatus returns one of known kinds for typical inputs", () => {
    const kinds = new Set(["no_hours", "open_24", "closed_today", "open_until", "closed_opening_at"]);
    expect(kinds.has(computeOpenStatus("9:00 تا 18:00").kind)).toBe(true);
    expect(kinds.has(computeOpenStatus("۲۴ ساعته").kind)).toBe(true);
    expect(kinds.has(computeOpenStatus("تعطیل").kind)).toBe(true);
    expect(kinds.has(computeOpenStatus(null).kind)).toBe(true);
  });
});
