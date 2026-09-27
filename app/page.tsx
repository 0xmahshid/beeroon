import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

const quickSlugs = ["food", "shopping", "education", "business"];

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string | string[] }> }) {
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug }), getCityBySlug(citySlug)]);
  const cityQuery = "?city=" + encodeURIComponent(city.slug);
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const featured = businesses.slice(0, 8);

  return (
    <div className="beeroon-shell min-h-screen">
      <section className="beeroon-hero relative overflow-hidden text-white">
        <div className="beeroon-hero-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <span className="beeroon-pill border border-white/20 bg-white/10 text-[#ffe0e7]">راهنمای محلی بیرون · {city.name}</span>
            <h1 className="mt-5 max-w-2xl text-3xl font-black leading-[1.55] sm:text-5xl">قبل از بیرون رفتن،<br /><span className="text-[#ffd36e]">جای درست را پیدا کن.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-white/75 sm:text-base">کافه، فروشگاه، متخصص یا هر خدمت محلی که لازم داری؛ بیرون کمک می‌کند سریع پیدا کنی، مقایسه کنی و بعد راه بیفتی.</p>
            <form action="/search" method="get" className="mt-7 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_20px_45px_-25px_rgba(20,0,15,.8)]">
              <span className="px-2 text-2xl text-[#8c7d84]">⌕</span><input type="hidden" name="city" value={city.slug} /><input name="q" placeholder="مثلاً کافه دنج، تعمیر موبایل، گل‌فروشی..." className="min-w-0 flex-1 bg-transparent py-3 text-xs text-[#32162d] outline-none placeholder:text-[#a8989e] sm:text-sm" /><button className="shrink-0 rounded-xl bg-[#d51f4f] px-4 py-3 text-xs font-black text-white transition hover:bg-[#b91640] sm:px-6">جست‌وجو</button>
            </form>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-white/65"><span>✓ اطلاعات تماس واقعی</span><span>✓ دسته‌بندی روشن</span><span>✓ انتخاب بدون تبلیغ اجباری</span></div>
          </div>
          <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-bold text-white/70"><span>دنبال چی می‌گردی؟</span><span className="rounded-full bg-white/10 px-3 py-1">{city.name}</span></div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quickSlugs.map((slug) => {
                const category = categoryMap.get(slug);
                return category ? <Link key={slug} href={"/category/" + slug + cityQuery} className="group rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/20"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-[#ffd36e]"><CategoryIcon slug={slug} className="h-7 w-7" /></span><strong className="mt-3 block text-sm">{category.name}</strong><span className="mt-1 block text-[10px] text-white/60">مشاهده گزینه‌ها ←</span></Link> : null;
              })}
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4 text-[#32162d]"><span className="text-[10px] font-bold text-[#d51f4f]">انتخاب سریع</span><p className="mt-1 text-sm font-black">موضوعت را از دسته‌بندی‌ها انتخاب کن.</p><Link href="#directory" className="mt-3 inline-flex text-[10px] font-black text-[#d51f4f]">دیدن همه دسته‌ها ←</Link></div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eadfe3] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-4 py-4 sm:px-6 lg:px-8"><div className="rounded-xl bg-[#fff4f6] px-3 py-3 text-center"><strong className="block text-sm font-black text-[#d51f4f]">{businesses.length.toLocaleString("fa-IR")}+</strong><span className="mt-1 block text-[10px] text-[#9e7781]">کسب‌وکار قابل کشف</span></div><div className="rounded-xl bg-[#f2faf7] px-3 py-3 text-center"><strong className="block text-sm font-black text-[#238873]">{categories.length.toLocaleString("fa-IR")}</strong><span className="mt-1 block text-[10px] text-[#70988e]">دسته برای شروع</span></div><div className="rounded-xl bg-[#fff9e9] px-3 py-3 text-center"><strong className="block text-sm font-black text-[#a57917]">رایگان</strong><span className="mt-1 block text-[10px] text-[#a5946a]">برای پیدا کردن</span></div></div>
      </section>

      <CategoryExplorer categories={categories} subcategories={subcategories} citySlug={city.slug} />

      <section id="featured" className="border-b border-[#eadfe3] bg-[#fcf8f7]"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><span className="beeroon-section-label">پیشنهادهای نزدیک</span><h2 className="mt-2 text-2xl font-black text-[#32162d]">کسب‌وکارهای منتخب</h2><p className="mt-2 text-xs text-[#8b7b84]">هر کارت اطلاعات خودش را دارد؛ سریع مقایسه کن و انتخاب کن.</p></div><Link href={"/search" + cityQuery} className="text-xs font-black text-[#d51f4f]">مشاهده همه ←</Link></div>{featured.length > 0 ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} categoryName={categories.find((item) => item.id === business.category_id)?.name} />)}</div> : <div className="mt-7 rounded-2xl border border-dashed border-[#e1cbd2] bg-white px-5 py-10 text-center"><p className="text-sm font-black text-[#32162d]">اولین انتخاب‌های این شهر به‌زودی اینجا دیده می‌شوند.</p><p className="mt-2 text-xs text-[#8b7b84]">اگر صاحب کسب‌وکاری، پروفایلش را همین حالا ثبت کن.</p><Link href={"/register-business" + cityQuery} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-5 py-3 text-xs font-black text-white">ثبت کسب‌وکار</Link></div>}</div></section>

      <section className="bg-white"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6"><span className="beeroon-section-label">برای صاحب کسب‌وکار</span><h2 className="mt-3 text-2xl font-black text-[#32162d]">کسب‌وکارت را به آدم‌های درست نشان بده.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#81717a]">پروفایل خودت را بساز تا آدرس، تلفن و راه‌های ارتباطی‌ات مرتب و قابل پیدا کردن باشد.</p><Link href={"/register-business" + cityQuery} className="mt-6 inline-flex rounded-xl bg-[#d51f4f] px-6 py-3 text-sm font-black text-white transition hover:bg-[#b91640]">ثبت کسب‌وکار</Link></div></section>
    </div>
  );
}