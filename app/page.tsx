import Link from "next/link";
import CategoryExplorer from "@/components/CategoryExplorer";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getDirectory } from "@/lib/data";

const categoryVisuals: Record<string, { glyph: string; tone: string }> = {
  food: { glyph: "☕", tone: "from-[#fff0e6] to-[#fff8f4] text-[#bd6536]" },
  shopping: { glyph: "🛍️", tone: "from-[#ffe9ef] to-[#fff5f7] text-[#d23b5b]" },
  education: { glyph: "✎", tone: "from-[#eaf0ff] to-[#f7f9ff] text-[#4c6fc7]" },
  business: { glyph: "↗", tone: "from-[#ffe8ef] to-[#fff3f6] text-[#c70d46]" },
  beauty: { glyph: "✿", tone: "from-[#ffe9f3] to-[#fff5f9] text-[#d64975]" },
  health: { glyph: "＋", tone: "from-[#e3faf4] to-[#f5fffc] text-[#268e7d]" },
  home: { glyph: "⌂", tone: "from-[#fff5d8] to-[#fffaf0] text-[#a47616]" },
  automotive: { glyph: "▰", tone: "from-[#e9f5f8] to-[#f7fcfd] text-[#55717e]" },
};

const moodLinks = [
  ["یه قهوه می‌چسبه", "food", "☕", "کافه و غذا"],
  ["وقت خرید دارم", "shopping", "🛍️", "فروشگاه‌ها"],
  ["چیزی یاد بگیرم", "education", "✎", "کلاس و آموزش"],
  ["کارم رو راه بندازم", "business", "↗", "خدمات حرفه‌ای"],
];

