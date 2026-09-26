import Link from "next/link";
import BusinessCard from "@/components/BusinessCard";
import CategoryIcon from "@/components/CategoryIcon";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

export const metadata = {
  title: "جست‌وجو | بیرون",
  description: "کسب‌وکارها و تخصص‌های شهر را در بیرون جست‌وجو کن.",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; city?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim();
  const citySlug = typeof params.city === "string" ? params.city : DEFAULT_CITY_SLUG;
  const normalized = query.toLocaleLowerCase("fa");
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug }), getCityBySlug(citySlug)]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const subcategoryById = new Map(subcategories.map((subcategory) => [subcategory.id, subcategory]));
  const results = normalized
    ? businesses.filter((business) => {
        const category = categoryById.get(business.category_id);
        const subcategory = business.subcategory_id ? subcategoryById.get(business.subcategory_id) : undefined;
        return [business.name, business.address, category?.name, subcategory?.name]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("fa").includes(normalized));
      })
    : [];

  return (
    <div className="min-h-screen bg-[#fcf7f8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-black tracking-[0.16em] text-[#ef4056]">جست‌وجوی بیرون</span>
          <h1 className="mt-3 text-2xl font-black text-[#3d1833] sm:text-4xl">چی می‌خوای پیدا کنی؟</h1>
           <p className="mt-3 text-sm leading-7 text-[#87737b]">اسم کسب‌وکار، دسته یا تخصص را بنویس تا آدرس‌های مرتبط {city.name} را یک‌جا ببینی.</p>
          <form action="/search" method="get" className="mt-6 flex items-center gap-2 rounded-2xl border border-[#eadfe2] bg-white p-2 shadow-[0_14px_32px_-28px_rgba(111,35,50,.55)]">
            <span className="px-2 text-xl text-[#87737b]">⌕</span>
             <input type="hidden" name="city" value={city.slug} /><input name="q" defaultValue={query} autoFocus={!query} placeholder="مثلاً کافه، طلافروشی، تعمیر موبایل..." className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-[#33212b] outline-none placeholder:text-[#a18e95]" />
            <button type="submit" className="shrink-0 rounded-xl bg-[#ef4056] px-4 py-3 text-xs font-black text-white transition hover:bg-[#d9364b]">جست‌وجو</button>
          </form>
        </div>

        {query ? (
          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">نتیجه‌های جست‌وجو</span>
                <h2 className="mt-2 text-xl font-black text-[#3d1833]">برای «{query}»</h2>
              </div>
              <span className="rounded-full border border-[#eadfe2] bg-white px-3 py-1.5 text-[10px] font-bold text-[#87737b]">{results.length} نتیجه</span>
            </div>
            {results.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((business) => <BusinessCard key={business.id} b={business} />)}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-[#e6cbd2] bg-white px-5 py-14 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#ffe8ee] to-[#fff5df] text-2xl text-[#ef4056]">⌕</div>
                <h3 className="mt-5 text-base font-black text-[#3d1833]">هنوز نتیجه‌ای برای این جست‌وجو نداریم.</h3>
                <p className="mt-2 text-xs leading-7 text-[#87737b]">اسم دسته یا تخصص را کوتاه‌تر یا با عبارت دیگری امتحان کن.</p>
                <Link href={"/?city=" + encodeURIComponent(city.slug) + "#directory"} className="mt-5 inline-flex rounded-xl bg-[#ef4056] px-5 py-3 text-xs font-black text-white transition hover:bg-[#d9364b]">دیدن همه دسته‌ها</Link>
              </div>
            )}
          </section>
        ) : (
          <section className="mt-10">
            <div className="mb-4">
              <span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">شروع از اینجا</span>
              <h2 className="mt-2 text-xl font-black text-[#3d1833]">یک دسته را انتخاب کن</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {categories.slice(0, 16).map((category) => (
                 <Link key={category.id} href={"/category/" + category.slug + "?city=" + encodeURIComponent(city.slug)} className="group flex min-h-[122px] flex-col items-center justify-center rounded-[1.35rem] border border-[#f0e2e5] bg-white px-2 py-4 text-center transition hover:-translate-y-1 hover:border-[#ef4056]/45">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff1f4] text-[#ef4056]"><CategoryIcon slug={category.slug} className="h-7 w-7" /></span>
                  <span className="mt-3 text-[11px] font-black text-[#45343b] group-hover:text-[#ef4056]">{category.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}