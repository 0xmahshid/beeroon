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

function SearchIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.6" />
      <path d="m16 16 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20c.5-3.5 2.7-5.3 6.5-5.3s6 1.8 6.5 5.3" strokeLinecap="round" />
    </svg>
  );
}

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
      <span className="shrink-0 text-[#777]"><SearchIcon /></span>
      {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
      <input
        name="q"
        aria-label="جست‌وجو"
        placeholder="جست‌وجو در بیرون؛ کافه، فروشگاه، متخصص..."
        className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-[#262626] outline-none placeholder:text-[#9b9b9b]"
      />
      <button type="submit" className="hidden rounded-lg bg-[#ef4056] px-3.5 py-2 text-[10px] font-black text-white transition hover:bg-[#d92f47] sm:block">
        جست‌وجو
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#e3e3e3] bg-white/95 backdrop-blur-md">
      <div className="hidden bg-[#3c3c3c] text-[10px] font-bold text-white/90 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <span>بیرون؛ دایرکتوری ساده برای پیدا کردن جای درست</span>
          <span className="text-white/60">برای شروع، شهر خودت را انتخاب کن</span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[68px] max-w-7xl items-center gap-3 px-4 py-2 sm:min-h-[76px] sm:px-6 lg:px-8">
        <Link href={withCity("/")} className="flex shrink-0 items-center gap-2.5" aria-label="صفحه اصلی بیرون">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f3] p-1 sm:h-11 sm:w-11">
            <img src="/beeroon-mark.svg" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="hidden text-right sm:block">
            <strong className="block text-base font-black tracking-tight text-[#ef4056]">بیرون</strong>
            <span className="mt-0.5 block text-[9px] font-bold text-[#999]">پیداش کن، بعد راه بیفت</span>
          </span>
        </Link>

        <div className="hidden shrink-0 sm:block">
          <Suspense fallback={<span className="h-10 w-24 rounded-xl border border-[#e6e6e6] bg-white" />}>
            <CityPicker cities={cities} />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          {searchForm("group flex w-full items-center gap-3 rounded-xl border border-[#e1e1e1] bg-[#f7f7f7] px-3.5 py-1.5 transition focus-within:border-[#ef4056] focus-within:bg-white hover:border-[#cfcfcf]")}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={withCity("/register-business")}
            className="hidden items-center gap-2 rounded-xl border border-[#e1e1e1] px-3.5 py-2.5 text-[11px] font-black text-[#444] transition hover:border-[#ef4056] hover:text-[#ef4056] md:inline-flex"
          >
            <UserIcon />
            <span>ثبت کسب‌وکار</span>
          </Link>
          <Link href={withCity("/search")} className="grid h-10 w-10 place-items-center rounded-xl border border-[#e1e1e1] text-[#555] transition hover:border-[#ef4056] hover:text-[#ef4056] sm:hidden" aria-label="جست‌وجو">
            <SearchIcon />
          </Link>
        </div>
      </div>

      <div className="border-t border-[#f0f0f0] sm:hidden">
        <div className="flex items-center gap-2 px-4 py-2">
          <Suspense fallback={<span className="h-9 w-24 rounded-lg border border-[#e6e6e6] bg-white" />}>
            <CityPicker cities={cities} />
          </Suspense>
          <Link href={withCity("/register-business")} className="mr-auto rounded-lg bg-[#fff0f3] px-3 py-2 text-[10px] font-black text-[#ef4056]">
            ثبت کسب‌وکار
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-[#f0f0f0] bg-white md:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 text-xs font-bold text-[#555] sm:px-6 lg:px-8">
          <Link href={withCity("/")} className="shrink-0 text-[#ef4056]">خانه</Link>
          {navItems.map(([label, href]) => (
            <Link key={href} href={withCity(href)} className="shrink-0 transition hover:text-[#ef4056]">{label}</Link>
          ))}
          <span className="mr-auto shrink-0 text-[10px] text-[#aaa]">انتخاب شهر، نتیجه‌های نزدیک‌تر</span>
        </nav>
      </div>
    </header>
  );
}