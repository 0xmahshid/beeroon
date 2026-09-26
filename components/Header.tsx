"use client";

import Link from "next/link";

const navItems = [
  ["دسته‌بندی‌ها", "/#directory"],
  ["محبوب‌ترین‌ها", "/#featured"],
  ["نزدیک من", "/#nearby"],
  ["ثبت کسب‌وکار", "/register-business"],
  ["آنلاین‌شاپ‌ها", "/register-online-shop"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e4e4e7] bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fff0f2] p-1">
            <img src="/beeroon-mark.svg" alt="نشان بیرون" className="h-full w-full rounded-lg object-cover" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-xl font-black tracking-tight text-[#ef4056]">بیرون</span>
            <span className="block text-[10px] font-medium text-[#71717a]">هر چیزی، همین نزدیکی‌ها</span>
          </span>
        </Link>
        <Link href="/#directory" className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f4f4f5] px-4 py-3 text-xs text-[#71717a] transition hover:bg-[#ededee] sm:max-w-[560px]">
          <span className="text-xl leading-none text-[#52525b]">⌕</span>
          <span className="truncate">جست‌وجوی کافه، فروشگاه، متخصص یا خدمت</span>
          <span className="mr-auto hidden rounded-lg bg-white px-2.5 py-1 text-[10px] font-bold text-[#71717a] sm:block">جست‌وجو</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/register-business" className="rounded-xl border border-[#e4e4e7] px-3.5 py-2.5 text-xs font-bold text-[#52525b] transition hover:border-[#ef4056] hover:text-[#ef4056]">ثبت کسب‌وکار</Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl border border-[#e4e4e7] text-lg text-[#52525b]" aria-label="حساب کاربری">♙</button>
        </div>
      </div>
      <div className="border-t border-[#f0f0f1] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 text-xs font-bold text-[#52525b] sm:px-6 lg:px-8">
          <Link href="/" className="shrink-0 text-[#ef4056]">خانه</Link>
          {navItems.map(([label, href]) => <Link key={href} href={href} className="shrink-0 transition hover:text-[#ef4056]">{label}</Link>)}
          <span className="mr-auto hidden shrink-0 text-[11px] text-[#a1a1aa] sm:block">مشهد · شهر شروع ما</span>
        </nav>
      </div>
    </header>
  );
}