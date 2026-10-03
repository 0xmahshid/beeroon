"use client";

import Link from "next/link";
import { Category, Subcategory } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

type Props = { categories: Category[]; subcategories: Subcategory[]; citySlug?: string };
const tones = [
  "bg-[#fff0f3] text-[#d51f4f]", "bg-[#fff5dc] text-[#b47d13]", "bg-[#eef8f5] text-[#248873]", "bg-[#f1efff] text-[#705cb4]",
  "bg-[#edf5ff] text-[#467bb0]", "bg-[#fff0e3] text-[#ba6a3b]", "bg-[#f4eef8] text-[#8a5ca8]", "bg-[#edf8e6] text-[#5c9851]",
];

export default function CategoryExplorer({ categories, subcategories, citySlug = "mashhad" }: Props) {
  const cityQuery = "?city=" + encodeURIComponent(citySlug);
  return (
    <section id="directory" className="border-y border-[#eadfe3] bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4"><div><span className="beeroon-section-label">دسته‌ها</span><h2 className="mt-2 text-2xl font-black text-[#32162d]">دسته‌بندی‌ها</h2><p className="mt-2 text-xs text-[#8b7b84]">یک دسته را انتخاب کن تا کسب‌وکارهای مرتبط را ببینی.</p></div><Link href={"/search" + cityQuery} className="shrink-0 text-xs font-black text-[#d51f4f]">دیدن همه‌ی کسب‌وکارها ←</Link></div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category, index) => {
            const count = subcategories.filter((item) => item.category_id === category.id).length;
            return <Link key={category.id} href={"/category/" + category.slug + cityQuery} className="category-tile group relative overflow-hidden rounded-[1.3rem] border border-[#eee3e6] bg-[#fffdfd] p-4">
              <span className={"grid h-14 w-14 place-items-center rounded-[1.1rem] " + tones[index % tones.length]}><CategoryIcon slug={category.slug} className="category-icon" /></span>
              <h3 className="mt-4 truncate text-xs font-black text-[#44343c] group-hover:text-[#d51f4f]">{category.name}</h3>
              <p className="mt-1 text-[10px] text-[#a08f96]">{count ? count + " تخصص" : "دیدن گزینه‌ها"} <span className="float-left text-[#d51f4f]">←</span></p>
            </Link>;
          })}
        </div>
      </div>
    </section>
  );
}