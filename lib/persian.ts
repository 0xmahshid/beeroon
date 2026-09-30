const ZERO_WIDTH_CHARS = /[\u200c\u200d\u200e\u200f\u2060\ufeff]/g;
const EXTRA_WHITESPACE = /\s+/g;
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ENGLISH_DIGITS = "0123456789";
const ARABIC_TO_PERSIAN_YEH = /[يى]/g;
const ARABIC_TO_PERSIAN_KAF = /ك/g;
const PUNCTUATION_CLEANUP = /[،؛:.!؟()«»""''\-_/\\|@#$%^&*+={}\[\]<>~`]/g;

export function normalizePersian(value: string, options: { digits?: "fa" | "en" | "keep"; punctuation?: "keep" | "remove"; case?: "lower" | "keep" } = {}): string {
  if (value == null) return "";
  let text = String(value);
  text = text.replace(ARABIC_TO_PERSIAN_YEH, "ی").replace(ARABIC_TO_PERSIAN_KAF, "ک");
  text = text.replace(ZERO_WIDTH_CHARS, " ");
  const digits = options.digits ?? "keep";
  if (digits === "en") {
    for (let i = 0; i < 10; i++) text = text.split(PERSIAN_DIGITS[i]).join(ENGLISH_DIGITS[i]);
  } else if (digits === "fa") {
    for (let i = 0; i < 10; i++) text = text.split(ENGLISH_DIGITS[i]).join(PERSIAN_DIGITS[i]);
  }
  if (options.punctuation === "remove") text = text.replace(PUNCTUATION_CLEANUP, " ");
  if (options.case === "lower") text = text.toLocaleLowerCase("fa-IR");
  text = text.replace(EXTRA_WHITESPACE, " ").trim();
  return text;
}

export function normalizeSearch(value: string): string {
  return normalizePersian(value, { digits: "en", punctuation: "remove", case: "lower" });
}

export function normalizeDisplay(value: string): string {
  return normalizePersian(value, { digits: "keep", punctuation: "keep", case: "keep" });
}

export function buildSearchText(fields: Array<string | null | undefined>): string {
  return normalizePersian(fields.filter(Boolean).join(" "), { digits: "en", punctuation: "remove", case: "lower" });
}

export function tokenize(value: string): string[] {
  return normalizeSearch(value).split(" ").filter((token) => token.length >= 2);
}

export function normalizePhone(value: string | null | undefined): string | null {
  if (value == null) return null;
  let text = String(value);
  for (let i = 0; i < 10; i++) text = text.split(PERSIAN_DIGITS[i]).join(ENGLISH_DIGITS[i]);
  text = text.replace(/[^\d]/g, "");
  if (!text) return null;
  return text;
}
