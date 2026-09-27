"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import CityPicker from "@/components/CityPicker";
import type { City } from "@/lib/types";

function Icon({ name }: { name: "search" | "bell" | "home" | "grid" | "user" }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  };
  return <svg className="h-[19px] w-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Header({ cities }: { cities: City[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCity = searchParams.get("city");
  const withCity = (href: string) => selectedCity ? href + (href.includes("?") ? "&" : "?") + "city=" + encodeURIComponent(selectedCity) : href;

  return (
    <>
      <header className="mx-auto max-w-[1080px] px-[18px] pb-1 pt-4 sm:px-[26px] sm:pt-5">
        <div className="mb-4 flex items-center justify-between">
          <Link href={withCity("/")} className="flex items-center gap-2 font-extrabold text-base sm:text-lg" aria-label="صفحه اصلی بیرون">
            <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-[#c91442] sm:h-8 sm:w-8"><img src="/beeroon-mark.svg" alt="" className="h-[17px] w-[17px] brightness-0 invert" /></span>
            بیرون
          </Link>
          <div className="flex items-center gap-3.5 text-[#8f8283]">
            <Icon name="bell" />
            <Suspense fallback={<span className="h-5 w-20 rounded bg-[#fdfaf9]" />}><CityPicker cities={cities} /></Suspense>
          </div>
        </div>
        <form action="/search" method="get" className="my-3 flex items-center gap-2.5 rounded-[13px] border-[1.4px] border-[#f0e9ea] px-[15px] py-3 text-xs text-[#8f8283]">
          <Icon name="search" />
          {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
          <input name="q" aria-label="جست‌وجو" placeholder="دنبال چی می‌گردی؟" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#8f8283]" />
        </form>
      </header>
      <nav className="sample-bottomnav">
        <Link href={withCity("/")} className={pathname === "/" ? "active" : ""}><Icon name="home" />خانه</Link>
        <Link href={withCity("/#directory")} className={pathname.startsWith("/category") ? "active" : ""}><Icon name="grid" />دسته‌ها</Link>
        <Link href={withCity("/search")} className={pathname === "/search" ? "active" : ""}><Icon name="search" />جست‌وجو</Link>
        <Link href={withCity("/register-business")} className={pathname.startsWith("/register") ? "active" : ""}><Icon name="user" />پروفایل</Link>
      </nav>
    </>
  );
}