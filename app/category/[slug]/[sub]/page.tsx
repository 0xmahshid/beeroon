import Link from "next/link";
import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import BusinessCard from "@/components/BusinessCard";

export default async function SubcategoryPage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, subcategorySlug: sub })]);
  const category = categories.find((item) => item.slug === slug);
  const selected = subcategories.find((item) => item.slug === sub);

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link href={`/category/${slug}`} className="text-xs font-black text-[#9a898d] transition hover:text-[#ed0b55]">← بازگشت به {category?.name || "دسته"}</Link>
        <section className="mt-6 flex flex-col justify-between gap-5 rounded-[2rem] border border-[#f0dfe2] bg-white p-6 shadow-[0_16px_35px_-30px_rgba(77,30,36,.6)] sm:flex-row sm:items-end sm:p-9">
          <div><span className="text-[10px] font-black tracking-[0.2em] text-[#ed0b55]">LOCAL DISCOVERY</span><h1 className="mt-3 text-3xl font-black text-[#30252a]">{selected?.name || "کسب‌وکارهای محلی"}</h1><p className="mt-2 text-sm leading-7 text-[#837276]">نتیجه‌های مرتبط را پیدا کن؛ بدون رتبه‌بندی پولی و شلوغی اضافه.</p></div>
          <span className="rounded-full bg-[#fff0f3] px-4 py-2 text-xs font-black text-[#c70d46]">{businesses.length} نتیجه</span>
        </section>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{subcategories.map((item) => <Link key={item.id} href={`/category/${slug}/${item.slug}`} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${item.slug === sub ? "bg-[#ed0b55] text-white" : "border border-[#eadfe2] bg-white text-[#66565b] hover:border-[#ed0b55]/40 hover:text-[#ed0b55]"}`}>{item.name}</Link>)}</div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{businesses.map((business) => <BusinessCard key={business.id} b={business} />)}{businesses.length === 0 && <div className="col-span-full rounded-[1.7rem] border border-dashed border-[#d8c8c2] bg-white py-16 text-center"><p className="font-black text-[#3b2d2e]">هنوز نتیجه‌ای برای این تخصص نداریم.</p><Link href="/register-business" className="mt-5 inline-flex rounded-xl bg-[#ed0b55] px-5 py-3 text-sm font-black text-white">ثبت کسب‌وکار</Link></div>}</div>
      </div>
    </div>
  );
}