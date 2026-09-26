import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import { Business, Category, Subcategory } from "@/lib/types";

type Props = {
  slug: string;
  sub?: string;
  category?: Category;
  selected?: Subcategory;
  subcategories: Subcategory[];
  businesses: Business[];
};

export default function CategoryResults({ slug, sub, category, selected, subcategories, businesses }: Props) {
  const categoryName = category?.name || "دسته‌بندی";
  const iconSlug = category?.slug || slug;
  const isSubcategory = Boolean(sub && selected);
  const activeSlug = selected?.slug || "__all__";
  const title = selected?.name || categoryName;
  const eyebrow = isSubcategory ? "تخصص انتخاب‌شده" : "دسته‌بندی";
  const description = isSubcategory ? "گزینه‌های مرتبط با این تخصص را نزدیک و مرتب پیدا کن." : "کسب‌وکارهای واقعی این حوزه را نزدیک و مرتب ببین.";

  return (
    <div className="min-h-screen bg-[#fcf7f8]">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center justify-between"><Link href={isSubcategory ? "/category/" + slug : "/"} className="inline-flex items-center gap-2 rounded-xl border border-[#eadfe2] bg-white px-3 py-2 text-xs font-bold text-[#6f5c64] shadow-[0_8px_18px_-18px_rgba(70,20,38,.5)] transition hover:border-[#ef4056] hover:text-[#ef4056]">← <span>{isSubcategory ? "بازگشت به " + categoryName : "بازگشت به خانه"}</span></Link><span className="hidden text-[11px] font-bold text-[#a18e95] sm:block">بیرون / {categoryName}</span></div>

        <section className="category-hero relative mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3d1833] via-[#762348] to-[#ef4056] p-5 text-white shadow-[0_20px_45px_-28px_rgba(61,24,51,.8)] sm:mt-6 sm:p-7"><div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#ffd36e]/20 blur-3xl" /><div className="absolute -bottom-24 right-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" /><div className="relative flex items-start justify-between gap-4"><div className="min-w-0"><span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black text-[#ffe0e6]">{eyebrow}</span><h1 className="mt-4 text-2xl font-black leading-[1.5] sm:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-xs leading-7 text-[#f8dce2] sm:text-sm">{description}</p></div><div className="grid h-[4.5rem] w-[4.5rem] shrink-0 place-items-center rounded-[1.5rem] border border-white/20 bg-white/15 text-[#ffd36e] shadow-[0_12px_25px_-18px_rgba(0,0,0,.6)] backdrop-blur-sm sm:h-24 sm:w-24"><CategoryIcon slug={iconSlug} className="h-12 w-12 sm:h-14 sm:w-14" /></div></div><div className="relative mt-6 grid grid-cols-2 gap-2 sm:max-w-md"><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"><span className="block text-[10px] font-bold text-[#ffdce4]">نتیجه‌های این بخش</span><strong className="mt-1 block text-lg font-black text-white">{businesses.length}</strong></div><div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"><span className="block text-[10px] font-bold text-[#ffdce4]">تخصص‌های قابل انتخاب</span><strong className="mt-1 block text-lg font-black text-white">{subcategories.length}</strong></div></div></section>

        <section className="mt-4 rounded-[1.5rem] border border-[#f0dfe3] bg-white p-3 shadow-[0_12px_28px_-26px_rgba(111,35,50,.55)] sm:mt-5 sm:p-4"><div className="flex items-center justify-between px-1"><div><span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">انتخاب تخصص</span><h2 className="mt-1 text-sm font-black text-[#3d1833]">از اینجا دقیق‌تر انتخاب کن</h2></div><span className="rounded-full bg-[#fff1f4] px-2.5 py-1 text-[10px] font-bold text-[#d9364b]">{subcategories.length} مورد</span></div><div className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{<Link href={"/category/" + slug} className={"shrink-0 snap-start rounded-xl px-4 py-2.5 text-xs font-black transition " + (activeSlug === "__all__" ? "bg-[#ef4056] text-white shadow-[0_8px_16px_-12px_rgba(239,64,86,.8)]" : "border border-[#eadfe2] bg-white text-[#6f5c64] hover:border-[#ef4056] hover:text-[#ef4056]")}>همه</Link>}{subcategories.map((item) => <Link key={item.id} href={"/category/" + slug + "/" + item.slug} className={"shrink-0 snap-start rounded-xl px-4 py-2.5 text-xs font-bold transition " + (activeSlug === item.slug ? "bg-[#ef4056] text-white shadow-[0_8px_16px_-12px_rgba(239,64,86,.8)]" : "border border-[#eadfe2] bg-white text-[#6f5c64] hover:border-[#ef4056] hover:text-[#ef4056]")}>{item.name}</Link>)}</div></section>

        <section className="mt-5 sm:mt-6"><div className="mb-3 flex items-end justify-between"><div><span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">فهرست کسب‌وکارها</span><h2 className="mt-1 text-xl font-black text-[#3d1833]">{businesses.length > 0 ? "پیشنهادهای این بخش" : "هنوز گزینه‌ای اینجا نیست"}</h2></div><span className="rounded-full border border-[#eadfe2] bg-white px-3 py-1.5 text-[10px] font-bold text-[#87737b]">{businesses.length} نتیجه</span></div>{businesses.length > 0 ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{businesses.map((business) => <BusinessCard key={business.id} b={business} />)}</div> : <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-[#e6cbd2] bg-white px-5 py-10 text-center shadow-[0_12px_28px_-26px_rgba(111,35,50,.5)] sm:py-14"><div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#fff0f3]" /><div className="relative mx-auto max-w-md"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#ffe8ee] to-[#fff5df] text-[#ef4056]"><CategoryIcon slug={iconSlug} className="h-9 w-9" /></div><h3 className="mt-5 text-base font-black text-[#3d1833]">هنوز کسب‌وکاری در {isSubcategory ? "این تخصص" : "این دسته"} ثبت نشده.</h3><p className="mt-2 text-xs leading-7 text-[#87737b]">اگر کسب‌وکاری را می‌شناسی، کمک کن تا این بخش برای بقیه هم مفیدتر شود.</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Link href="/register-business" className="rounded-xl bg-[#ef4056] px-5 py-3 text-xs font-black text-white transition hover:bg-[#d9364b]">ثبت کسب‌وکار</Link><Link href="/" className="rounded-xl border border-[#eadfe2] bg-white px-5 py-3 text-xs font-bold text-[#6f5c64] transition hover:border-[#ef4056] hover:text-[#ef4056]">بازگشت به کشف دسته‌ها</Link></div></div></div>}</section>
      </div>
    </div>
  );
}
