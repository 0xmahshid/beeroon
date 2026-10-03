"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseFiltersFromUrl, type Filters, type SortMode } from "@/lib/search-filters";

type Props = {
  totalResults: number;
  categoryHref?: string;
};

export default function SearchFilters({ totalResults }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFiltersFromUrl(searchParams);

  function toggle(key: keyof Filters, value?: unknown) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "sort") {
      params.set("sort", String(value));
    } else {
      const on = typeof value === "boolean" ? value : !(filters as any)[key];
      if (on) params.set(key === "openNow" ? "open" : key === "verifiedOnly" ? "verified" : key === "hasPhone" ? "has_phone" : key === "hasDirections" ? "has_dir" : key === "inPersonOnly" ? "in_person" : "online", "1");
      else params.delete(key === "openNow" ? "open" : key === "verifiedOnly" ? "verified" : key === "hasPhone" ? "has_phone" : key === "hasDirections" ? "has_dir" : key === "inPersonOnly" ? "in_person" : "online");
    }
    const qs = params.toString();
    router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
  }

  const activeFilterCount =
    (filters.openNow ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.hasPhone ? 1 : 0) +
    (filters.hasDirections ? 1 : 0) +
    (filters.inPersonOnly ? 1 : 0) +
    (filters.onlineOnly ? 1 : 0);

  function resetAll() {
    const params = new URLSearchParams(searchParams.toString());
    ["sort", "open", "verified", "has_phone", "has_dir", "in_person", "online"].forEach((k) => params.delete(k));
    const qs = params.toString();
    router.replace(pathname + (qs ? "?" + qs : ""), { scroll: false });
  }

  const sortButtons: { key: SortMode; label: string; icon: string }[] = [
    { key: "relevance", label: "مرتبط‌ترین", icon: "🎯" },
    { key: "distance", label: "نزدیک‌ترین", icon: "📍" },
    { key: "newest", label: "جدیدترین", icon: "✨" },
  ];

  const chipFilters: { key: keyof Filters; label: string; icon: string }[] = [
    { key: "openNow", label: "باز است", icon: "🟢" },
    { key: "verifiedOnly", label: "تأیید شده", icon: "✓" },
    { key: "hasPhone", label: "شماره تماس", icon: "📞" },
    { key: "hasDirections", label: "مسیریابی", icon: "🧭" },
    { key: "inPersonOnly", label: "خرید حضوری", icon: "🏪" },
    { key: "onlineOnly", label: "فقط آنلاین‌شاپ", icon: "🛒" },
  ];

  return (
    <div className="sticky top-[72px] z-30 -mx-4 mb-5 rounded-b-3xl border-b border-[#eef0f4] bg-white/95 px-4 py-3 shadow-[0_8px_20px_-12px_rgba(60,30,45,.15)] backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0f3] px-3 py-1 text-[11px] font-black text-[#d51f4f]">
            <span className="text-sm">🏪</span>
            <span>{totalResults.toLocaleString("fa-IR")} کسب‌وکار</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#858c96]">
          <span className="font-bold">مرتب‌سازی با</span>
          <div className="flex gap-1 rounded-xl bg-[#f3f4f7] p-1">
            {sortButtons.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => toggle("sort", s.key)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${
                  filters.sort === s.key
                    ? "bg-white text-[#d51f4f] shadow-[0_2px_8px_rgba(213,31,79,.15)]"
                    : "text-[#69707b] hover:text-[#25252a]"
                }`}
                style={{ minHeight: "36px" }}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {chipFilters.map((chip) => {
          const on = (filters as any)[chip.key] as boolean;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => toggle(chip.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition ${
                on
                  ? "border-[#d51f4f] bg-[#d51f4f] text-white shadow-[0_4px_12px_rgba(213,31,79,.25)]"
                  : "border-[#e6e8ee] bg-[#fbfbfc] text-[#555a63] hover:border-[#e0a0af] hover:text-[#d51f4f]"
              }`}
              style={{ minHeight: "40px" }}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          );
        })}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#c8bcc1] px-3 py-1.5 text-[10.5px] font-bold text-[#6b5962] transition hover:border-[#d51f4f] hover:text-[#d51f4f]"
            style={{ minHeight: "40px" }}
          >
            <span>✕</span>
            <span>حذف فیلترها ({activeFilterCount.toLocaleString("fa-IR")})</span>
          </button>
        )}
      </div>
    </div>
  );
}
