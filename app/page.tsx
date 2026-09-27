import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import BusinessCard from "@/components/BusinessCard";
import CategoryIcon from "@/components/CategoryIcon";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

const quick = [
  ["food", "کافه و غذا"], ["shopping", "فروشگاه"], ["education", "آموزش"], ["business", "خدمات"],
];

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2 20 6v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6z" /><path d="m9 12 2 2 4-4" /></svg>;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string | string[] }> }) {
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug }), getCityBySlug(citySlug)]);
  const cityQuery = "?city=" + encodeURIComponent(city.slug);
  const categoryBySlug = new Map(categories.map((item) => [item.slug, item]));
  const nearby = businesses.slice(0, 5);

  return (
    <div className="sample-container">
      <section className="flex items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          {quick.map(([slug, label]) => {
            const category = categoryBySlug.get(slug);
            return category ? <Link key={slug} href={"/category/" + slug + cityQuery} className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-[15px] border border-[#f0e9ea] bg-[#fdfaf9] text-[#c91442]"><CategoryIcon slug={slug} className="h-[21px] w-[21px]" /></span>
              <span className="text-[10px] font-semibold text-[#4d4a53]">{label}</span>
            </Link> : null;
          })}
          <Link href={"/search" + cityQuery} className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-[15px] border border-[#f0e9ea] bg-[#fdfaf9] text-[#c91442] text-xl">⋮⋮</span>
            <span className="text-[10px] font-semibold text-[#4d4a53]">همه</span>
          </Link>
        </div>
      </section>

      <section className="my-[18px] flex items-center gap-3 rounded-[18px] border border-[#f0e9ea] bg-[#fdfaf9] px-[18px] py-4">
        <div><div className="text-[19px] font-extrabold text-[#c91442]">{businesses.length.toLocaleString("fa-IR")}+</div><div className="mt-0.5 text-[10.5px] text-[#8f8283]">کسب‌وکار فعال</div></div>
        <div className="w-px self-stretch bg-[#f0e9ea]" />
        <div><div className="text-[19px] font-extrabold text-[#c91442]">{categories.length.toLocaleString("fa-IR")}</div><div className="mt-0.5 text-[10.5px] text-[#8f8283]">دسته‌بندی</div></div>
        <div className="w-px self-stretch bg-[#f0e9ea]" />
        <div><div className="text-[19px] font-extrabold text-[#c91442]">۱</div><div className="mt-0.5 text-[10.5px] text-[#8f8283]">شهر؛ به‌زودی بیشتر</div></div>
      </section>

      <div className="sample-trust"><ShieldIcon />ترتیب نمایش کسب‌وکارها بر اساس نزدیکی یا تصادفی‌ست — هیچ‌کس با پرداخت بیشتر، بالاتر نمی‌ره.</div>

      <section className="sample-section">
        <div className="sample-section-head"><h2>نزدیک تو</h2><Link href={"/search" + cityQuery}>مشاهده همه</Link></div>
        <div className="sample-chip-row">
          <Link href={"/" + cityQuery + "#featured"} className="sample-chip active">همه</Link>
          {quick.map(([slug, label]) => <Link key={slug} href={"/category/" + slug + cityQuery} className="sample-chip">{label}</Link>)}
        </div>
        <div className="mt-1">
          {nearby.length > 0 ? nearby.map((business) => <BusinessCard key={business.id} b={business} />) : <p className="py-8 text-center text-xs text-[#8f8283]">هنوز کسب‌وکاری در این شهر ثبت نشده.</p>}
        </div>
      </section>

      <CategoryExplorer categories={categories} subcategories={subcategories} citySlug={city.slug} />

      <section className="sample-cta">
        <div><div className="sample-cta-title">کسب‌وکارت رو ثبت کن</div><div className="sample-cta-description">آدرس، تلفن و ساعت کاری‌ت رو به مشتری‌های شهرت نشون بده</div></div>
        <Link href={"/register-business" + cityQuery} className="sample-primary px-3.5 py-2 text-[11px]">شروع کن</Link>
      </section>
    </div>
  );
}