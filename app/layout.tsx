import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "بیرون | Beeroon — دایرکتوری کسب‌وکارهای محلی ایران",
  description:
    "هر کسب‌وکار محلی رو در کمتر از سه ثانیه پیدا کن — بدون الگوریتم، بدون تبلیغ پولی، دیده‌شدن عادلانه برای همه.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f2622e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('beeroon-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-50 antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-16 border-t border-black/5 py-8 text-center text-sm text-ink-900/50 dark:border-white/5 dark:text-ink-50/40">
          © {new Date().getFullYear()} بیرون (Beeroon) — همه دیده می‌شوند.
        </footer>
      </body>
    </html>
  );
}
