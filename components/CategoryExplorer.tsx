"use client";

import Link from "next/link";
import { Category, Subcategory } from "@/lib/types";

type Props = { categories: Category[]; subcategories: Subcategory[]; citySlug?: string };

export default function CategoryExplorer({ categories, citySlug = "mashhad" }: Props) {
  const cityQuery = "?city=" + encodeURIComponent(citySlug);
  return (
    <section id="directory" className="sample-section">
      <div className="sample-section-head"><h2>دسته‌بندی‌ها</h2><Link href={"/search" + cityQuery}>مشاهده همه</Link></div>
      <div className="sample-chip-row">
        <Link href={"/" + cityQuery + "#directory"} className="sample-chip active">همه</Link>
        {categories.slice(0, 14).map((category) => <Link key={category.id} href={"/category/" + category.slug + cityQuery} className="sample-chip">{category.name}</Link>)}
      </div>
    </section>
  );
}