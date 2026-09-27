import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import { getCities } from "@/lib/data";

export const metadata: Metadata = {
  title: "بیرون | قبل از راه افتادن، پیداش کن",
  description: "کسب‌وکارها و خدمات نزدیکت را پیدا کن، مقایسه کن و بعد راه بیفت.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ef4056",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = await getCities();
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#f7f7f7] text-[#262626] antialiased">
        <Suspense fallback={<div className="h-[68px] border-b border-[#e6e6e6] bg-white" />}><Header cities={cities} /></Suspense>
        <main>{children}</main>
        <footer className="mt-12 border-t border-[#e1e1e1] bg-white">
          <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
            <div className="flex flex-col gap-8 border-b border-[#eeeeee] pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <img src="/beeroon-mark.svg" alt="" className="h-11 w-11 rounded-xl object-contain" />
                <div><p className="font-black text-[#ef4056]">بیرون</p><p className="mt-1 max-w-[15rem] text-xs leading-6 text-[#888]">پیداش کن، مقایسه کن، بعد بیرون بزن.</p></div>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs font-bold text-[#666]">
                <a href="/#directory" className="transition hover:text-[#ef4056]">دسته‌بندی‌ها</a>
                <a href="/#featured" className="transition hover:text-[#ef4056]">کسب‌وکارهای منتخب</a>
                <a href="/register-business" className="transition hover:text-[#ef4056]">ثبت کسب‌وکار</a>
                <a href="/register-online-shop" className="transition hover:text-[#ef4056]">ثبت آنلاین‌شاپ</a>
              </div>
              <div className="rounded-xl bg-[#f7f7f7] px-4 py-3 text-xs text-[#888]"><span className="block font-black text-[#555]">شروع رایگان</span><span className="mt-1 block">برای هر شهری که می‌خواهی</span></div>
            </div>
            <div className="flex flex-col gap-2 pt-5 text-[10px] text-[#aaa] sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} بیرون</span><span>ساخته‌شده برای پیدا کردن چیزهای واقعی نزدیک ما</span></div>
          </div>
        </footer>
      </body>
    </html>
  );
}