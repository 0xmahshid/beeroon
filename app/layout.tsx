import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import { getCities } from "@/lib/data";

export const metadata: Metadata = {
  title: "بیرون",
  description: "قبل از راه افتادن، پیداش کن.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = { themeColor: "#c91442" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = await getCities();
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Suspense fallback={<div className="h-[120px] bg-white" />}><Header cities={cities} /></Suspense>
        <main>{children}</main>
        <footer className="mx-auto mt-12 hidden max-w-[1080px] border-t border-[#f0e9ea] px-[26px] py-8 text-xs text-[#8f8283] sm:flex sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} بیرون</span>
          <div className="flex gap-5"><a href="/#directory">دسته‌بندی‌ها</a><a href="/register-business">ثبت کسب‌وکار</a><a href="/register-online-shop">ثبت آنلاین‌شاپ</a></div>
        </footer>
      </body>
    </html>
  );
}