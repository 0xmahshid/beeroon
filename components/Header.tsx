"use client";

import Link from "next/link";

const navItems = [
  ["کشف کن", "/"],
  ["دسته‌بندی‌ها", "/#directory"],
  ["نزدیک من", "/#nearby"],
  ["ثبت کسب‌وکار", "/register-business"],
  ["آنلاین‌شاپ‌ها", "/register-online-shop"],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfe2] bg-white/95 shadow-[0_8px_28px_-24px_rgba(70,40,48,.55)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f3] p-1 shadow-[0_10px_20px_-14px_rgba(237,11,85,.8)] transition group-hover:-rotate-3">
            <img src="/beeroon-mark.svg" alt="نشان بیرون" className="h-full w-full rounded-xl object-cover" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-xl font-black tracking-tight text-[#ed0b55]">بیرون</span>
            <span className="block text-[10px] font-bold text-[#9b858b]">هر چیزی، همین نزدیکی‌ها</span>
          </span>
        </Link>

        <Link href="/#directory" className="group flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-[#eadfe2] bg-[#fffafa] px-3.5 py-3 text-xs font-bold text-[#9b898d] transition hover:border-[#ed0b55]/35 hover:bg-white sm:max-w-xl">
          <span className="text-xl leading-none text-[#ed0b55]">⌕</span>
          <span className="truncate">دنبال کافه، فروشگاه، متخصص یا هر چیز دیگه‌ای می‌گردی؟</span>
          <span className="mr-auto hidden rounded-xl bg-[#ed0b55] px-3 py-1.5 text-[10px] font-black text-white sm:block">جست‌وجو</span>
        </Link>

        <Link href="/register-business" className="hidden shrink-0 rounded-2xl bg-[#ed0b55] px-4 py-3 text-xs font-black text-white shadow-[0_11px_22px_-16px_rgba(237,11,85,.9)] transition hover:-translate-y-0.5 hover:bg-[#ce0a4c] md:block">
          ثبت کسب‌وکار
        </Link>
      </div>
      <div className="hidden border-t border-[#f2e8ea] bg-[#fffdfd] md:block">
        <nav className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-2.5 text-xs font-black text-[#6f6164] sm:px-6 lg:px-8">
          {navItems.map(([label, href], index) => (
            <Link key={href} href={href} className={index === 0 ? "shrink-0 text-[#ed0b55]" : "shrink-0 transition hover:text-[#ed0b55]"}>
              {label}
            </Link>
          ))}
          <span className="mr-auto shrink-0 rounded-full bg-[#fff0f3] px-3 py-1.5 text-[10px] text-[#c70d46]">مشهد · شهر شروع ما</span>
        </nav>
      </div>
    </header>
  );
}