export default async function Home() {
  const [{ categories, subcategories }, businesses] = await Promise.all([getDirectory(), getBusinesses({})]);
  const featured = businesses.slice(0, 8);
  const quickCategories = categories.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#fcf7f8]">
      <section className="hero-shell relative overflow-hidden text-white">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="hero-orb hero-orb-one pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full" />
        <div className="hero-orb hero-orb-two pointer-events-none absolute -bottom-32 left-0 h-80 w-80 rounded-full" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_.9fr] lg:items-center lg:px-8 lg:py-16">
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#ffe1e7] backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#ffd36e] shadow-[0_0_0_4px_rgba(255,211,110,.14)]" /> کشف خوب‌های همین نزدیکی</span>
            <h1 className="mt-5 max-w-xl text-[2rem] font-black leading-[1.55] tracking-tight sm:text-5xl">خوبِ نزدیکت را<br /><span className="text-[#ffd36e]">پیدا کن و بیرون بزن.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[#f8dce2] sm:text-base">از یک کافه‌ی دنج تا یک متخصص قابل‌اعتماد؛ گزینه‌های واقعی شهر را مرتب ببین و راحت انتخاب کن.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="#directory" className="inline-flex items-center gap-2 rounded-xl bg-[#ffd36e] px-5 py-3.5 text-sm font-black text-[#4d1a2e] shadow-[0_12px_24px_-14px_rgba(255,211,110,.9)] transition hover:-translate-y-0.5 hover:bg-[#ffe08d]">شروع جست‌وجو <span>←</span></Link>
              <Link href="#featured" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15">محبوب‌ترین‌ها</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-[#f7cbd4]"><span>✓ کسب‌وکارهای واقعی</span><span>✓ نزدیک به تو</span><span>✓ رایگان برای شروع</span></div>
          </div>
          <div className="hero-visual order-2 lg:order-1">
            <div className="hero-window relative mx-auto max-w-[440px] rounded-[2rem] border border-white/20 p-3 shadow-[0_24px_70px_-28px_rgba(20,4,18,.8)] sm:p-4">
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-[#ffdce4]"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#67d4a6]" /> زنده در اطراف تو</span><span className="rounded-full bg-white/10 px-2.5 py-1">مشهد</span></div>
              <div className="mt-3 rounded-[1.4rem] bg-[#fffaf9] p-4 text-[#33212b] shadow-[0_12px_30px_-22px_rgba(30,10,20,.6)]" dir="rtl">
                <div className="flex items-center justify-between"><div><span className="text-[10px] font-bold text-[#ef4056]">برای حال امروزت</span><p className="mt-1 text-base font-black">امروز کجا بریم؟</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0c9] text-xl">✦</span></div>
                <div className="mt-4 grid grid-cols-2 gap-2"><Link href="/category/food" className="rounded-xl bg-[#fff0f3] p-3 transition hover:bg-[#ffe0e7]"><span className="text-xl">☕</span><span className="mt-2 block text-[11px] font-black text-[#7c263b]">یک کافه‌ی دنج</span><span className="mt-1 block text-[9px] text-[#a66d79]">نزدیک و دوست‌داشتنی</span></Link><Link href="/category/shopping" className="rounded-xl bg-[#fff6df] p-3 transition hover:bg-[#ffefc4]"><span className="text-xl">🛍️</span><span className="mt-2 block text-[11px] font-black text-[#76571b]">یه خرید خوب</span><span className="mt-1 block text-[9px] text-[#a4864b]">فروشگاه‌های منتخب</span></Link></div>
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#f1e5e7] bg-white px-3 py-2.5"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fce7ec] text-sm text-[#ef4056]">⌕</span><span className="text-[10px] font-bold text-[#9a8289]">دنبال چه چیزی می‌گردی؟</span><span className="mr-auto text-[#ef4056]">←</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between px-2 text-[10px] font-bold text-[#f9cbd5]"><span>کشف کن</span><span>انتخاب کن</span><span>بیرون بزن</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#f0dfe3] bg-white"><div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-3 sm:grid-cols-3 sm:gap-3 sm:px-6 lg:px-8"><div className="rounded-xl bg-[#fff1f4] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#d9364b]">انتخاب مطمئن</span><span className="mt-1 block text-[10px] text-[#a06d76]">کسب‌وکارهای واقعی</span></div><div className="rounded-xl bg-[#effbf7] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#278b7b]">نزدیک به تو</span><span className="mt-1 block text-[10px] text-[#6f9e96]">پیدا کردن آسان</span></div><div className="rounded-xl bg-[#fff8e5] px-3 py-2.5 text-center"><span className="block text-xs font-black text-[#a67414]">شروع رایگان</span><span className="mt-1 block text-[10px] text-[#a99972]">همین امروز</span></div></div></section>

      <section className="border-b border-[#f0dfe3] bg-[#fffaf9]"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-5 flex items-end justify-between"><div><span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">شروع سریع</span><h2 className="mt-2 text-xl font-black text-[#33212b]">دسته‌های محبوب</h2></div><Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه دسته‌ها ←</Link></div><div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3">{quickCategories.map((category) => { const visual = categoryVisuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f5f0f2] to-white text-[#ef4056]" }; return <Link key={category.id} href={"/category/" + category.slug} className="group flex min-w-0 flex-col items-center rounded-2xl border border-transparent p-2 transition hover:-translate-y-0.5 hover:border-[#f3d4da] hover:bg-white hover:shadow-[0_10px_25px_-22px_rgba(90,15,35,.6)]"><span className={"grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl shadow-[0_8px_18px_-16px_rgba(80,20,40,.45)] " + visual.tone}>{visual.glyph}</span><span className="mt-2 w-full truncate text-center text-[11px] font-bold text-[#5f4b53] group-hover:text-[#ef4056]">{category.name}</span></Link>; })}</div></div></section>

      <section id="nearby" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]"><div className="rounded-[1.6rem] border border-[#f0dfe3] bg-white p-5 shadow-[0_12px_32px_-28px_rgba(104,31,52,.35)] sm:p-6"><div className="flex items-center justify-between"><div><span className="text-[10px] font-black text-[#ef4056]">بر اساس حال امروزت</span><h2 className="mt-2 text-xl font-black text-[#33212b]">امروز دلت چی می‌خواد؟</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1c9] text-xl text-[#b27d10]">✦</span></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{moodLinks.map(([label, slug, glyph, description]) => <Link key={slug} href={"/category/" + slug} className="rounded-2xl border border-[#f2e9eb] bg-[#fffdfd] p-3 transition hover:-translate-y-0.5 hover:border-[#ef4056]/40 hover:bg-[#fff8f9]"><span className="text-xl">{glyph}</span><span className="mt-2 block text-xs font-bold text-[#45343b]">{label}</span><span className="mt-1 block text-[10px] text-[#a18e95]">{description}</span></Link>)}</div></div><div className="relative overflow-hidden rounded-[1.6rem] bg-[#3d1833] p-6 text-white shadow-[0_18px_35px_-26px_rgba(61,24,51,.8)]"><div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#ef4056]/35 blur-2xl" /><div className="relative"><span className="text-[10px] font-bold text-[#ffd4dc]">نزدیک تو</span><h2 className="mt-2 text-xl font-black">همین اطراف</h2><p className="mt-4 text-xs leading-7 text-[#f0d7de]">موقعیتت را انتخاب کن تا گزینه‌های نزدیک و باز را سریع‌تر ببینی.</p><Link href="#directory" className="mt-5 inline-flex rounded-xl bg-[#ffd36e] px-4 py-2.5 text-xs font-black text-[#4d1a2e] transition hover:bg-[#ffe08d]">دیدن اطراف من ←</Link></div></div></div></section>

      <CategoryExplorer categories={categories} subcategories={subcategories} />
      {featured.length > 0 && <section id="featured" className="border-b border-[#f0dfe3] bg-[#fcf7f8]"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="flex items-end justify-between"><div><span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">پیشنهادهای بیرون</span><h2 className="mt-2 text-2xl font-black text-[#33212b]">کسب‌وکارهای منتخب</h2></div><Link href="#directory" className="text-xs font-bold text-[#ef4056]">همه را ببین ←</Link></div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featured.map((business) => <BusinessCard key={business.id} b={business} />)}</div></div></section>}

      <section className="bg-white"><div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6"><span className="text-[10px] font-black tracking-[0.14em] text-[#ef4056]">برای صاحبان کسب‌وکار</span><h2 className="mt-3 text-2xl font-black text-[#33212b]">کسب‌وکارت را به شهر معرفی کن.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#71717a]">پروفایلت را ثبت کن تا مشتری‌ها آدرس، تلفن و راه‌های ارتباطی‌ات را یک‌جا پیدا کنند.</p><div className="mt-6 flex justify-center gap-3"><Link href="/register-business" className="rounded-xl bg-[#ef4056] px-5 py-3 text-sm font-black text-white transition hover:bg-[#d9364b]">ثبت کسب‌وکار</Link><Link href="/register-online-shop" className="rounded-xl border border-[#eadfe2] px-5 py-3 text-sm font-bold text-[#5e4a52] transition hover:border-[#ef4056] hover:text-[#ef4056]">ثبت آنلاین‌شاپ</Link></div></div></section>
    </div>
  );
}
