import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "بیرون | قبل از راه افتادن، پیداش کن",
  description: "چیزی را که در شهرت می‌خواهی جست‌وجو کن، آدرس‌های مرتبط را یک‌جا ببین و بعد راه بیفت.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ed0b55",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#fffafa] text-[#2d2028] antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t border-[#eadfe2] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-9 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <img src="/beeroon-mark.svg" alt="" className="h-10 w-10 rounded-xl" />
              <div>
                <p className="font-black text-[#ed0b55]">بیرون</p>
                <p className="mt-1 text-xs text-[#9b898d]">پیداش کن، بعد راه بیفت.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-[#7e6d71]">
              <a href="/#directory">دسته‌بندی‌ها</a>
              <a href="/register-business">ثبت کسب‌وکار</a>
              <a href="/register-online-shop">ثبت آنلاین‌شاپ</a>
            </div>
            <p className="text-xs text-[#aa999d]">© {new Date().getFullYear()} بیرون</p>
          </div>
        </footer>
      </body>
    </html>
  );
}