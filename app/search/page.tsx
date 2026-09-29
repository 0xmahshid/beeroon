import Link from "next/link";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { getNeighborhoodBySlug } from "@/lib/neighborhoods";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

export const metadata = { title: "جست‌وجو | بیرون", description: "کسب‌وکارها و تخصص‌های شهر را در بیرون جست‌وجو کن." };

type SearchParams = { q?: string | string[]; city?: string | string[]; neighborhood?: string | string[] };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const citySlug = typeof params.city === "string" ? params.city : DEFAULT_CITY_SLUG;
  const neighborhoodSlug = typeof params.neighborhood === "string" ? params.neighborhood : undefined;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug, neighborhoodSlug, query }), getCityBySlug(citySlug)]);
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const subcategoryById = new Map(subcategories.map((item) => [item.id, item]));
  const neighborhood = getNeighborhoodBySlug(city.slug, neighborhoodSlug);
  const placeQuery = "&city=" + encodeURIComponent(city.slug) + (neighborhood ? "&neighborhood=" + encodeURIComponent(neighborhood.slug) : "");

  return (
    <div className="sample-container min-h-screen pb-6">
      <div className="py-5"><h1 className="text-[17px] font-extrabold">جست‌وجو</h1><p className="mt-1 text-[11px] text-[#8f8283]">اسم کسب‌وکار، نیاز یا حوزه فعالیت را در {neighborhood ? neighborhood.name + "، " : ""}{city.name} پیدا کن.</p></div>
      <form action="/search" method="get" className="flex items-center gap-2.5 rounded-[13px] border-[1.4px] border-[#f0e9ea] px-[15px] py-3 text-xs text-[#c91442]"><span className="text-xl">⌕</span><input type="hidden" name="city" value={city.slug} />{neighborhood && <input type="hidden" name="neighborhood" value={neighborhood.slug} />}<input name="q" defaultValue={query} autoFocus={!query} placeholder="مثلاً لوازم اسب‌سواری نزدیک من" className="min-w-0 flex-1 bg-transparent text-[#241b1c] outline-none placeholder:text-[#8f8283]" /><button className="text-[11px] font-extrabold text-[#c91442]">جست‌وجو</button></form>
      {query ? <section className="mt-6"><div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-extrabold">برای «{query}»</h2><span className="text-[11px] text-[#8f8283]">{businesses.length.toLocaleString("fa-IR")} نتیجه</span></div>{businesses.length ? <div className="sample-grid-md">{businesses.map((business) => <BusinessCard key={business.id} b={business} categoryName={subcategoryById.get(business.subcategory_id || "")?.name || categoryById.get(business.category_id)?.name} />)}</div> : <div className="rounded-2xl border border-dashed border-[#e5cbd2] bg-[#fffafb] px-5 py-12 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-2xl text-[#d51f4f]">⌕</div><h3 className="mt-4 text-sm font-black text-[#32162d]">هنوز نتیجه‌ای در این حوالی نداریم</h3><p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#8f8283]">اگر صاحب کسب‌وکاری، آن را ثبت کن تا آدم‌های نزدیکت راحت‌تر پیدایت کنند.</p><Link href={"/register-business?city=" + encodeURIComponent(city.slug)} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-4 py-2.5 text-xs font-black text-white">ثبت کسب‌وکار</Link></div>}</section> : <div className="mt-10 rounded-2xl bg-[#fff6f8] px-5 py-10 text-center"><p className="text-sm font-black text-[#32162d]">دنبال یک نیاز واقعی بگرد</p><p className="mt-2 text-xs leading-6 text-[#8f8283]">نیازت را با زبان خودت بنویس؛ مثل «تعمیرات موبایل» یا «شلوار اسب‌سواری». ما مغازه‌های مرتبط را پیدا می‌کنیم، نه فهرست محصول را.</p></div>}
      {query && <div className="mt-7 flex flex-wrap gap-2 text-[10px] text-[#8f8283]"><span>محل جست‌وجو:</span><span className="rounded-full bg-[#fff0f3] px-3 py-1 text-[#c91442]">{city.name}{neighborhood ? " · " + neighborhood.name : ""}</span><Link href={"/" + "?city=" + encodeURIComponent(city.slug) + (neighborhood ? "&neighborhood=" + encodeURIComponent(neighborhood.slug) : "")} className="rounded-full border border-[#eadfe3] px-3 py-1">تغییر محل</Link></div>}
    </div>
  );
}
