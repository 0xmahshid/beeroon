import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import { getCities } from "@/lib/data";

export const metadata: Metadata = { title: "بیرون | قبل از بیرون زدن، بیرون رو چک کن", description: "کسب‌وکارها و خدمات محلی را قبل از بیرون زدن پیدا کن، مقایسه کن و با خیال راحت انتخاب کن." };
export const viewport: Viewport = { themeColor: "#d51f4f" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = await getCities();
  return <html lang="fa" dir="rtl"><body><Suspense fallback={<div className="h-[75px] bg-white" />}><Header cities={cities} /></Suspense><main>{children}</main><footer className="border-t border-[#eadfe3] bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-[#8b7b84] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© {new Date().getFullYear()} بیرون · ساخته‌شده برای کشف کسب‌وکارهای واقعی</span><div className="flex gap-4"><a href="/#directory">دسته‌بندی‌ها</a><a href="/register-business">ثبت کسب‌وکار</a><a href="/register-online-shop">ثبت آنلاین‌شاپ</a></div></div></footer></body></html>;
}