import { describe, it, expect } from "vitest";
import { normalizePersian, normalizeSearch, normalizeDisplay, buildSearchText, tokenize, normalizePhone } from "../lib/persian";

describe("persian normalize", () => {
  it("arabic yeh and kaf convert to persian", () => {
    expect(normalizePersian("يک كاف")).toBe("یک کاف");
    expect(normalizePersian("بيبي")).toBe("بیبی");
  });

  it("zero-width chars collapse to single space", () => {
    expect(normalizePersian("شلوار\u200cاسب\u200dسواری")).toBe("شلوار اسب سواری");
  });

  it("extra whitespace trims and collapses", () => {
    expect(normalizePersian("  خیلی    فاصله   داریم   ")).toBe("خیلی فاصله داریم");
  });

  it("normalizeSearch lowercases, strips punctuation and converts digits to en", () => {
    expect(normalizeSearch("شلوار اسب‌سواری بچگانه!")).toBe("شلوار اسب سواری بچگانه");
    expect(normalizeSearch("قیمت ۱۲۳ هزار تومان.")).toBe("قیمت 123 هزار تومان");
  });

  it("normalizeDisplay preserves punctuation and digits", () => {
    expect(normalizeDisplay("سلام! قیمت: ۱۲۳")).toBe("سلام! قیمت: ۱۲۳");
  });

  it("buildSearchText joins and normalizes", () => {
    expect(buildSearchText(["فروشگاه", null, "   لباس  ", "بچگانه!"])).toBe("فروشگاه لباس بچگانه");
  });

  it("tokenize filters tokens length and normalizes", () => {
    expect(tokenize("یک فروشگاه لباس بچگانه")).toEqual(["یک", "فروشگاه", "لباس", "بچگانه"]);
    expect(tokenize("آ ب پ")).toEqual([]);
  });

  it("normalizePhone cleans input digits", () => {
    expect(normalizePhone("۰۹۱۲-۱۲۳ ۴۵۶۷")).toBe("09121234567");
    expect(normalizePhone("(021) 1234567")).toBe("0211234567");
    expect(normalizePhone(null)).toBeNull();
  });
});
