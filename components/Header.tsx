"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfd7]/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/beeroon-logo.svg" alt="لوگوی بیرون" className="h-11 w-11 rounded-xl object-contain" />
          <span className="text-xl font-black tracking-tight text-[#c91442]">بیرون</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-[#695b5a] md:flex">
          <Link href="/" className="transition hover:text-[#c91442]">کشف کن</Link>
          <Link href="/category/food" className="transition hover:text-[#c91442]">دسته‌بندی‌ها</Link>
          <Link href="/register-business" className="transition hover:text-[#c91442]">ثبت کسب‌وکار</Link>
        </nav>
        <Link
          href="/register-business"
          className="rounded-full border border-[#c91442]/25 px-4 py-2 text-xs font-bold text-[#c91442] transition hover:bg-[#c91442] hover:text-white"
        >
          ورود کسب‌وکار
        </Link>
      </div>
    </header>
  );
}