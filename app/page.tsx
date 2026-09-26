import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getDirectory } from "@/lib/data";

const categoryVisuals: Record<string, { glyph: string; tone: string }> = {
  food: { glyph: "☕", tone: "from-[#ffe5d1] to-[#fff8ef] text-[#b85b2d]" },
  shopping: { glyph: "🛍️", tone: "from-[#ffdce7] to-[#fff3f6] text-[#c72d5b]" },
  education: { glyph: "✎", tone: "from-[#dce8ff] to-[#f4f7ff] text-[#4c6fc7]" },
  business: { glyph: "↗", tone: "from-[#ffe0e6] to-[#fff3f4] text-[#c70d46]" },
  beauty: { glyph: "✿", tone: "from-[#ffe0ec] to-[#fff5f8] text-[#d64975]" },
  health: { glyph: "＋", tone: "from-[#d8f3ee] to-[#f3fffc] text-[#2b9584]" },
  home: { glyph: "⌂", tone: "from-[#fff0c7] to-[#fffaf0] text-[#a87818]" },
  automotive: { glyph: "▰", tone: "from-[#dfe9ef] to-[#f7fbfd] text-[#55717e]" },
};

const moodLinks = [
  ["یه قهوه می‌چسبه", "food", "☕", "کافه و غذا"],
  ["وقت خرید دارم", "shopping", "🛍️", "فروشگاه‌های اطراف"],
  ["چیزی یاد بگیرم", "education", "✎", "کلاس و آموزش"],
  ["کارم رو راه بندازم", "business", "↗", "خدمات حرفه‌ای"],
];

