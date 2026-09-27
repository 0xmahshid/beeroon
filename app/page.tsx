import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

const moodLinks = [
  ["یه قهوه می‌چسبه", "food", "کافه و غذا"],
  ["وقت خرید دارم", "shopping", "فروشگاه‌ها"],
  ["چیزی یاد بگیرم", "education", "کلاس و آموزش"],
  ["کارم رو راه بندازم", "business", "خدمات حرفه‌ای"],
];

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string | string[] }> }) {
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([
    getDirectory(),
    getBusinesses({ citySlug }),
    getCityBySlug(citySlug),
  ]);
  const cityQuery = "?city=" + encodeURIComponent(city.slug);
  const featured = businesses.slice(0, 8);
  const quickCategories = categories.slice(0, 10);

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <section className="beeroon-gradient relative overflow-hidden text-white">
        <div className="beeroon-hero-grid pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-16">
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-black text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#ffd166]" />
              راه ساده‌تر برای پیدا کردن جای درست
            </span>
            <h1 className="mt-5 max-w-xl text-[2rem] font-black leading-[1.55] tracking-tight sm:text-5xl">
              هر چیزی که می‌خوای،
              <br />
              <span className="text-[#ffd166]">قبل از رفتن پیدا کن.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/80 sm:text-base">
              از کافه و فروشگاه تا متخصص و خدمات محلی؛ بیرون کمک می‌کند گزینه‌های مرتبط {city.name} را یک‌جا ببینی و سریع انتخاب کنی.
            </p>
            <form action="/search" method="get" className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_18px_30px_-20px_rgba(60,0,20,.7)]">
              <span className="px-2 text-2xl text-[#777]">⌕</span>
              <input type="hidden" name="city" value={city.slug} />
              <input name="q" aria-label="جست‌وجو در بیرون" placeholder="مثلاً کافه، تعمیر موبایل، گل‌فروشی..." className="min-w-0 flex-1 bg-transparent py-3 text-xs text-[#2b2b2b] outline-none placeholder:text-[#aaa] sm:text-sm" />
              <button type="submit" className="shrink-0 rounded-xl bg-[#ef4056] px-4 py-3 text-xs font-black text-white transition hover:bg-[#d92f47] sm:px-6">جست‌وجو</button>
            </form>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold text-white/75">
              <span>✓ نتیجه‌های مرتبط</span>
              <span>✓ آدرس و راه ارتباطی</span>
              <span>✓ رایگان برای شروع</span>
            </div>
          </div>

          <div className="order-2 lg:order-1">
            <div className="beeroon-float mx-auto max-w-[400px] rounded-[1.75rem] border border-white/20 bg-white/10 p-3 shadow-[0_24px_70px_-28px_rgba(20,4,18,.8)] backdrop-blur-sm sm:p-4">
              <div className="flex items-center justify-between px-2 text-[10px] font-bold text-white/75">
                <span>پنل کشف بیرون</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">{city.name}</span>
              </div>
              <div className="mt-3 rounded-2xl bg-white p-4 text-[#242424] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#ef4056]">برای حال امروزت</span>
                    <p className="mt-1 text-base font-black">امروز کجا بریم؟</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff4d9] text-xl text-[#c28a11]">✦</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href={"/category/food" + cityQuery} className="rounded-xl bg-[#fff1f3] p-3 transition hover:bg-[#ffe1e7]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/80 text-[#bd6536]"><CategoryIcon slug="food" className="h-5 w-5" /></span>
                    <span className="mt-2 block text-[11px] font-black text-[#7c263b]">یک کافه‌ی دنج</span>
                    <span className="mt-1 block text-[9px] text-[#a66d79]">انتخاب‌های نزدیک تو</span>
                  </Link>
                  <Link href={"/category/shopping" + cityQuery} className="rounded-xl bg-[#fff8e6] p-3 transition hover:bg-[#ffefc4]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/80 text-[#c58a1c]"><CategoryIcon slug="shopping" className="h-5 w-5" /></span>
                    <span className="mt-2 block text-[11px] font-black text-[#76571b]">یه خرید خوب</span>
                    <span className="mt-1 block text-[9px] text-[#a4864b]">فروشگاه‌های همان زمینه</span>
                  </Link>
                </div>
                <Link href={"/search" + cityQuery} className="mt-3 flex items-center gap-2 rounded-xl border border-[#e9e9e9] bg-[#fafafa] px-3 py-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff0f3] text-sm text-[#ef4056]">⌕</span>
                  <span className="text-[10px] font-bold text-[#999]">دنبال چه چیزی می‌گردی؟</span>
                  <span className="mr-auto text-[#ef4056]">←</span>
                </Link>
              </div>
              <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-bold text-white/65"><span>کشف کن</span><span>انتخاب کن</span><span>بیرون بزن</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6e6e6] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-[#fff3f4] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#d9364b]">انتخاب مطمئن</span><span className="mt-1 block text-[10px] text-[#9d6e76]">کسب‌وکارهای واقعی</span></div>
          <div className="rounded-xl bg-[#effbf7] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#278b7b]">چند گزینه، یک‌جا</span><span className="mt-1 block text-[10px] text-[#6f9e96]">مقایسه‌ی راحت‌تر</span></div>
          <div className="rounded-xl bg-[#fff8e5] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#a67414]">شروع رایگان</span><span className="mt-1 block text-[10px] text-[#a99972]">همین امروز</span></div>
        </div>
      </section>

      <section className="border-b border-[#e6e6e6] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div><span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">شروع سریع</span><h2 className="mt-2 text-xl font-black text-[#242424]">دسته‌های محبوب</h2></div>
            <Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه دسته‌ها ←</Link>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-3">
            {quickCategories.map((category) => (
              <Link key={category.id} href={"/category/" + category.slug + cityQuery} className="group flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-[#fff5f6]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f7f7f7] text-[#ef4056] transition group-hover:bg-[#fff0f3] group-hover:scale-105"><CategoryIcon slug={category.slug} className="beeroon-icon" /></span>
                <span className="mt-2 w-full truncate text-center text-[10px] font-bold text-[#555] group-hover:text-[#ef4056]">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="guide" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-2xl border border-[#e4e4e4] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div><span className="text-[10px] font-black text-[#ef4056]">بر اساس چیزی که می‌خواهی</span><h2 className="mt-2 text-xl font-black text-[#242424]">دنبال چی می‌گردی؟</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff4d9] text-xl text-[#b27d10]">✦</span></div>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {moodLinks.map(([label, slug, description]) => (
                <Link key={slug} href={"/category/" + slug + cityQuery} className="rounded-xl border border-[#ededed] bg-[#fff] p-3 transition hover:-translate-y-0.5 hover:border-[#ef4056]/40 hover:bg-[#fff8f9]">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff0f3] text-[#ef4056]"><CategoryIcon slug={slug} className="h-5 w-5" /></span>
                  <span className="mt-2 block text-xs font-bold text-[#444]">{label}</span>
                  <span className="mt-1 block text-[10px] text-[#999]">{description}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-[#3b3b3b] p-6 text-white">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#ef4056]/40 blur-2xl" />
            <div className="relative"><span className="text-[10px] font-bold text-white/65">راهنمای شهر</span><h2 className="mt-2 text-xl font-black">آدرس‌های مرتبط، یک‌جا</h2><p className="mt-4 text-xs leading-7 text-white/70">دسته و تخصصت را انتخاب کن تا قبل از راه افتادن، گزینه‌های همان زمینه را ببینی.</p><Link href={"/search" + cityQuery} className="mt-5 inline-flex rounded-xl bg-[#ffd166] px-4 py-2.5 text-xs font-black text-[#42202a] transition hover:bg-[#ffdc86]">شروع جست‌وجو ←</Link></div>
          </div>
        </div>
      </section>

      <CategoryExplorer categories={categories} subcategories={subcategories} citySlug={city.slug} />

      {featured.length > 0 && (
        <section id="featured" className="border-b border-[#e6e6e6] bg-[#f7f7f7]">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between"><div><span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">پیشنهادهای بیرون</span><h2 className="mt-2 text-2xl font-black text-[#242424]">کسب‌وکارهای منتخب</h2></div><Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه را ببین ←</Link></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} />)}</div>
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">برای صاحبان کسب‌وکار</span>
          <h2 className="mt-3 text-2xl font-black text-[#242424]">کسب‌وکارت را به شهر معرفی کن.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#777]">پروفایلت را ثبت کن تا مشتری‌ها آدرس، تلفن و راه‌های ارتباطی‌ات را یک‌جا پیدا کنند.</p>
          <div className="mt-6 flex justify-center gap-3"><Link href={"/register-business" + cityQuery} className="rounded-xl bg-[#ef4056] px-5 py-3 text-sm font-black text-white transition hover:bg-[#d92f47]">ثبت کسب‌وکار</Link><Link href={"/register-online-shop" + cityQuery} className="rounded-xl border border-[#e1e1e1] px-5 py-3 text-sm font-bold text-[#555] transition hover:border-[#ef4056] hover:text-[#ef4056]">ثبت آنلاین‌شاپ</Link></div>
        </div>
      </section>
    </div>
  );
}