"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Category, Subcategory } from "@/lib/types";

type Props = { categories: Category[]; subcategories: Subcategory[] };

const visuals: Record<string, { glyph: string; tone: string }> = {
  food: { glyph: "☕", tone: "from-[#fff0e6] to-[#fff8f4] text-[#bd6536]" }, shopping: { glyph: "🛍️", tone: "from-[#ffe9ef] to-[#fff5f7] text-[#d23b5b]" }, fashion: { glyph: "✦", tone: "from-[#f0e8ff] to-[#faf8ff] text-[#8553bd]" }, beauty: { glyph: "✿", tone: "from-[#ffe9f3] to-[#fff5f9] text-[#d64975]" }, health: { glyph: "＋", tone: "from-[#e3faf4] to-[#f5fffc] text-[#268e7d]" }, education: { glyph: "✎", tone: "from-[#eaf0ff] to-[#f7f9ff] text-[#4c6fc7]" }, home: { glyph: "⌂", tone: "from-[#fff5d8] to-[#fffaf0] text-[#a47616]" }, automotive: { glyph: "▰", tone: "from-[#e9f5f8] to-[#f7fcfd] text-[#55717e]" }, business: { glyph: "↗", tone: "from-[#ffe8ef] to-[#fff3f6] text-[#c70d46]" }, technology: { glyph: "⌘", tone: "from-[#edf0ff] to-[#fafbff] text-[#5968c5]" },
};

const popular = [["فروشگاه اینستاگرامی", "online-shops", "instagram-shop"], ["میکاپ آرتیست", "beauty", "makeup-artist"], ["طلافروشی", "shopping", "gold-jewelry"], ["داروخانه", "health", "pharmacy"]];

export default function CategoryExplorer({ categories, subcategories }: Props) {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const normalized = query.trim().toLocaleLowerCase("fa");
  const groups = useMemo(() => categories.map((category) => { const children = subcategories.filter((item) => item.category_id === category.id); const matches = !normalized || category.name.toLocaleLowerCase("fa").includes(normalized) || children.some((item) => item.name.toLocaleLowerCase("fa").includes(normalized)); return { category, children, matches }; }).filter((group) => group.matches), [categories, subcategories, normalized]);
  const visible = normalized || showAll ? groups : groups.slice(0, 12);

  return (
    <section id="directory" className="border-y border-[#f0dfe3] bg-gradient-to-b from-white via-[#fffafa] to-[#fff3f5]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-[#f3e8ea] pb-6 lg:flex-row lg:items-end lg:justify-between"><div><span className="text-[11px] font-black tracking-[0.16em] text-[#ef4056]">دسته‌بندی‌ها</span><h2 className="mt-2 text-2xl font-black text-[#33212b]">چی می‌خوای پیدا کنی؟</h2><p className="mt-1 text-sm text-[#87737b]">دسته را انتخاب کن و بهترین گزینه‌های اطرافت را ببین.</p></div><div className="relative w-full lg:w-[360px]"><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#87737b]">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="جست‌وجو در دسته‌ها" className="h-12 w-full rounded-2xl border border-[#eadfe2] bg-white pr-11 pl-4 text-sm text-[#33212b] outline-none transition hover:border-[#ef4056]/50" /></div></div>
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1"><span className="shrink-0 text-xs font-bold text-[#87737b]">پیشنهاد ما:</span>{popular.map(([label, category, sub]) => <Link key={sub} href={"/category/" + category + "/" + sub} className="shrink-0 rounded-xl border border-[#f0e5e7] bg-white px-3 py-2 text-[11px] font-bold text-[#5e4a52] transition hover:border-[#f1b7c0] hover:bg-[#fff0f3] hover:text-[#ef4056]">{label}</Link>)}</div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">{visible.map(({ category, children }) => { const visual = visuals[category.slug] || { glyph: category.icon || "✦", tone: "from-[#f5f0f2] to-white text-[#ef4056]" }; return <Link key={category.id} href={"/category/" + category.slug} className="group relative flex min-h-[148px] flex-col items-center justify-center overflow-hidden rounded-[1.45rem] border border-[#f0e2e5] bg-white px-2 py-4 shadow-[0_10px_24px_-24px_rgba(111,35,50,.8)] transition hover:-translate-y-1 hover:border-[#ef4056]/45 hover:shadow-[0_14px_28px_-20px_rgba(111,35,50,.25)]"><span className="absolute inset-x-5 top-0 h-1 rounded-b-full bg-gradient-to-r from-[#ffd36e] via-[#ef4056] to-[#a94574] opacity-70 transition group-hover:inset-x-3" /><span className={"grid h-16 w-16 place-items-center rounded-[1.35rem] bg-gradient-to-br text-2xl shadow-[0_8px_18px_-16px_rgba(80,20,40,.5)] " + visual.tone}>{visual.glyph}</span><span className="mt-3 truncate text-center text-xs font-black text-[#45343b] group-hover:text-[#ef4056]">{category.name}</span><span className="mt-1 text-[10px] text-[#a18e95]">{children.length} تخصص</span></Link>; })}</div>
        {visible.length === 0 && <div className="mt-7 rounded-2xl border border-dashed border-[#e3cdd2] bg-white/70 py-12 text-center text-sm text-[#87737b]">نتیجه‌ای برای این جست‌وجو پیدا نشد.</div>}
        {groups.length > 12 && !normalized && <button onClick={() => setShowAll((value) => !value)} className="mx-auto mt-7 block rounded-xl border border-[#eadfe2] bg-white px-5 py-2.5 text-xs font-bold text-[#5e4a52] transition hover:border-[#ef4056] hover:text-[#ef4056]">{showAll ? "نمایش کمتر" : "نمایش همه دسته‌ها (" + groups.length + ")"}</button>}
      </div>
    </section>
  );
}
