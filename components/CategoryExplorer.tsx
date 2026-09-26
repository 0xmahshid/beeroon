"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Category, Subcategory } from "@/lib/types";

type Props = { categories: Category[]; subcategories: Subcategory[] };

const visuals: Record<string, { glyph: string; tone: string; accent: string }> = {
  food: { glyph: "☕", tone: "from-[#ffe5d1] to-[#fff8ef] text-[#b85b2d]", accent: "کافه و غذا" },
  shopping: { glyph: "🛍️", tone: "from-[#ffdce7] to-[#fff3f6] text-[#c72d5b]", accent: "خرید" },
  fashion: { glyph: "✦", tone: "from-[#eadcff] to-[#faf5ff] text-[#8754bd]", accent: "مد و پوشاک" },
  beauty: { glyph: "✿", tone: "from-[#ffe0ec] to-[#fff5f8] text-[#d64975]", accent: "زیبایی" },
  health: { glyph: "＋", tone: "from-[#d8f3ee] to-[#f3fffc] text-[#2b9584]", accent: "سلامت" },
  education: { glyph: "✎", tone: "from-[#dce8ff] to-[#f4f7ff] text-[#4c6fc7]", accent: "آموزش" },
  home: { glyph: "⌂", tone: "from-[#fff0c7] to-[#fffaf0] text-[#a87818]", accent: "خانه" },
  automotive: { glyph: "▰", tone: "from-[#dfe9ef] to-[#f7fbfd] text-[#55717e]", accent: "خودرو" },
  business: { glyph: "↗", tone: "from-[#ffe0e6] to-[#fff3f4] text-[#c70d46]", accent: "خدمات کسب‌وکار" },
  technology: { glyph: "⌘", tone: "from-[#dfe3ff] to-[#f7f8ff] text-[#5968c5]", accent: "فناوری" },
};

const popular = [
  ["فروشگاه اینستاگرامی", "online-shops", "instagram-shop"],
  ["مشاوره مهاجرت", "immigration", "immigration-consulting"],
  ["میکاپ آرتیست", "beauty", "makeup-artist"],
  ["طلافروشی", "shopping", "gold-jewelry"],
  ["داروخانه", "health", "pharmacy"],
];

export default function CategoryExplorer({ categories, subcategories }: Props) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const normalized = query.trim().toLocaleLowerCase("fa");
  const groups = useMemo(() => categories.map((category) => {
    const children = subcategories.filter((item) => item.category_id === category.id);
    const matches = !normalized || category.name.toLocaleLowerCase("fa").includes(normalized) || children.some((item) => item.name.toLocaleLowerCase("fa").includes(normalized));
    return { category, children, matches };
  }).filter((group) => group.matches), [categories, subcategories, normalized]);
  const visible = normalized || showAll ? groups : groups.slice(0, 12);

  return (
    <section id="directory" className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[11px] font-black tracking-[0.18em] text-[#ed0b55]">EXPLORE YOUR CITY</span>
          <h2 className="mt-2 text-2xl font-black text-[#30252a] sm:text-3xl">از کجا شروع کنیم؟</h2>
          <p className="mt-2 text-sm leading-7 text-[#837276]">دسته‌ای که می‌خواهی را انتخاب کن؛ تخصص دقیقش را بعد پیدا می‌کنیم.</p>
        </div>
        <div className="relative w-full lg:w-[28rem]">
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-[#ed0b55]">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در دسته‌ها و خدمات..." className="h-14 w-full rounded-2xl border border-[#eadfe2] bg-white pr-12 pl-4 text-sm text-[#30252a] outline-none shadow-[0_14px_28px_-24px_rgba(77,30,36,.7)]" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="ml-1 text-xs font-bold text-[#a08e92]">پرتکرارها:</span>
        {popular.map(([label, category, sub]) => <Link key={sub} href={`/category/${category}/${sub}`} className="rounded-full border border-[#eadfe2] bg-white px-3 py-2 text-[11px] font-bold text-[#6f6064] transition hover:-translate-y-0.5 hover:border-[#ed0b55]/35 hover:text-[#ed0b55]">{label}</Link>)}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {visible.map(({ category, children }) => {
          const visual = visuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f9e4e9] to-white text-[#ed0b55]", accent: category.name };
          const shownChildren = normalized ? children.filter((item) => item.name.toLocaleLowerCase("fa").includes(normalized)) : children;
          return (
            <article key={category.id} className="group soft-card rounded-[1.35rem] border border-[#eee3e4] bg-white p-3.5 transition duration-200 hover:-translate-y-1.5">
              <Link href={`/category/${category.slug}`} className="block">
                <div className={`beeroon-tile grid h-16 w-16 place-items-center rounded-[1.25rem] bg-gradient-to-br text-3xl ${visual.tone}`}>{visual.glyph}</div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-black text-[#3c3035] group-hover:text-[#ed0b55]">{category.name || visual.accent}</span>
                  <span className="text-lg text-[#ed0b55] transition group-hover:-translate-x-1">←</span>
                </div>
                <span className="mt-1 block text-[10px] text-[#a08e92]">{children.length} تخصص</span>
              </Link>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(shownChildren.length ? shownChildren : children).slice(0, 2).map((item) => <Link key={item.id} href={`/category/${category.slug}/${item.slug}`} className="rounded-lg bg-[#fff8f7] px-2 py-1.5 text-[10px] font-bold text-[#796a6d] transition hover:bg-[#fff0f3] hover:text-[#d4134e]">{item.name}</Link>)}
                {children.length > 2 && <Link href={`/category/${category.slug}`} className="rounded-lg bg-[#f7f2f0] px-2 py-1.5 text-[10px] font-black text-[#ed0b55]">+{children.length - 2}</Link>}
              </div>
            </article>
          );
        })}
      </div>

      {visible.length === 0 && <div className="rounded-3xl border border-dashed border-[#d8c8c2] bg-[#fffaf7] py-14 text-center"><p className="font-black text-[#3b2d2e]">چیزی با این عبارت پیدا نشد.</p><p className="mt-2 text-sm text-[#8a7b79]">نام دسته یا تخصص را کوتاه‌تر بنویس.</p></div>}
      {groups.length > 12 && !normalized && <button onClick={() => setShowAll((value) => !value)} className="mx-auto mt-8 flex items-center gap-2 rounded-full border border-[#ed0b55]/25 bg-white px-5 py-3 text-sm font-black text-[#ed0b55] transition hover:bg-[#fff6f8]">{showAll ? "نمایش کمتر" : `نمایش همه دسته‌ها (${groups.length})`}<span>{showAll ? "↑" : "↓"}</span></button>}
    </section>
  );
}