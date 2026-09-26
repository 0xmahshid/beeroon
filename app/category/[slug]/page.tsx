import Link from "next/link";
import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import BusinessCard from "@/components/BusinessCard";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug })]);
  const category = categories.find((item) => item.slug === slug);

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link href="/" className="text-xs font-black text-[#9a898d] transition hover:text-[#ed0b55]">← بازگشت به کشف</Link>
        <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-[#f0dfe2] bg-gradient-to-br from-[#fff0f3] via-white to-[#fff7e7] p-6 sm:p-9">
          <div className="pointer-events-none absolute -left-12 -top-20 h-64 w-64 rounded-full bg-[#ffb6c5]/25 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><span className="text-[10px] font-black tracking-[0.2em] text-[#ed0b55]">BROWSE CATEGORY</span><h1 className="mt-3 text-3xl font-black text-[#30252a] sm:text-4xl">{category?.name || "دسته‌بندی"}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#837276]">تخصص موردنظرت را انتخاب کن و کسب‌وکارهای مرتبط همین شهر را ببین.</p></div>
            <div className="beeroon-tile grid h-20 w-20 shrink-0 place-items-center rounded-[1.7rem] bg-gradient-to-br from-[#ffdae3] to-white text-4xl text-[#d4134e]">✦</div>
          </div>
          <div className="relative mt-7 flex gap-2 overflow-x-auto pb-1">{subcategories.map((item) => <Link key={item.id} href={`/category/${slug}/${item.slug}`} className="shrink-0 rounded-xl border border-[#eadfe2] bg-white px-3 py-2 text-xs font-bold text-[#66565b] transition hover:border-[#ed0b55]/40 hover:text-[#ed0b55]">{item.name}</Link>)}</div>
        </section>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="text-[10px] font-black tracking-[0.2em] text-[#ed0b55]">LOCAL BUSINESSES</span><h2 className="mt-2 text-2xl font-black text-[#382d32]">کسب‌وکارهای این دسته</h2></div><span className="rounded-full bg-[#fff0f3] px-4 py-2 text-xs font-black text-[#c70d46]">{businesses.length} نتیجه</span></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{businesses.map((business) => <BusinessCard key={business.id} b={business} />)}{businesses.length === 0 && <div className="col-span-full rounded-[1.7rem] border border-dashed border-[#d8c8c2] bg-white py-16 text-center"><p className="font-black text-[#3b2d2e]">هنوز کسب‌وکاری در این دسته ثبت نشده.</p><p className="mt-2 text-sm text-[#8a7b79]">اولین کسب‌وکار این دسته باش.</p><Link href="/register-business" className="mt-5 inline-flex rounded-xl bg-[#ed0b55] px-5 py-3 text-sm font-black text-white">ثبت کسب‌وکار</Link></div>}</div>
      </div>
    </div>
  );
}