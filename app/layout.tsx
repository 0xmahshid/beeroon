import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "بیرون | Beeroon — دایرکتوری کسب‌وکارهای محلی ایران",
  description:
    "هر کسب‌وکار محلی را در کمتر از سه ثانیه پیدا کن؛ بدون رتبه‌بندی پولی و با اطلاعات کامل تماس.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-[#fffdf9] text-[#241b1c] antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t border-[#eadfd7] bg-white py-8 text-center text-sm text-[#8a7b79]">
          © {new Date().getFullYear()} بیرون (Beeroon) — همه دیده می‌شوند.
        </footer>
      </body>
    </html>
  );
}