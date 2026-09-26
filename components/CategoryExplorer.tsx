"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Category, Subcategory } from "@/lib/types";

type Props = { categories: Category[]; subcategories: Subcategory[] };

const visuals: Record<string, { glyph: string; tone: string }> = {
  food: { glyph: "☕", tone: "from-[#fff1e8] to-[#fffaf7] text-[#c26b36]" },
  shopping: { glyph: "🛍️", tone: "from-[#fff0f3] to-[#fffafb] text-[#d33c5a]" },
  fashion: { glyph: "✦", tone: "from-[#f3ecff] to-[#fbf9ff] text-[#8553bd]" },
  beauty: { glyph: "✿", tone: "from-[#fff0f6] to-[#fffafd] text-[#d64975]" },
  health: { glyph: "＋", tone: "from-[#e9faf6] to-[#f8fffd] text-[#319a88]" },
  education: { glyph: "✎", tone: "from-[#eef3ff] to-[#fafbff] text-[#4c6fc7]" },
  home: { glyph: "⌂", tone: "from-[#fff8df] to-[#fffdf4] text-[#ad801f]" },
  automotive: { glyph: "▰", tone: "from-[#eff7fa] to-[#fbfdfe] text-[#55717e]" },
  business: { glyph: "↗", tone: "from-[#fff0f2] to-[#fffafb] text-[#c70d46]" },
  technology: { glyph: "⌘", tone: "from-[#eff1ff] to-[#fbfbff] text-[#5968c5]" },
};

const popular = [["فروشگاه اینستاگرامی", "online-shops", "instagram-shop"], ["میکاپ آرتیست", "beauty", "makeup-artist"], ["طلافروشی", "shopping", "gold-jewelry"], ["داروخانه", "health", "pharmacy"]];

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
    <section id="directory" className="border-y border-[#eadfe2] bg-gradient-to-b from-white to-[#fff9fa]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-[#f0f0f1] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div><span className="text-[11px] font-bold tracking-[0.16em] text-[#ef4056]">دسته‌بندی‌ها</span><h2 className="mt-2 text-2xl font-black text-[#27272a]">چی می‌خوای پیدا کنی؟</h2><p className="mt-1 text-sm text-[#71717a]">دسته را انتخاب کن و بهترین گزینه‌های اطرافت را ببین.</p></div>
          <div className="relative w-full lg:w-[360px]">
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#71717a]">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در دسته‌ها" className="h-12 w-full rounded-xl border border-[#d4d4d8] bg-white pr-11 pl-4 text-sm text-[#27272a] outline-none" />
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-bold text-[#71717a]">پیشنهاد ما:</span>
          {popular.map(([label, category, sub]) => <Link key={sub} href={`/category/${category}/${sub}`} className="shrink-0 rounded-lg bg-[#fafafa] px-3 py-2 text-[11px] font-bold text-[#52525b] transition hover:bg-[#fff0f2] hover:text-[#ef4056]">{label}</Link>)}
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {visible.map(({ category, children }) => {
            const visual = visuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f5f5f5] to-white text-[#ef4056]" };
            return <Link key={category.id} href={`/category/${category.slug}`} className="group relative flex min-h-[142px] flex-col items-center justify-center overflow-hidden rounded-[1.35rem] border border-[#eee1e4] bg-white px-2 py-4 shadow-[0_8px_22px_-20px_rgba(111,35,50,.5)] transition hover:-translate-y-0.5 hover:border-[#ef4056]/50 hover:shadow-[0_6px_18px_rgba(0,0,0,.07)]">
              <span className={`beeroon-tile grid h-16 w-16 place-items-center rounded-[1.35rem] bg-gradient-to-br text-2xl ${visual.tone}`}>{visual.glyph}</span>
              <span className="mt-3 truncate text-center text-xs font-black text-[#3f3f46] group-hover:text-[#ef4056]">{category.name}</span>
              <span className="mt-1 text-[10px] text-[#a1a1aa]">{children.length} تخصص</span>
            </Link>;
          })}
        </div>
        {visible.length === 0 && <div className="mt-7 rounded-xl border border-dashed border-[#d4d4d8] py-12 text-center text-sm text-[#71717a]">نتیجه‌ای برای این جست‌وجو پیدا نشد.</div>}
        {groups.length > 12 && !normalized && <button onClick={() => setShowAll((value) => !value)} className="mx-auto mt-7 block rounded-xl border border-[#d4d4d8] bg-white px-5 py-2.5 text-xs font-bold text-[#52525b] transition hover:border-[#ef4056] hover:text-[#ef4056]">{showAll ? "نمایش کمتر" : `نمایش همه دسته‌ها (${groups.length})`}</button>}
      </div>
    </section>
  );
}