import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { getNeighborhoodBySlug } from "@/lib/neighborhoods";

const popularSlugs = ["food", "shopping", "fashion", "beauty", "health", "education", "home", "technical"];

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string | string[]; neighborhood?: string | string[] }> }) {
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const neighborhoodSlug = typeof query.neighborhood === "string" ? query.neighborhood : undefined;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug, neighborhoodSlug }), getCityBySlug(citySlug)]);
  const neighborhood = getNeighborhoodBySlug(city.slug, neighborhoodSlug);
  const cityQuery = "?city=" + encodeURIComponent(city.slug) + (neighborhood ? "&neighborhood=" + encodeURIComponent(neighborhood.slug) : "");
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const popularCategories = popularSlugs.flatMap((slug) => {
    const category = categoryMap.get(slug);
    return category ? [category] : [];
  });
  const featured = businesses.slice(0, 4);
  const quickSearches = ["کافه", "رستوران", "آرایشگاه", "تعمیرات موبایل"];

  return (
    <div className="beeroon-shell min-h-screen bg-[#f7f8fa]">
      <section className="border-b border-[#e8eaee] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 md:py-12 lg:grid-cols-[1fr_340px] lg:items-center lg:px-8">
          <div className="max-w-3xl"><img src="/beeroon-logo.png" alt="نشان بیرون" className="mb-5 h-16 w-16 rounded-2xl object-cover shadow-[0_10px_24px_rgba(213,31,79,.18)]" />
            <span className="inline-flex rounded-full bg-[#fff0f3] px-3 py-1.5 text-[10px] font-black text-[#d51f4f]">قبل از بیرون زدن، بیرون رو چک کن.</span>
            <h1 className="mt-4 text-3xl font-black leading-[1.55] tracking-tight text-[#25252a] sm:text-5xl">هر چیزی لازم داری،<br /><span className="text-[#d51f4f]">از بیرون پیدا کن.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#69707b] sm:text-base">کسب‌وکارهای واقعی {neighborhood ? neighborhood.name + "، " : ""}{city.name} را پیدا کن، مقایسه کن و با خیال راحت انتخاب کن.</p>
            <form action="/search" method="get" role="search" className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-[#dfe2e7] bg-white p-1.5 shadow-[0_12px_28px_rgba(32,35,42,.08)] focus-within:border-[#e0a0af]">
              <span className="px-2 text-2xl leading-none text-[#9097a3]">⌕</span>
              <input type="hidden" name="city" value={city.slug} />{neighborhood && <input type="hidden" name="neighborhood" value={neighborhood.slug} />}
              <input name="q" placeholder="دنبال چه چیزی می‌گردی؟" className="min-w-0 flex-1 bg-transparent py-3 text-xs text-[#25252a] outline-none placeholder:text-[#9ba1aa] sm:text-sm" />
              <button className="shrink-0 rounded-xl bg-[#d51f4f] px-4 py-3 text-xs font-black text-white transition hover:bg-[#b91640] sm:px-7">جست‌وجو</button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[#858c96]">
              <span className="font-bold">جست‌وجوی سریع:</span>
              {quickSearches.map((term) => <Link key={term} href={"/search?q=" + encodeURIComponent(term) + "&city=" + encodeURIComponent(city.slug)} className="rounded-full border border-[#e3e6eb] bg-[#fbfbfc] px-3 py-1.5 transition hover:border-[#e0a0af] hover:text-[#d51f4f]">{term}</Link>)}
            </div>
          </div>
          <aside className="hidden rounded-3xl border border-[#e8eaee] bg-[#fbfbfc] p-5 lg:block">
            <div className="flex items-center justify-between border-b border-[#e8eaee] pb-4">
              <div><p className="text-[10px] font-bold text-[#9097a3]">امروز در</p><h2 className="mt-1 text-lg font-black text-[#25252a]">{neighborhood ? neighborhood.name : city.name}</h2></div>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f3] text-xl text-[#d51f4f]">⌖</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#e8eaee] pt-5 text-center">
              <div><strong className="block text-lg font-black text-[#25252a]">{businesses.length.toLocaleString("fa-IR")}</strong><span className="mt-1 block text-[9px] text-[#858c96]">کسب‌وکار</span></div>
              <div><strong className="block text-lg font-black text-[#25252a]">{categories.length.toLocaleString("fa-IR")}</strong><span className="mt-1 block text-[9px] text-[#858c96]">دسته</span></div>
              <div><strong className="block text-lg font-black text-[#d51f4f]">رایگان</strong><span className="mt-1 block text-[9px] text-[#858c96]">برای جست‌وجو</span></div>
            </div>
          </aside>
        </div>
      </section>

      <section id="directory" className="border-b border-[#e8eaee] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><span className="beeroon-section-label">شروع کن</span><h2 className="mt-2 text-xl font-black text-[#25252a] sm:text-2xl">دسته‌های محبوب</h2><p className="mt-1 text-xs text-[#858c96]">برای پیدا کردن جای مناسب، از یک دسته شروع کن.</p></div>
            <Link href={"/search" + cityQuery} className="shrink-0 text-xs font-black text-[#d51f4f]">همه دسته‌ها ←</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
            {popularCategories.map((category) => {
              const count = subcategories.filter((item) => item.category_id === category.id).length;
              return <Link key={category.id} href={"/category/" + category.slug + cityQuery} className="group rounded-2xl border border-[#e8eaee] bg-white px-3 py-4 text-center transition hover:-translate-y-0.5 hover:border-[#e0a0af] hover:shadow-[0_10px_20px_rgba(35,38,45,.07)]">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#fff4f6] text-2xl transition group-hover:bg-[#ffe5eb]"><CategoryIcon slug={category.slug} className="h-6 w-6 text-[#d51f4f]" /></span>
                <strong className="mt-3 block truncate text-[11px] font-black text-[#353942] group-hover:text-[#d51f4f]">{category.name}</strong>
                <span className="mt-1 block text-[9px] text-[#9299a3]">{count ? count.toLocaleString("fa-IR") + " تخصص" : "مشاهده گزینه‌ها"}</span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><span className="beeroon-section-label">انتخاب نزدیک</span><h2 className="mt-2 text-xl font-black text-[#25252a] sm:text-2xl">کسب‌وکارهای منتخب {city.name}</h2><p className="mt-1 text-xs text-[#858c96]">اطلاعات تماس و مسیر هر کسب‌وکار را یک‌جا ببین.</p></div>
            <Link href={"/search" + cityQuery} className="shrink-0 text-xs font-black text-[#d51f4f]">مشاهده همه ←</Link>
          </div>
          {featured.length > 0 ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} categoryName={categories.find((item) => item.id === business.category_id)?.name} />)}</div> : <div className="mt-6 rounded-2xl border border-dashed border-[#decbd1] bg-white px-5 py-12 text-center"><p className="text-sm font-black text-[#25252a]">هنوز انتخابی در این شهر ثبت نشده.</p><p className="mt-2 text-xs text-[#858c96]">اولین کسب‌وکاری باش که در {city.name} دیده می‌شود.</p><Link href={"/register-business" + cityQuery} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-5 py-3 text-xs font-black text-white">ثبت کسب‌وکار</Link></div>}
        </div>
      </section>

      <section className="border-t border-[#e8eaee] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-3xl bg-[#d51f4f] px-6 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div><span className="text-[10px] font-black tracking-wide text-[#ffd5df]">برای صاحبان کسب‌وکار</span><h2 className="mt-2 text-xl font-black">کسب‌وکارت را در جای درست معرفی کن.</h2><p className="mt-2 max-w-xl text-xs leading-6 text-white/65">یک پروفایل مرتب بساز تا مشتری‌ها آدرس، تماس و خدماتت را راحت پیدا کنند.</p></div>
            <Link href={"/register-business" + cityQuery} className="shrink-0 rounded-xl bg-white px-5 py-3 text-center text-xs font-black text-[#d51f4f] transition hover:bg-[#fff0f3]">ثبت کسب‌وکار رایگان</Link>
          </div>
        </div>
      </section>
    </div>
  );
}