export default async function Home() {
  const [{ categories, subcategories }, businesses] = await Promise.all([getDirectory(), getBusinesses({})]);
  const featured = businesses.slice(0, 6);
  const quickCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fffafa]">
      <section className="relative overflow-hidden border-b border-[#f0dfe2] bg-gradient-to-bl from-[#fff5ed] via-white to-[#fff0f3]">
        <div className="pointer-events-none absolute -left-44 top-0 h-[30rem] w-[30rem] rounded-full bg-[#ff9daf]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-[-12rem] h-[35rem] w-[35rem] rounded-full bg-[#ffd77e]/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-7 px-5 pb-12 pt-9 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pb-16 lg:pt-12">
          <div className="order-2 text-right lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ed0b55]/15 bg-[#ed0b55]/[0.06] px-4 py-2 text-xs font-black text-[#c70d46]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#ed0b55]" /> مشهد · شهر شروع ما</span>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[1.42] tracking-tight text-[#30252a] sm:text-6xl">خوبِ نزدیکت را<br /><span className="text-[#ed0b55]">پیدا کن و بیرون بزن.</span></h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#77696d] sm:text-lg">از یک کافه‌ی دنج تا یک متخصص قابل‌اعتماد؛ کسب‌وکارهای واقعی شهرت را ساده، تصویری و مرتب پیدا کن.</p>
            <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-[1.25rem] border border-[#eadfe2] bg-white p-2 shadow-[0_18px_35px_-25px_rgba(77,30,36,.45)]">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#fff0f3] text-2xl text-[#ed0b55]">⌕</span>
              <span className="min-w-0 flex-1 text-right text-sm font-bold text-[#a08f93]">دنبال کافه، فروشگاه، متخصص یا خدمت می‌گردی؟</span>
              <Link href="#directory" className="shrink-0 rounded-xl bg-[#ed0b55] px-4 py-3 text-xs font-black text-white transition hover:bg-[#c70d46]">جست‌وجو</Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold text-[#8d7d81]"><span className="rounded-full bg-white/80 px-3 py-2">⚡ پیدا کردن سریع</span><span className="rounded-full bg-white/80 px-3 py-2">✦ کسب‌وکارهای واقعی</span><span className="rounded-full bg-white/80 px-3 py-2">⌖ نزدیک تو</span></div>
          </div>
          <div className="relative order-1 min-h-[310px] lg:order-2 lg:min-h-[430px]">
            <div className="absolute inset-x-7 top-5 bottom-0 rounded-[3rem] bg-gradient-to-br from-[#ffd7c7] via-[#fff4e9] to-[#cfeee7] shadow-[0_35px_80px_-35px_rgba(100,52,57,.38)]" />
            <div className="absolute right-3 top-8 z-10 rotate-6 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-xs font-black text-[#d4134e] shadow-lg">هر چیزی، همین نزدیکی‌ها ✦</div>
            <div className="absolute left-2 top-20 z-10 -rotate-6 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-xs font-black text-[#3a8f81] shadow-lg">کشف کن · انتخاب کن · بیرون بزن</div>
            <div className="absolute inset-0 grid place-items-center">
              <div className="beeroon-tile grid h-56 w-56 place-items-center rounded-[3.2rem] border-8 border-white bg-gradient-to-br from-[#ff557c] to-[#e70b51] shadow-[0_28px_60px_-25px_rgba(180,32,73,.58)] sm:h-72 sm:w-72">
                <img src="/beeroon-mark.svg" alt="لوگوی بیرون" className="h-[78%] w-[78%] object-contain" />
              </div>
            </div>
            <div className="absolute bottom-3 right-0 z-10 rounded-2xl border border-[#eadfe2] bg-white px-4 py-3 shadow-lg"><p className="text-[10px] text-[#9a898d]">امروز در بیرون</p><p className="mt-1 text-sm font-black text-[#3b2d2e]">{categories.length} دسته · {subcategories.length}+ تخصص</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eee4e6] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-black text-[#382d32]">دسته‌های محبوب</h2><p className="mt-1 text-xs text-[#a08f93]">برای شروع، یکی را انتخاب کن.</p></div><Link href="#directory" className="text-xs font-black text-[#ed0b55]">همه دسته‌ها ←</Link></div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickCategories.map((category) => { const visual = categoryVisuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f9e4e9] to-white text-[#ed0b55]" }; return <Link key={category.id} href={`/category/${category.slug}`} className="group min-w-[116px] rounded-2xl border border-[#eee4e6] bg-[#fffdfd] p-3 text-center transition hover:-translate-y-1 hover:border-[#ed0b55]/30 hover:shadow-[0_15px_28px_-22px_rgba(237,11,85,.5)]"><span className={`beeroon-tile mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl ${visual.tone}`}>{visual.glyph}</span><span className="mt-3 block truncate text-xs font-black text-[#5c4c51] group-hover:text-[#ed0b55]">{category.name}</span><span className="mt-1 block text-[10px] text-[#a08f93]">کشف کن</span></Link>; })}
          </div>
        </div>
      </section>

      <section id="nearby" className="mx-auto max-w-7xl px-5 py-9 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="rounded-[1.7rem] border border-[#f0dfe2] bg-gradient-to-l from-[#fff0f3] to-[#fffaf8] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3"><div><span className="text-[10px] font-black tracking-[0.2em] text-[#ed0b55]">START WITH A FEELING</span><h2 className="mt-2 text-xl font-black text-[#382d32]">امروز دلت چی می‌خواد؟</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl shadow-sm">✦</span></div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{moodLinks.map(([label, slug, glyph, description]) => <Link key={slug} href={`/category/${slug}`} className="rounded-2xl border border-white bg-white/75 p-3 transition hover:-translate-y-1 hover:bg-white"><span className="beeroon-tile grid h-11 w-11 place-items-center rounded-xl bg-[#fff7de] text-xl">{glyph}</span><span className="mt-3 block text-xs font-black text-[#5c4c51]">{label}</span><span className="mt-1 block text-[10px] text-[#a08f93]">{description}</span></Link>)}</div>
          </div>
          <div className="rounded-[1.7rem] bg-gradient-to-br from-[#344e5a] to-[#477e7b] p-6 text-white shadow-[0_25px_42px_-28px_rgba(52,78,90,.75)]"><div className="flex items-center justify-between"><div><span className="text-[10px] font-black tracking-[0.18em] text-[#bdeee2]">NEARBY NOW</span><h2 className="mt-2 text-xl font-black">همین نزدیکی‌ها</h2></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 text-xl">⌖</span></div><p className="mt-5 text-xs leading-7 text-[#c6dfdc]">موقعیتت را انتخاب کن تا گزینه‌های نزدیک و باز را ببینی.</p><Link href="#directory" className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-xs font-black text-[#327b72]">دیدن اطراف من ←</Link></div>
        </div>
      </section>

      <CategoryExplorer categories={categories} subcategories={subcategories} />

      {featured.length > 0 && <section className="border-y border-[#eee4e6] bg-white"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="flex items-end justify-between gap-4"><div><span className="text-[10px] font-black tracking-[0.18em] text-[#ed0b55]">LOCAL PICKS</span><h2 className="mt-2 text-2xl font-black text-[#382d32]">پیشنهادهای بیرون</h2><p className="mt-1 text-sm text-[#a08f93]">کسب‌وکارهایی که ارزش دیده‌شدن دارند.</p></div><Link href="#directory" className="text-xs font-black text-[#ed0b55]">همه را ببین ←</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} />)}</div></div></section>}

      <section className="mx-auto max-w-5xl px-5 py-14 text-center"><span className="text-[10px] font-black tracking-[0.2em] text-[#ed0b55]">FOR LOCAL OWNERS</span><h2 className="mt-3 text-2xl font-black text-[#382d32] sm:text-3xl">کسب‌وکارت را به شهر معرفی کن.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#837276]">پروفایل کاملت را ثبت کن تا مشتری‌ها آدرس، تلفن و راه‌های ارتباطی‌ات را یک‌جا پیدا کنند.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/register-business" className="rounded-xl bg-[#ed0b55] px-6 py-3.5 text-sm font-black text-white shadow-[0_12px_23px_-16px_rgba(237,11,85,.9)] transition hover:bg-[#c70d46]">ثبت رایگان کسب‌وکار</Link><Link href="/register-online-shop" className="rounded-xl border border-[#bde8df] bg-[#eaf9f5] px-6 py-3.5 text-sm font-black text-[#328d7d]">ثبت آنلاین‌شاپ</Link></div></section>
    </div>
  );
}