const IRAN_STANDARD_OFFSET_MS = 3 * 60 * 60 * 1000 + 30 * 60 * 1000;

const WEEKDAYS_FA = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
const WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export type TimeRange = { start: string; end: string };

export type WeeklyHours = Partial<Record<number, TimeRange[] | "closed">>;

export function getIranDate(date: Date = new Date()): Date {
  const ms = date.getTime() + (date.getTimezoneOffset() * 60 * 1000) + IRAN_STANDARD_OFFSET_MS;
  return new Date(ms);
}

export function getIranWeekday(date: Date = new Date()): number {
  const iran = getIranDate(date);
  const jsDay = iran.getUTCDay();
  return (jsDay + 1) % 7;
}

function parseTimeHHMM(value: string): { h: number; m: number } | null {
  const match = String(value).match(/(\d{1,2})[:：](\d{2})/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

function minutesOfDay(value: string, nowIran: Date): number | null {
  const parsed = parseTimeHHMM(value);
  if (!parsed) return null;
  return parsed.h * 60 + parsed.m;
}

function parseLooseTime(value: string): string | null {
  const raw = String(value).trim();
  if (!raw) return null;
  const m = raw.match(/(\d{1,2})(?:[:：](\d{0,2}))?/);
  if (!m) return null;
  const h = Number(m[1]);
  const mm = m[2] && m[2].length ? Number(m[2]) : 0;
  if (!Number.isFinite(h) || h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  const hour = h.toString().padStart(2, "0");
  const minute = mm.toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function normalizeHoursStringToStructured(hours: string | null | undefined): WeeklyHours | null {
  if (!hours) return null;
  const text = String(hours).trim();
  if (!text) return null;
  if (/۲۴.*ساعته|24\s*ساعته|همیشه.*باز|always\s*open|24\/7/i.test(text)) {
    return Object.fromEntries(WEEKDAYS_FA.map((_, i) => [i, [{ start: "00:00", end: "24:00" }]])) as WeeklyHours;
  }
  if (/^تعطیل$|^بسته$|^closed$/i.test(text)) {
    return Object.fromEntries(WEEKDAYS_FA.map((_, i) => [i, "closed"])) as WeeklyHours;
  }
  const fridayClosed = /(^|\s|—|-)جمع?ه.*(تعطیل|بسته)|(تعطیل|بسته).*جمع?ه($|\s)/.test(text);
  const tokens = text.split(/\s*(?:—|–|-|تا|and|,)\s*/i).map((t) => t.trim()).filter(Boolean);
  const startToken = tokens[0];
  let endToken = tokens.find((t) => /\d/.test(t) && t !== startToken);
  if (!endToken && tokens.length >= 2) endToken = tokens[tokens.length - 1];
  const start = parseLooseTime(startToken || "");
  const end = parseLooseTime(endToken || "");
  if (!start || !end || start === end) return null;
  const range = { start, end };
  return Object.fromEntries(WEEKDAYS_FA.map((_, i) => [i, i === 6 && fridayClosed ? "closed" : [range]])) as WeeklyHours;
}

export type OpenStatus =
  | { kind: "open_until"; until: string }
  | { kind: "closed_opening_at"; at: string }
  | { kind: "closed_today" }
  | { kind: "no_hours" }
  | { kind: "open_24" };

export function computeOpenStatus(rawHours: string | null | undefined, date: Date = new Date()): OpenStatus {
  const structured = normalizeHoursStringToStructured(rawHours);
  if (!structured) return { kind: "no_hours" };
  const firstEntry = Object.values(structured)[0];
  const alwaysOpen = Array.isArray(firstEntry) && firstEntry[0]?.start === "00:00" && firstEntry[0]?.end === "24:00" && Object.keys(structured).length === 7;
  if (alwaysOpen) return { kind: "open_24" };
  const allClosed = Object.values(structured).every((e) => e === "closed");
  if (allClosed) return { kind: "closed_today" };
  const iran = getIranDate(date);
  const weekday = getIranWeekday(date);
  const nowMinutes = iran.getUTCHours() * 60 + iran.getUTCMinutes();
  const today = structured[weekday];
  if (!today || today === "closed") return { kind: "closed_today" };
  const range = today[0];
  if (!range) return { kind: "closed_today" };
  const start = minutesOfDay(range.start, iran);
  const end = minutesOfDay(range.end, iran);
  if (start == null || end == null) return { kind: "no_hours" };
  const overnight = end <= start;
  const adjustedEnd = overnight ? end + 24 * 60 : end;
  const adjustedNow = overnight && nowMinutes < start ? nowMinutes + 24 * 60 : nowMinutes;
  if (adjustedNow >= start && adjustedNow < adjustedEnd) {
    return { kind: "open_until", until: range.end };
  }
  return { kind: "closed_opening_at", at: range.start };
}

export function isOpenNow(rawHours: string | null | undefined, date: Date = new Date()): boolean | null {
  const status = computeOpenStatus(rawHours, date);
  if (status.kind === "no_hours") return null;
  return status.kind === "open_until" || status.kind === "open_24";
}

export function formatOpenStatus(status: OpenStatus): string {
  switch (status.kind) {
    case "open_24":
      return "باز است — ۲۴ ساعته";
    case "open_until":
      return "باز است تا " + status.until;
    case "closed_opening_at":
      return "بسته است — از " + status.at + " باز می‌شود";
    case "closed_today":
      return "امروز تعطیل است";
    case "no_hours":
      return "ساعات کاری ثبت نشده";
  }
}

export function weekdayLabel(weekday: number, short = false): string {
  return short ? WEEKDAYS_SHORT[weekday] ?? "" : WEEKDAYS_FA[weekday] ?? "";
}

export type NormalizedHours =
  | { type: "unknown" }
  | { type: "always_open" }
  | { type: "always_closed" }
  | { type: "range"; start: string; end: string; fridayClosed: boolean };

export function normalizeHours(raw: string | null | undefined): NormalizedHours {
  if (!raw) return { type: "unknown" };
  const text = String(raw).trim();
  if (!text) return { type: "unknown" };
  if (/۲۴.*ساعته|24\s*ساعته|همیشه.*باز|always\s*open|24\/7/i.test(text)) return { type: "always_open" };
  if (/^تعطیل$|^بسته$|^closed$/i.test(text)) return { type: "always_closed" };
  const fridayClosed = /(^|\s|—|-)جمع?ه.*(تعطیل|بسته)|(تعطیل|بسته).*جمع?ه($|\s)/.test(text);
  const tokens = text.split(/\s*(?:—|–|-|تا|and|,)\s*/i).map((t) => t.trim()).filter(Boolean);
  const startToken = tokens[0];
  let endToken = tokens.find((t) => /\d/.test(t) && t !== startToken);
  if (!endToken && tokens.length >= 2) endToken = tokens[tokens.length - 1];
  const start = parseLooseTime(startToken || "");
  const end = parseLooseTime(endToken || "");
  if (!start || !end || start === end) return { type: "unknown" };
  return { type: "range", start, end, fridayClosed };
}
