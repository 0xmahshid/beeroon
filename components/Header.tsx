"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import type { City } from "@/lib/types";

const navItems = [
  ["دسته‌بندی‌ها", "/#directory"],
  ["محبوب‌ترین‌ها", "/#featured"],
  ["راهنمای انتخاب", "/#guide"],
  ["ثبت کسب‌وکار", "/register-business"],
  ["آنلاین‌شاپ‌ها", "/register-online-shop"],
];

export default function Header({ cities }: { cities: City[] }) {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get("city");
  const withCity = (href: string) => {
    if (!selectedCity) return href;
    const [path, hash] = href.split("#");
    return path + (path.includes("?") ? "&" : "?") + "city=" + encodeURIComponent(selectedCity) + (hash ? "#" + hash : "");
  };

  const searchForm = (className: string) => (
    <form action="/search" method="get" role="search" className={className}>
      <span className="text-xl leading-none text-[#63515a]" aria-hidden="true">⌕</span>
      {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
      <input name="q" aria-label="جست‌وجو" placeholder="دنبال چی می‌گردی؟ کافه، فروشگاه، متخصص..." className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-[#33212b] outline-none placeholder:text-[#9b858d]" />
      <button type="submit" className="hidden rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#87737b] shadow-sm transition hover:text-[#ef4056] sm:block">جست‌وجو</button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfe2] bg-white/95 shadow-[0_4px_18px_-18px_rgba(70,20,38,.55)] backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[68px] max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:h-[76px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Suspense fallback={<span className="h-10 w-24 rounded-xl border border-[#eadfe2] bg-white" />}><CityPicker cities={cities} /></Suspense>
        </div>

        <Link href={withCity("/")} aria-label="صفحه اصلی بیرون" className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <span className="grid h-11 w-11 place-items-center rounded-[1.05rem] bg-gradient-to-br from-[#ffe4ea] to-[#fff5e0] p-0.5 shadow-[0_8px_16px_-14px_rgba(239,64,86,.7)] sm:h-12 sm:w-12">
            <img src="/beeroon-mark.svg" alt="نشان بیرون" className="block h-full w-full rounded-[0.9rem] object-contain" />
          </span>
          <span className="sr-only">بیرون، پیداش کن بعد راه بیفت</span>
        </Link>

        <div className="flex min-w-0 items-center gap-2">
          {searchForm("group hidden min-w-0 items-center gap-3 rounded-2xl border border-transparent bg-[#f8f2f3] px-4 py-1.5 text-xs text-[#87737b] transition hover:border-[#f2cbd2] hover:bg-white md:flex md:w-[min(34vw,420px)]")}
          <Link href={withCity("/register-business")} className="hidden shrink-0 rounded-xl border border-[#eadfe2] px-3.5 py-2.5 text-xs font-bold text-[#5e4a52] transition hover:border-[#ef4056] hover:text-[#ef4056] md:inline-flex">ثبت کسب‌وکار</Link>
        </div>
      </div>

      <div className="border-t border-[#f5ebed] px-4 pb-3 pt-2 md:hidden">
        {searchForm("group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-[#f8f2f3] px-4 py-1.5 text-xs text-[#87737b] transition focus-within:border-[#f2cbd2] focus-within:bg-white")}
      </div>

      <div className="hidden border-t border-[#f5ebed] bg-[#fffdfd] md:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 text-xs font-bold text-[#5e4a52] sm:px-6 lg:px-8">
          <Link href={withCity("/")} className="shrink-0 text-[#ef4056]">خانه</Link>
          {navItems.map(([label, href]) => <Link key={href} href={withCity(href)} className="shrink-0 transition hover:text-[#ef4056]">{label}</Link>)}
          <span className="mr-auto hidden shrink-0 text-[11px] text-[#a18e95] lg:block">یک شهر را انتخاب کن و شروع کن</span>
        </nav>
      </div>
    </header>
  );
}
