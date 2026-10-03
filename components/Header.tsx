"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import NeighborhoodPicker from "@/components/NeighborhoodPicker";
import type { City, Neighborhood } from "@/lib/types";

function SearchIcon() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>;
}

export default function Header({ cities, neighborhoods }: { cities: City[]; neighborhoods: Neighborhood[] }) {
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get("city");
  const neighborhood = searchParams.get("neighborhood");
  const withPlace = (href: string) => {
    const [path, hash] = href.split("#");
    const params = new URLSearchParams(path.split("?")[1] || "");
    if (selectedCity) params.set("city", selectedCity);
    if (neighborhood) params.set("neighborhood", neighborhood);
    const query = params.toString();
    return path.split("?")[0] + (query ? "?" + query : "") + (hash ? "#" + hash : "");
  };

  return (
    <header className="beeroon-header sticky top-0 z-50 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[64px] items-center gap-3">
          <Link href={withPlace("/")} className="flex shrink-0 items-center gap-2.5" aria-label="صفحه‌ی اصلی بیرون">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-[14px] shadow-sm"><img src="/beeroon-logo.png" alt="نشان بیرون" className="h-full w-full object-cover" /></span>
            <span className="hidden sm:block"><strong className="block text-lg font-black text-[#32162d]">بیرون</strong><span className="block text-[9px] font-bold text-[#a18d96]">قبل از بیرون زدن، بیرون رو چک کن.</span></span>
          </Link>
          <div className="hidden shrink-0 items-center gap-3 sm:flex"><Suspense fallback={<span className="h-9 w-24 rounded-lg bg-[#fcf8f7]" />}><CityPicker cities={cities} /></Suspense><Suspense fallback={null}><NeighborhoodPicker initial={neighborhoods} /></Suspense></div>
          <form action="/search" method="get" role="search" className="beeroon-search flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#e1e4e9] bg-[#fcf8f7] px-4 py-2">
             <SearchIcon /><input type="hidden" name="city" value={selectedCity || "mashhad"} />{neighborhood && <input type="hidden" name="neighborhood" value={neighborhood} />}<input name="q" aria-label="جست‌وجو" placeholder="چی لازم داری؟ مثلاً کافه یا تعمیرکار" className="min-w-0 flex-1 bg-transparent py-2 text-xs outline-none placeholder:text-[#9a8990]" /><button className="hidden rounded-xl bg-[#d51f4f] px-4 py-2.5 text-[10px] font-black text-white transition hover:bg-[#b91640] sm:block">جست‌وجو</button>
          </form>
          <div className="hidden shrink-0 items-center gap-2 md:flex"><Link href={withPlace("/#directory")} className="rounded-xl px-3 py-2.5 text-xs font-bold text-[#6b5962] transition hover:bg-[#fff0f3] hover:text-[#d51f4f]">دسته‌ها</Link><Link href={withPlace("/register-business")} className="rounded-xl bg-[#32162d] px-4 py-2.5 text-xs font-black text-white">ثبت کسب‌وکار</Link></div>
          <div className="flex items-center gap-2 sm:hidden"><Suspense fallback={null}><CityPicker cities={cities} /></Suspense><Suspense fallback={null}><NeighborhoodPicker initial={neighborhoods} /></Suspense></div>
        </div>
      </div>
    </header>
  );
}
