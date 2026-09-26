"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#f0dfe0]/80 bg-[#fffaf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f2] p-1 shadow-[0_8px_20px_-12px_rgba(237,11,85,.7)] transition group-hover:-rotate-3">
            <img src="/beeroon-mark.svg" alt="نشان بیرون" className="h-full w-full rounded-[0.85rem] object-cover" />
          </span>
          <span className="hidden sm:block"><span className="block text-xl font-black tracking-tight text-[#ed0b55]">بیرون</span><span className="block text-[10px] font-bold text-[#9a7b82]">همین نزدیکی‌هاست ✦</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[#695b5a] md:flex">
          <Link href="/" className="transition hover:text-[#ed0b55]">کشف کن</Link>
          <Link href="/category/food" className="transition hover:text-[#ed0b55]">دسته‌بندی‌ها</Link>
          <Link href="/register-business" className="transition hover:text-[#ed0b55]">ثبت کسب‌وکار</Link>
          <Link href="/register-online-shop" className="transition hover:text-[#38a18f]">ثبت آنلاین‌شاپ</Link>
        </nav>
        <Link href="/register-business" className="rounded-2xl bg-[#ed0b55] px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_22px_-14px_rgba(237,11,85,.95)] transition hover:-translate-y-0.5 hover:bg-[#c70d46]">ورود کسب‌وکار</Link>
      </div>
    </header>
  );
}
