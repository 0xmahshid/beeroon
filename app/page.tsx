import Link from "next/link";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";

const popularSlugs = ["food", "shopping", "fashion", "beauty", "health", "education", "home", "technical"];
const heroQuickSearch = [
  { label: "کافه و رستوران", icon: "🍽️", q: "کافه" },
  { label: "آرایشگاه", icon: "💇", q: "آرایشگاه" },
  { label: "پوشاک", icon: "👕", q: "پوشاک" },
  { label: "تعمیرات موبایل", icon: "📱", q: "تعمیرات موبایل" },
  { label: "لوازم ورزشی", icon: "⚽", q: "ورزشی" },
  { label: "پزشک و سلامت", icon: "🏥", q: "پزشک" },
  { label: "خدمات خودرو", icon: "🚗", q: "خودرو" },
  { label: "بچگانه", icon: "🧸", q: "بچگانه" },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ city?: string | string[] }> }) {
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const [{ categories, subcategories }, businesses, city] = await Promise.all([getDirectory(), getBusinesses({ citySlug }), getCityBySlug(citySlug)]);
  const cityQuery = "?city=" + encodeURIComponent(city.slug);
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const popularCategories = popularSlugs.flatMap((slug) => {
    const category = categoryMap.get(slug);
    return category ? [category] : [];
  });
  const featured = businesses.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <section className="relative overflow-hidden border-b border-[#e8eaee] bg-white">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(1200px 500px at 90% -10%, rgba(213,31,79,0.10), transparent 60%), radial-gradient(800px 500px at -10% 110%, rgba(243,150,117,0.12), transparent 60%)" }} />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1fr_360px] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <img src="/beeroon-logo.png" alt="نشان بیرون" className="mb-5 h-16 w-16 rounded-2xl object-cover shadow-[0_10px_24px_rgba(213,31,79,.18)]" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f3] px-4 py-2 text-[11px] font-black text-[#d51f4f]">
              <span>✨</span> قبل از بیرون زدن، بیرون رو چک کن.
            </span>
            <h1 className="mt-5 text-3xl font-black leading-[1.5] tracking-tight text-[#25252a] sm:text-4xl md:text-5xl">
              دنبال چی می‌گردی؟<br />
              <span className="text-[#d51f4f]">از نزدیک‌ترین جا پیداش کن.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#69707b] sm:text-base md:leading-9">
              کافه، فروشگاه یا خدمتی را که لازم داری جست‌وجو کن. نشانی، ساعت کاری و راه تماس را هم ببین.
            </p>
            <form action="/search" method="get" role="search" className="mt-7 flex max-w-3xl items-center gap-2 rounded-2xl border border-[#dfe2e7] bg-white p-2 shadow-[0_20px_48px_-24px_rgba(32,35,42,.45)] focus-within:border-[#e0a0af]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0f3] text-2xl leading-none text-[#d51f4f] sm:h-14 sm:w-14">⌕</span>
              <input type="hidden" name="city" value={city.slug} />
              <input
                name="q"
                placeholder="مثلاً کافه، تعمیرکار یا فروشگاه"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#25252a] outline-none placeholder:text-[#9ba1aa] sm:text-base md:py-4"
                style={{ minHeight: "52px" }}
              />
              <button
                className="shrink-0 rounded-xl bg-[#d51f4f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b91640] sm:px-7 sm:py-4"
                style={{ minHeight: "52px" }}
              >
                جست‌وجو 🔎
              </button>
            </form>

            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2 text-[10.5px] font-bold text-[#858c96]">
                <span>جست‌وجوی سریع:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {heroQuickSearch.map((item) => (
                  <Link
                    key={item.q}
                    href={"/search?q=" + encodeURIComponent(item.q) + "&city=" + encodeURIComponent(city.slug)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-[#e6e8ee] bg-white px-4 py-2 text-[11px] font-bold text-[#555a63] shadow-[0_2px_8px_-4px_rgba(60,30,45,.2)] transition hover:-translate-y-0.5 hover:border-[#e0a0af] hover:text-[#d51f4f] hover:shadow-[0_6px_16px_-6px_rgba(213,31,79,.25)]"
                    style={{ minHeight: "40px" }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="relative hidden overflow-hidden rounded-[28px] border border-[#e8eaee] bg-[#fbfbfc] p-6 shadow-[0_30px_60px_-34px_rgba(60,30,45,.35)] lg:block">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full" style={{ background: "radial-gradient(circle, rgba(213,31,79,0.14), transparent 65%)" }} />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full" style={{ background: "radial-gradient(circle, rgba(243,150,117,0.14), transparent 65%)" }} />
            <div className="relative">
              <div className="flex items-center justify-between pb-4">
                <div>
                  <p className="text-[10.5px] font-bold text-[#9097a3]">📍 جست‌وجو در</p>
                  <h2 className="mt-1 text-2xl font-black text-[#25252a]">{city.name}</h2>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f3] text-2xl">⌖</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-[#e8eaee] rounded-2xl border border-[#eef0f4] bg-white py-4 text-center shadow-[0_10px_24px_-18px_rgba(60,30,45,.3)]">
                <div>
                  <strong className="block text-2xl font-black text-[#25252a]">{businesses.length.toLocaleString("fa-IR")}</strong>
                  <span className="mt-1 block text-[10px] text-[#858c96]">کسب‌وکار</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-[#25252a]">{categories.length.toLocaleString("fa-IR")}</strong>
                  <span className="mt-1 block text-[10px] text-[#858c96]">دسته</span>
                </div>
                <div>
                  <strong className="block text-2xl font-black text-[#d51f4f]">رایگان</strong>
                  <span className="mt-1 block text-[10px] text-[#858c96]">برای جست‌وجو</span>
                </div>
              </div>
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-[10.5px] font-bold text-[#555a63] shadow-[0_4px_12px_-8px_rgba(60,30,45,.3)]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">✓</span>
                  <span>بررسی شماره تماس و نشانی</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-[10.5px] font-bold text-[#555a63] shadow-[0_4px_12px_-8px_rgba(60,30,45,.3)]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">🗺️</span>
                  <span>مسیریابی با نشان</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 text-[10.5px] font-bold text-[#555a63] shadow-[0_4px_12px_-8px_rgba(60,30,45,.3)]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">⏰</span>
                  <span>ساعت کاری و وضعیت باز بودن</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="relative border-b border-[#e8eaee] bg-gradient-to-b from-white to-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="beeroon-section-label">راهنمای استفاده</span>
            <h2 className="mt-3 text-2xl font-black text-[#25252a] sm:text-3xl">چطور از بیرون استفاده کنی؟</h2>
            <p className="mx-auto mt-3 max-w-xl text-xs leading-8 text-[#69707b] sm:text-sm">
              شهر را انتخاب کن و کسب‌وکارهای همان شهر را ببین یا جست‌وجو کن.
            </p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              { step: "۱", title: "شهرت را انتخاب کن", desc: "کسب‌وکارهای ثبت‌شده در همان شهر را ببین.", icon: "📍", bg: "#fff0f3" },
              { step: "۲", title: "اسمش را جست‌وجو کن", desc: "نام کسب‌وکار یا خدمتی را که لازم داری بنویس؛ مثلاً کافه یا تعمیرکار.", icon: "🔍", bg: "#fff3ec" },
              { step: "۳", title: "اطلاعاتش را ببین", desc: "نشانی و ساعت کاری را بررسی کن؛ بعد تماس بگیر یا مسیر را باز کن.", icon: "📞", bg: "#eaf5ff" },
            ].map((s) => (
              <div key={s.step} className="group relative overflow-hidden rounded-3xl border border-[#eef0f4] bg-white p-6 transition hover:-translate-y-1 hover:border-[#e6c0cb] hover:shadow-[0_30px_50px_-24px_rgba(60,30,45,.25)] sm:p-7">
                <div className="absolute left-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-2xl text-[13px] font-black text-[#d51f4f]" style={{ background: s.bg }}>
                  {s.step}
                </div>
                <div className="grid h-16 w-16 place-items-center rounded-[22px] text-4xl" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <h3 className="mt-5 text-lg font-black text-[#25252a]">{s.title}</h3>
                <p className="mt-2.5 text-xs leading-8 text-[#69707b] sm:text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="directory" className="border-b border-[#e8eaee] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="beeroon-section-label">دسته‌ها</span>
              <h2 className="mt-2 text-2xl font-black text-[#25252a] sm:text-3xl">دنبال چه چیزی هستی؟</h2>
              <p className="mt-2 text-sm text-[#858c96]">یک دسته را انتخاب کن تا کسب‌وکارهای مرتبط را ببینی.</p>
            </div>
            <Link href={"/search" + cityQuery} className="shrink-0 rounded-full bg-[#fff0f3] px-4 py-2 text-xs font-black text-[#d51f4f] transition hover:bg-[#ffe4ea] sm:text-sm">
              دیدن همه دسته‌ها ←
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-8">
            {popularCategories.map((category) => {
              const count = subcategories.filter((item) => item.category_id === category.id).length;
              return (
                <Link
                  key={category.id}
                  href={"/category/" + category.slug + cityQuery}
                  className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-[#e8eaee] bg-white px-3 py-5 text-center transition hover:-translate-y-1 hover:border-[#e0a0af] hover:shadow-[0_20px_40px_-24px_rgba(213,31,79,.35)]"
                >
                  <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff4f6] text-3xl transition group-hover:scale-110 group-hover:bg-[#ffe5eb]">
                    <CategoryIcon slug={category.slug} className="h-7 w-7 text-[#d51f4f]" />
                  </span>
                  <strong className="mt-4 block truncate text-[12px] font-black text-[#353942] group-hover:text-[#d51f4f] sm:text-sm">{category.name}</strong>
                  <span className="mt-1 block text-[10px] text-[#9299a3]">{count ? count.toLocaleString("fa-IR") + " تخصص" : "دیدن گزینه‌ها"}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8fa]">
        <div className="mx-auto max-w-7xl px-4 py-11 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="beeroon-section-label">نزدیک تو</span>
              <h2 className="mt-2 text-2xl font-black text-[#25252a] sm:text-3xl">کسب‌وکارهای {city.name}</h2>
              <p className="mt-2 text-sm text-[#858c96]">نشانی، ساعت کاری و راه تماس را ببین.</p>
            </div>
            <Link href={"/search" + cityQuery} className="shrink-0 text-sm font-black text-[#d51f4f] hover:underline">
              دیدن همه ←
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((b) => (
                <BusinessCard key={b.id} b={b} categoryName={categories.find((item) => item.id === b.category_id)?.name} />
              ))}
            </div>
          ) : (
            <div className="mt-7 rounded-3xl border border-dashed border-[#decbd1] bg-white px-6 py-14 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#fff0f3] text-3xl">🏪</div>
              <h3 className="mt-4 text-lg font-black text-[#25252a]">هنوز کسب‌وکاری در {city.name} ثبت نشده.</h3>
              <p className="mx-auto mt-2 max-w-lg text-sm text-[#858c96]">کسب‌وکارت را ثبت کن تا بعد از بررسی اینجا نمایش داده شود.</p>
              <Link href={"/register-business" + cityQuery} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-6 py-3 text-sm font-black text-white">
                ثبت کسب‌وکار
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[#e8eaee] bg-white">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(800px 300px at 100% 0%, rgba(213,31,79,0.07), transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <span className="beeroon-section-label">بیرون چطور کمک می‌کند؟</span>
              <h2 className="mt-3 text-2xl font-black text-[#25252a] sm:text-3xl">
                اطلاعات کسب‌وکارهای نزدیکت را یک‌جا ببین.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-8 text-[#69707b]">
                نشانی، ساعت کاری، شماره تماس و مسیر را پیش از رفتن بررسی کن.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: "⭐", title: "اطلاعات بررسی‌شده", desc: "شماره تماس و نشانی کسب‌وکارها بررسی می‌شود." },
                  { icon: "🧭", title: "مسیریابی با نشان", desc: "با یک دکمه مسیر را در نشان باز کن." },
                  { icon: "💬", title: "راه تماس روشن", desc: "تماس بگیر یا در واتساپ پیام بده." },
                ].map((f) => (
                  <div key={f.title} className="flex gap-3 rounded-2xl border border-[#eef0f4] bg-[#fbfbfc] p-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-[0_4px_12px_-6px_rgba(60,30,45,.25)]">{f.icon}</div>
                    <div>
                      <h3 className="text-sm font-black text-[#25252a]">{f.title}</h3>
                      <p className="mt-1 text-xs leading-7 text-[#69707b]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[28px] border border-[#e8eaee] bg-gradient-to-b from-[#fff1f4] to-white p-6 shadow-[0_40px_80px_-34px_rgba(213,31,79,.35)] sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-[#d51f4f] shadow-[0_4px_12px_-6px_rgba(213,31,79,.3)]">
                    <span>🌟</span> برای کسب‌وکارها
                  </span>
                  <span className="text-[10px] font-bold text-[#9097a3]">کسب‌وکارهای محلی</span>
                </div>
                <h3 className="mt-6 text-2xl font-black leading-[1.5] text-[#25252a]">
                  کسب‌وکارت را در بیرون ثبت کن.
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#69707b]">
                  نشانی، ساعت کاری، راه تماس و صفحه‌های اجتماعی‌ات را وارد کن تا دیگران راحت‌تر پیدایت کنند.
                </p>
                <div className="mt-6 grid gap-2.5 text-[11px] font-bold text-[#555a63]">
                  <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_4px_12px_-8px_rgba(60,30,45,.2)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">📊</span>
                    آمار تماس و مسیریابی
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_4px_12px_-8px_rgba(60,30,45,.2)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">🔍</span>
                    صفحه‌ی کسب‌وکارت در بیرون
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-[0_4px_12px_-8px_rgba(60,30,45,.2)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#fff0f3] text-[#d51f4f]">🔐</span>
                    ثبت کسب‌وکار فعلاً رایگان است
                  </div>
                </div>
                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <Link
                    href={"/register-business" + cityQuery}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#d51f4f] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#b91640]"
                    style={{ minHeight: "50px" }}
                  >
                    ثبت کسب‌وکار →
                  </Link>
                  <Link href={"/register-online-shop" + cityQuery} className="inline-flex items-center justify-center rounded-xl border border-[#e6c0cb] bg-white px-6 py-3.5 text-sm font-black text-[#d51f4f]"
                    style={{ minHeight: "50px" }}
                  >
                    ثبت آنلاین‌شاپ →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
