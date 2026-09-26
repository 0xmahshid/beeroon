"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Category, Subcategory } from "@/lib/types";

type Props = {
  categories: Category[];
  subcategories: Subcategory[];
};

type Direction = "search" | "nearby" | "mood";

const quickLinks = [
  { label: "کافه و غذا", slug: "food", glyph: "☕" },
  { label: "خرید", slug: "shopping", glyph: "🛍️" },
  { label: "آموزش", slug: "education", glyph: "✦" },
  { label: "خدمات", slug: "business", glyph: "↗" },
];

function categoryHref(category: Category) {
  return "/category/" + category.slug;
}

export default function DesignShowcase({ categories, subcategories }: Props) {
  const [selected, setSelected] = useState<Direction | null>(null);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("fa");
    if (!normalized) return categories.slice(0, 3);
    return categories
      .filter((category) =>
        category.name.toLocaleLowerCase("fa").includes(normalized),
      )
      .slice(0, 3);
  }, [categories, query]);

  const selectDirection = (direction: Direction) => {
    setSelected(direction);
    window.location.hash = "decision";
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf8] text-[#241b1c]">
      <div className="pointer-events-none fixed -left-40 top-24 h-96 w-96 rounded-full bg-[#ff9daf]/10 blur-3xl" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#ffd77e]/20 blur-3xl" />

      <header className="relative border-b border-[#f0dfe0] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff0f2] p-1 shadow-[0_8px_20px_-12px_rgba(237,11,85,.7)]">
              <img src="/beeroon-mark.svg" alt="نشان بیرون" className="h-full w-full rounded-xl object-cover" />
            </span>
            <span>
              <span className="block text-lg font-black text-[#ed0b55]">بیرون</span>
              <span className="block text-[10px] font-bold text-[#9a7b82]">سه مسیر برای کشف بهتر</span>
            </span>
          </Link>
          <Link href="/" className="text-sm font-black text-[#806f70] transition hover:text-[#ed0b55]">
            بازگشت به خانه ←
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 lg:px-8 lg:pt-16">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ed0b55]/15 bg-[#ed0b55]/[0.06] px-4 py-2 text-xs font-black text-[#c70d46]">
            <span className="h-2 w-2 rounded-full bg-[#ed0b55]" />
            صفحه‌ی مقایسه‌ی تجربه
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[1.35] text-[#241b1c] sm:text-6xl">
            سه راه برای اینکه
            <span className="block text-[#ed0b55]">زودتر به جواب برسی.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#756565] sm:text-lg">
            هویت بیرون ثابت می‌ماند؛ چیزی که عوض می‌شود، نقطه‌ی شروع کاربر است.
            هر کارت یک مسیر واقعی برای صفحه‌ی اول است.
          </p>
        </section>

        <div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-3">
          {[
            ["search", "A", "اول جست‌وجو", "وقتی کاربر جواب مشخص می‌خواهد."],
            ["nearby", "B", "اول اطراف", "وقتی نزدیکی و همین حالا مهم است."],
            ["mood", "C", "اول حال‌وهوا", "وقتی هنوز اسم خدمت را نمی‌داند."],
          ].map(([key, letter, title, description]) => (
            <button
              key={key}
              onClick={() => document.getElementById(key)?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-2xl border border-[#f0dfe0] bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-[#ed0b55]/40"
            >
              <span className="text-xs font-black text-[#ed0b55]">{letter}</span>
              <span className="mt-1 block font-black text-[#3b2d2e]">{title}</span>
              <span className="mt-1 block text-xs leading-6 text-[#8a7b79]">{description}</span>
            </button>
          ))}
        </div>

        <section className="mt-10 grid items-start gap-6 lg:grid-cols-3">
          <article id="search" className="overflow-hidden rounded-[2rem] border border-[#f0dfe0] bg-white shadow-[0_22px_60px_-42px_rgba(77,30,36,.65)]">
            <div className="relative min-h-[390px] overflow-hidden bg-[#fff4ef] p-6">
              <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#ffb09d]/30 blur-2xl" />
              <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-[#ffd77e]/25 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black text-[#c70d46]">A · SEARCH FIRST</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">⌕</span>
              </div>
              <div className="relative mt-14 text-right">
                <p className="text-sm font-black text-[#c70d46]">سریع و بی‌حاشیه</p>
                <h2 className="mt-3 text-3xl font-black leading-[1.45] text-[#3b2527]">دنبال چی می‌گردی؟</h2>
                <p className="mt-3 text-sm leading-7 text-[#806b68]">یک کلمه بگو؛ بقیه‌اش با بیرون.</p>
              </div>
              <div className="relative mt-7 rounded-2xl border border-white bg-white p-2 shadow-[0_16px_30px_-22px_rgba(95,40,35,.8)]">
                <div className="flex items-center gap-2 rounded-xl bg-[#fff8f5] px-3 py-3">
                  <span className="text-xl text-[#ed0b55]">⌕</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="مثلاً کافه، کلاس، تعمیرکار..."
                    className="min-w-0 flex-1 bg-transparent text-xs font-bold text-[#3b2d2e] outline-none placeholder:text-[#ad9b97]"
                  />
                </div>
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {searchResults.map((category) => (
                  <Link key={category.id} href={categoryHref(category)} className="rounded-full bg-white/85 px-3 py-2 text-[11px] font-bold text-[#6d5a58] transition hover:bg-white hover:text-[#ed0b55]">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-[#f3e5e0] bg-[#fffaf8] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-[#3b2d2e]">نتیجه، نه توضیح اضافه</p>
                    <p className="mt-1 text-xs leading-6 text-[#8a7b79]">مستقیم برو سراغ دسته یا خدمت موردنظر.</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f2] text-lg">↗</span>
                </div>
              </div>
              <p className="mt-5 text-xs font-black leading-6 text-[#8a7b79]">بهترین برای کاربری که اسم چیزی را که می‌خواهد می‌داند.</p>
              <button onClick={() => selectDirection("search")} className="mt-5 w-full rounded-2xl bg-[#ed0b55] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#c70d46]">
                این مسیر را ادامه بده
              </button>
            </div>
          </article>

          <article id="nearby" className="overflow-hidden rounded-[2rem] border border-[#d9eee8] bg-white shadow-[0_22px_60px_-42px_rgba(47,116,102,.55)]">
            <div className="relative min-h-[390px] overflow-hidden bg-[#eaf8f3] p-6">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#9edfd0]/35 blur-2xl" />
              <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#ffd77e]/25 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black text-[#2f8f7d]">B · NEARBY NOW</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">⌖</span>
              </div>
              <div className="relative mt-14 text-right">
                <p className="text-sm font-black text-[#2f8f7d]">مشهد · همین دوروبر</p>
                <h2 className="mt-3 text-3xl font-black leading-[1.45] text-[#26423e]">الان اطراف من چه خبره؟</h2>
                <p className="mt-3 text-sm leading-7 text-[#66817b]">چیزهای نزدیکت را کشف کن، بدون جست‌وجوی طولانی.</p>
              </div>
              <div className="relative mt-7 grid grid-cols-2 gap-3">
                {quickLinks.slice(0, 4).map((item, index) => (
                  <Link key={item.slug} href={"/category/" + item.slug} className="rounded-2xl border border-white/80 bg-white/80 p-3 text-right transition hover:-translate-y-0.5 hover:bg-white">
                    <span className="text-xl">{item.glyph}</span>
                    <span className="mt-2 block text-xs font-black text-[#345e57]">{item.label}</span>
                    <span className="mt-1 block text-[10px] text-[#7c9a94]">{index + 2} دقیقه تا اینجا</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9eee8] bg-[#f5fcfa] p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#d9f1eb] text-[#2f8f7d]">●</span>
                <div>
                  <p className="text-xs font-black text-[#345e57]">یک قدم تا اطراف تو</p>
                  <p className="mt-1 text-xs leading-6 text-[#78928d]">موقعیتت را انتخاب کن و نزدیک‌ترین‌ها را ببین.</p>
                </div>
              </div>
              <p className="mt-5 text-xs font-black leading-6 text-[#8a7b79]">بهترین برای کاربری که دنبال گزینه‌ی نزدیک و قابل‌دسترس است.</p>
              <button onClick={() => selectDirection("nearby")} className="mt-5 w-full rounded-2xl bg-[#2f9a86] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#267d6d]">
                این مسیر را ادامه بده
              </button>
            </div>
          </article>

          <article id="mood" className="overflow-hidden rounded-[2rem] border border-[#f1e4c8] bg-white shadow-[0_22px_60px_-42px_rgba(150,111,39,.55)]">
            <div className="relative min-h-[390px] overflow-hidden bg-[#fff8e7] p-6">
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#ffd77e]/35 blur-2xl" />
              <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#ffb8c6]/25 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-black text-[#a37422]">C · MOOD DISCOVERY</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-sm">✦</span>
              </div>
              <div className="relative mt-14 text-right">
                <p className="text-sm font-black text-[#a37422]">از حس امروزت شروع کن</p>
                <h2 className="mt-3 text-3xl font-black leading-[1.45] text-[#4b3922]">امروز دلت چی می‌خواد؟</h2>
                <p className="mt-3 text-sm leading-7 text-[#8d7955]">لازم نیست اسم دقیق خدمت را بدانی.</p>
              </div>
              <div className="relative mt-7 grid grid-cols-2 gap-3">
                {[
                  ["یه قهوه می‌چسبه", "food", "☕"],
                  ["وقت خرید دارم", "shopping", "🛍️"],
                  ["چیزی یاد بگیرم", "education", "✦"],
                  ["کارم رو راه بندازم", "business", "↗"],
                ].map(([label, slug, glyph]) => (
                  <Link key={slug} href={"/category/" + slug} className="rounded-2xl border border-white/90 bg-white/80 p-3 text-right transition hover:-translate-y-0.5 hover:bg-white">
                    <span className="text-xl">{glyph}</span>
                    <span className="mt-2 block text-xs font-black leading-5 text-[#66502d]">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border border-[#f1e4c8] bg-[#fffaf0] p-4">
                <p className="text-xs font-black text-[#6f572e]">کشف کردن، نه فقط پیدا کردن</p>
                <p className="mt-1 text-xs leading-6 text-[#998463]">بیرون به کاربر کمک می‌کند از حسش به یک انتخاب برسد.</p>
              </div>
              <p className="mt-5 text-xs font-black leading-6 text-[#8a7b79]">بهترین برای ساختن یک برند گرم‌تر و به‌یادماندنی‌تر.</p>
              <button onClick={() => selectDirection("mood")} className="mt-5 w-full rounded-2xl bg-[#d48b2b] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#b87420]">
                این مسیر را ادامه بده
              </button>
            </div>
          </article>
        </section>

        <section id="decision" className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-[#f0dfe0] bg-white p-6 shadow-[0_18px_55px_-42px_rgba(77,30,36,.8)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.18em] text-[#ed0b55]">SHARED PRINCIPLES</p>
              <h2 className="mt-2 text-2xl font-black text-[#3b2d2e]">هر مسیری را انتخاب کنیم، این‌ها ثابت می‌مانند.</h2>
            </div>
            <span className="rounded-full bg-[#fff0f2] px-4 py-2 text-xs font-black text-[#c70d46]">
              {selected ? "انتخاب شد: " + (selected === "search" ? "A" : selected === "nearby" ? "B" : "C") : "هنوز انتخاب نشده"}
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["متن کوتاه‌تر", "هر جمله باید به تصمیم بعدی کمک کند."],
              ["اقدام واضح", "کاربر همیشه بداند قدم بعدی چیست."],
              ["کشف راحت‌تر", "اطلاعات کمتر، انتخاب‌های بهتر."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl bg-[#fffaf8] p-4">
                <p className="font-black text-[#3b2d2e]">{title}</p>
                <p className="mt-1 text-xs leading-6 text-[#8a7b79]">{description}</p>
              </div>
            ))}
          </div>
          {selected && (
            <p className="mt-6 rounded-2xl border border-[#c9eee4] bg-[#e8f8f2] px-4 py-3 text-sm font-bold text-[#2f806f]">
              مسیر انتخابی ثبت شد. قدم بعدی: همین الگو را روی صفحه‌ی اصلی اجرا می‌کنیم و متن‌ها را نهایی می‌کنیم.
            </p>
          )}
        </section>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-7 text-[#9a8985]">
          تعداد دسته‌ها: {categories.length} · تعداد تخصص‌ها: {subcategories.length} · داده‌های واقعی فعلی بیرون در لینک‌های این صفحه استفاده شده‌اند.
        </p>
      </main>
    </div>
  );
}