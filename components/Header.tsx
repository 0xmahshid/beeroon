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

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfe2] bg-white/95 shadow-[0_4px_18px_-18px_rgba(70,20,38,.55)] backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe4ea] to-[#fff5e0] p-1 shadow-[0_8px_16px_-14px_rgba(239,64,86,.7)]"><img src="/beeroon-mark.svg" alt="نشان بیرون" className="h-full w-full rounded-xl object-cover" /></span>
          <span className="hidden sm:block"><span className="block text-xl font-black tracking-tight text-[#ef4056]">بیرون</span><span className="block text-[10px] font-medium text-[#87737b]">پیداش کن، بعد راه بیفت.</span></span>
        </Link>
        <form action="/search" method="get" className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-transparent bg-[#f8f2f3] px-4 py-1.5 text-xs text-[#87737b] transition hover:border-[#f2cbd2] hover:bg-white sm:max-w-[560px]"><span className="text-xl leading-none text-[#63515a]">⌕</span>{selectedCity && <input type="hidden" name="city" value={selectedCity} />}<input name="q" placeholder="دنبال چی می‌گردی؟ کافه، فروشگاه، متخصص..." className="min-w-0 flex-1 bg-transparent py-2.5 text-xs text-[#33212b] outline-none placeholder:text-[#87737b]" /><button type="submit" className="hidden rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#87737b] shadow-sm transition hover:text-[#ef4056] sm:block">جست‌وجو</button></form>
        <div className="flex items-center gap-2"><Suspense fallback={<span className="h-10 w-24 rounded-xl border border-[#eadfe2] bg-white" />}><CityPicker cities={cities} /></Suspense><div className="hidden items-center gap-2 md:flex"><Link href="/register-business" className="rounded-xl border border-[#eadfe2] px-3.5 py-2.5 text-xs font-bold text-[#5e4a52] transition hover:border-[#ef4056] hover:text-[#ef4056]">ثبت کسب‌وکار</Link><button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-[#eadfe2] text-lg text-[#5e4a52] transition hover:border-[#ef4056] hover:text-[#ef4056]" aria-label="حساب کاربری">♙</button></div></div>
      </div>
       <div className="hidden border-t border-[#f5ebed] bg-[#fffdfd] md:block"><nav className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 text-xs font-bold text-[#5e4a52] sm:px-6 lg:px-8"><Link href={withCity("/")} className="shrink-0 text-[#ef4056]">خانه</Link>{navItems.map(([label, href]) => <Link key={href} href={withCity(href)} className="shrink-0 transition hover:text-[#ef4056]">{label}</Link>)}<span className="mr-auto hidden shrink-0 text-[11px] text-[#a18e95] sm:block">یک شهر را انتخاب کن و شروع کن</span></nav></div>
    </header>
  );
}
