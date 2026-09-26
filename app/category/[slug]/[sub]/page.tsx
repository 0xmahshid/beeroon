import Link from "next/link";
import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import BusinessCard from "@/components/BusinessCard";

export default async function SubcategoryPage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, subcategorySlug: sub })]);
  const category = categories.find((item) => item.slug === slug);
  const selected = subcategories.find((item) => item.slug === sub);
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/category/${slug}" className="text-xs font-bold text-[#71717a] hover:text-[#ef4056]">← بازگشت</Link>
        <div className="mt-5 rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="text-[10px] font-bold text-[#ef4056]">تخصص انتخاب‌شده</span><h1 className="mt-2 text-2xl font-black text-[#27272a] sm:text-3xl">{selected?.name || "کسب‌وکارهای محلی"}</h1><p className="mt-2 text-sm text-[#71717a]">کسب‌وکارهای مرتبط را ساده و مرتب پیدا کن.</p></div>
            <span className="rounded-lg bg-[#fff0f2] px-3 py-2 text-xs font-bold text-[#d9364b]">{businesses.length} نتیجه</span>
          </div>
          <div className="mt-6 flex gap-2 overflow-x-auto border-t border-[#f4f4f5] pt-4">
            <Link href={"/category/" + slug} className="shrink-0 rounded-lg border border-[#e4e4e7] bg-white text-[#52525b] px-3 py-2 text-xs font-bold">همه</Link>
            {subcategories.map((item) => <Link key={item.id} href={"/category/" + slug + "/" + item.slug} className={"shrink-0 rounded-lg px-3 py-2 text-xs font-bold " + (item.slug === sub ? "bg-[#ef4056] text-white" : "border border-[#e4e4e7] bg-white text-[#52525b]")}>{item.name}</Link>)}
          </div>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[220px_1fr]">
          <aside className="hidden h-fit rounded-2xl border border-[#e4e4e7] bg-white p-4 lg:block"><h2 className="text-sm font-black text-[#27272a]">فیلترها</h2><div className="mt-4 border-t border-[#f4f4f5] pt-4"><p className="text-xs font-bold text-[#52525b]">نوع کسب‌وکار</p><label className="mt-3 flex items-center gap-2 text-xs text-[#71717a]"><input type="checkbox" className="accent-[#ef4056]" /> حضوری</label><label className="mt-3 flex items-center gap-2 text-xs text-[#71717a]"><input type="checkbox" className="accent-[#ef4056]" /> آنلاین‌شاپ</label></div><div className="mt-5 border-t border-[#f4f4f5] pt-4"><p className="text-xs font-bold text-[#52525b]">محدوده</p><p className="mt-2 text-[11px] text-[#a1a1aa]">فعلاً بر اساس شهر مشهد</p></div></aside>
          <main><div className="mb-4 flex items-center justify-between rounded-xl border border-[#e4e4e7] bg-white px-4 py-3"><span className="text-xs text-[#71717a]">مرتب‌سازی بر اساس</span><select className="rounded-lg border-0 bg-transparent text-xs font-bold text-[#3f3f46] outline-none"><option>مرتبط‌ترین</option><option>جدیدترین</option><option>نزدیک‌ترین</option></select></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{businesses.map((business) => <BusinessCard key={business.id} b={business} />)}{businesses.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-[#d4d4d8] bg-white py-16 text-center"><p className="font-bold text-[#3f3f46]">هنوز کسب‌وکاری در این دسته ثبت نشده.</p><Link href="/register-business" className="mt-5 inline-flex rounded-xl bg-[#ef4056] px-5 py-3 text-xs font-bold text-white">ثبت کسب‌وکار</Link></div>}</div></main>
        </div>
      </div>
    </div>
  );
}