import Link from "next/link";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

export const metadata = { title: "جست‌وجو | بیرون", description: "کسب‌وکارها و تخصص‌های شهر را در بیرون جست‌وجو کن." };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; city?: string | string[] }> }) {
  const params = await searchParams;
  const query = (typeof params.q === "string" ? params.q : "").trim();
  const citySlug = typeof params.city === "string" ? params.city : DEFAULT_CITY_SLUG;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug }), getCityBySlug(citySlug)]);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const subcategoryById = new Map(subcategories.map((subcategory) => [subcategory.id, subcategory]));
  const normalized = query.toLocaleLowerCase("fa");
  const results = normalized ? businesses.filter((business) => [business.name, business.address, categoryById.get(business.category_id)?.name, business.subcategory_id ? subcategoryById.get(business.subcategory_id)?.name : ""].filter(Boolean).some((value) => value!.toLocaleLowerCase("fa").includes(normalized))) : [];
  const cityQuery = "?city=" + encodeURIComponent(city.slug);

  return (
    <div className="sample-container min-h-screen pb-6">
      <div className="py-5"><h1 className="text-[17px] font-extrabold">جست‌وجو</h1><p className="mt-1 text-[11px] text-[#8f8283]">اسم کسب‌وکار، دسته یا تخصص را در {city.name} پیدا کن.</p></div>
      <form action="/search" method="get" className="flex items-center gap-2.5 rounded-[13px] border-[1.4px] border-[#f0e9ea] px-[15px] py-3 text-xs text-[#c91442]">
        <span className="text-xl">⌕</span><input type="hidden" name="city" value={city.slug} /><input name="q" defaultValue={query} autoFocus={!query} placeholder="مثلاً کافه دنج نزدیک من" className="min-w-0 flex-1 bg-transparent text-[#241b1c] outline-none placeholder:text-[#8f8283]" /><button className="text-[11px] font-extrabold text-[#c91442]">جست‌وجو</button>
      </form>
      {query ? <section className="mt-6"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-extrabold">برای «{query}»</h2><span className="text-[11px] text-[#8f8283]">{results.length} نتیجه در {city.name}</span></div>{results.length ? <div className="sample-grid-md">{results.map((business) => <BusinessCard key={business.id} b={business} categoryName={categoryById.get(business.category_id)?.name} />)}</div> : <div className="my-5 rounded-2xl border border-dashed border-[#e5cbd2] bg-[#fffafb] px-5 py-12 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-2xl text-[#d51f4f]">⌕</div>
            <h3 className="mt-4 text-sm font-black text-[#32162d]">نتیجه‌ای پیدا نشد</h3>
            <p className="mt-2 text-xs leading-6 text-[#8f8283]">عبارت دیگری را امتحان کن یا اولین کسب‌وکار این دسته را ثبت کن.</p>
            <Link href={"/register-business" + cityQuery} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-4 py-2.5 text-xs font-black text-white">ثبت کسب‌وکار</Link>
          </div>}</section> : <section className="sample-section"><div className="sample-section-head"><h2>شروع از یک دسته</h2><Link href={"/" + cityQuery + "#directory"}>همه دسته‌ها</Link></div><div className="sample-chip-row">{categories.slice(0, 16).map((category) => <Link key={category.id} href={"/category/" + category.slug + cityQuery} className="sample-chip">{category.name}</Link>)}</div></section>}
    </div>
  );
}