"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("beeroon-theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-ink-50/80 backdrop-blur-md dark:border-white/5 dark:bg-ink-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl2 bg-brand-500 text-white">ب</span>
          بیرون
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/register-business"
            className="hidden rounded-full border border-brand-500/30 px-4 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-500/10 dark:text-brand-400 sm:block"
          >
            ثبت کسب‌وکار
          </Link>
          <button
            onClick={toggle}
            aria-label="تغییر حالت شب/روز"
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-sm dark:border-white/10"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
