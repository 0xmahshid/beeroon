import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getDirectory } from "@/lib/data";

const categoryVisuals: Record<string, { glyph: string; tone: string }> = { food: { glyph: "☕", tone: "from-[#fff1e8] to-[#fffaf7] text-[#c26b36]" }, shopping: { glyph: "🛍️", tone: "from-[#fff0f3] to-[#fffafb] text-[#d33c5a]" }, education: { glyph: "✎", tone: "from-[#eef3ff] to-[#fafbff] text-[#4c6fc7]" }, business: { glyph: "↗", tone: "from-[#fff0f2] to-[#fffafb] text-[#c70d46]" }, beauty: { glyph: "✿", tone: "from-[#fff0f6] to-[#fffafd] text-[#d64975]" }, health: { glyph: "＋", tone: "from-[#e9faf6] to-[#f8fffd] text-[#319a88]" }, home: { glyph: "⌂", tone: "from-[#fff8df] to-[#fffdf4] text-[#ad801f]" }, automotive: { glyph: "▰", tone: "from-[#eff7fa] to-[#fbfdfe] text-[#55717e]" } };
const moodLinks = [["یه قهوه می‌چسبه", "food", "☕", "کافه و غذا"], ["وقت خرید دارم", "shopping", "🛍️", "فروشگاه‌ها"], ["چیزی یاد بگیرم", "education", "✎", "کلاس و آموزش"], ["کارم رو راه بندازم", "business", "↗", "خدمات حرفه‌ای"]];

export default async function Home() {
  const [{ categories, subcategories }, businesses] = await Promise.all([getDirectory(), getBusinesses({})]);
  const featured = businesses.slice(0, 8);
  const quickCategories = categories.slice(0, 8);
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <section className="border-b border-[#e4e4e7] bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:py-12">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-bold text-[#ef4056]">کشف کسب‌وکارهای خوب همین نزدیکی</span>
            <h1 className="mt-4 text-3xl font-black leading-[1.45] text-[#27272a] sm:text-5xl">خوبِ نزدیکت را<br /><span className="text-[#ef4056]">پیدا کن و بیرون بزن.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#71717a]">از یک کافه‌ی دنج تا یک متخصص قابل‌اعتماد؛ همه‌چیز را ساده، مرتب و نزدیک پیدا کن.</p>
            <Link href="#directory" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ef4056] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#d9364b]">شروع جست‌وجو <span>←</span></Link>
          </div>
          <div className="order-1 overflow-hidden rounded-2xl bg-[#fff0f2] lg:order-2">
            <div className="flex min-h-[250px] items-center justify-center bg-gradient-to-br from-[#fff0f2] via-[#fff8f8] to-[#ffe4e8] p-8">
              <div className="text-center">
                <img src="/beeroon-mark.svg" alt="لوگوی بیرون" className="mx-auto h-40 w-40 object-contain" />
                <p className="mt-4 text-sm font-black text-[#d9364b]">هر چیزی، همین نزدیکی‌ها ✦</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-[#e4e4e7] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-black text-[#27272a]">دسته‌های محبوب</h2><p className="mt-1 text-xs text-[#71717a]">برای شروع یکی را انتخاب کن.</p></div><Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه دسته‌ها ←</Link></div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {quickCategories.map((category) => { const visual = categoryVisuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f5f5f5] to-white text-[#ef4056]" }; return <Link key={category.id} href={`/category/${category.slug}`} className="group flex min-w-0 flex-col items-center rounded-xl p-2 transition hover:bg-[#fff5f6]"><span className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br text-2xl ${visual.tone}`}>{visual.glyph}</span><span className="mt-2 w-full truncate text-center text-[11px] font-bold text-[#52525b] group-hover:text-[#ef4056]">{category.name}</span></Link>; })}
          </div>
        </div>
      </section>
      <section id="nearby" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><div><span className="text-[10px] font-bold text-[#ef4056]">بر اساس حال امروزت</span><h2 className="mt-2 text-xl font-black text-[#27272a]">امروز دلت چی می‌خواد؟</h2></div><span className="text-2xl text-[#ef4056]">✦</span></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{moodLinks.map(([label, slug, glyph, description]) => <Link key={slug} href={`/category/${slug}`} className="rounded-xl border border-[#f0f0f1] p-3 transition hover:border-[#ef4056]/40 hover:bg-[#fffafa]"><span className="text-xl">{glyph}</span><span className="mt-2 block text-xs font-bold text-[#3f3f46]">{label}</span><span className="mt-1 block text-[10px] text-[#a1a1aa]">{description}</span></Link>)}</div></div>
          <div className="rounded-2xl bg-[#3f3f46] p-6 text-white"><span className="text-[10px] font-bold text-[#fbc5cd]">نزدیک تو</span><h2 className="mt-2 text-xl font-black">همین نزدیکی‌ها</h2><p className="mt-4 text-xs leading-7 text-[#d4d4d8]">موقعیتت را انتخاب کن تا گزینه‌های نزدیک و باز را ببینی.</p><Link href="#directory" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#3f3f46]">دیدن اطراف من ←</Link></div>
        </div>
      </section>
      <CategoryExplorer categories={categories} subcategories={subcategories} />
      {featured.length > 0 && <section id="featured" className="border-b border-[#e4e4e7] bg-[#f5f5f5]"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><span className="text-[10px] font-bold text-[#ef4056]">پیشنهادهای بیرون</span><h2 className="mt-2 text-2xl font-black text-[#27272a]">کسب‌وکارهای منتخب</h2></div><Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه را ببین ←</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} />)}</div></div></section>}
      <section className="bg-white"><div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6"><span className="text-[10px] font-bold text-[#ef4056]">برای صاحبان کسب‌وکار</span><h2 className="mt-3 text-2xl font-black text-[#27272a]">کسب‌وکارت را به شهر معرفی کن.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#71717a]">پروفایلت را ثبت کن تا مشتری‌ها آدرس، تلفن و راه‌های ارتباطی‌ات را یک‌جا پیدا کنند.</p><div className="mt-6 flex justify-center gap-3"><Link href="/register-business" className="rounded-xl bg-[#ef4056] px-5 py-3 text-sm font-bold text-white">ثبت کسب‌وکار</Link><Link href="/register-online-shop" className="rounded-xl border border-[#d4d4d8] px-5 py-3 text-sm font-bold text-[#52525b]">ثبت آنلاین‌شاپ</Link></div></div></section>
    </div>
  );
}