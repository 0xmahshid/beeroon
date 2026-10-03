import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import HydrateLocationFromStorage from "@/components/HydrateLocationFromStorage";
import { getCities } from "@/lib/data";
import { getNeighborhoods } from "@/lib/neighborhoods";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "بیرون | قبل از بیرون زدن، بیرون رو چک کن.",
  description:
    "کسب‌وکارهای نزدیکت را جست‌وجو کن و نشانی، ساعت کاری و راه تماس را ببین.",
  icons: { icon: "/beeroon-logo.png", apple: "/beeroon-logo.png" },
  openGraph: {
    title: "بیرون | قبل از بیرون زدن، بیرون رو چک کن.",
    description:
      "در بیرون کسب‌وکارهای محلی را پیدا کن؛ نشانی، ساعت کاری و راه تماس را ببین.",
    type: "website",
    locale: "fa_IR",
    siteName: "بیرون",
    images: [{ url: "/beeroon-og.png", width: 1200, height: 630, alt: "لوگوی بیرون" }],
  },
  twitter: { card: "summary_large_image", images: ["/beeroon-og.png"] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#d51f4f" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = await getCities();
  const neighborhoods = await getNeighborhoods();
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Suspense fallback={<div className="h-[75px] bg-white" />}>
          <Header cities={cities} neighborhoods={neighborhoods} />
        </Suspense>
        <Suspense fallback={null}>
          <HydrateLocationFromStorage />
        </Suspense>
        <main>{children}</main>
        <footer className="border-t border-[#eadfe3] bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs text-[#8b7b84] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <span>© {new Date().getFullYear()} بیرون · فهرست کسب‌وکارهای محلی</span>
            <div className="flex gap-4">
              <a href="/#directory">دسته‌بندی‌ها</a>
              <a href="/register-business">ثبت کسب‌وکار</a>
              <a href="/register-online-shop">ثبت آنلاین‌شاپ</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}