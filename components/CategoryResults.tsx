"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import type { Business, Category, City, Subcategory } from "@/lib/types";

type Props = {
  slug: string;
  sub?: string;
  category?: Category;
  selected?: Subcategory;
  subcategories: Subcategory[];
  businesses: Business[];
  city: City;
  initialQuery?: { type?: string; price?: string; sort?: string };
};
type Sort = "relevant" | "newest" | "name";
type BusinessType = Business["business_type"];
type Price = 1 | 2 | 3;

export default function CategoryResults({ slug, sub, category, selected, subcategories, businesses, city, initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [types, setTypes] = useState<BusinessType[]>(initialQuery?.type?.split(",").filter((value): value is BusinessType => value === "physical" || value === "online_shop") || []);
  const [prices, setPrices] = useState<Price[]>(initialQuery?.price?.split(",").map(Number).filter((value): value is Price => value === 1 || value === 2 || value === 3) || []);
  const [sort, setSort] = useState<Sort>(initialQuery?.sort === "newest" || initialQuery?.sort === "name" ? initialQuery.sort : "relevant");
  const title = selected?.name || category?.name || "دسته‌بندی";
  const categoryName = category?.name || "دسته‌بندی";
  const cityQuery = "?city=" + encodeURIComponent(city.slug);

  const filtered = useMemo(() => {
    const result = businesses.filter((business) => {
      const typeOk = !types.length || types.includes(business.business_type);
      const priceOk = !prices.length || (business.price_tier !== null && prices.includes(business.price_tier));
      return typeOk && priceOk;
    });
    if (sort === "newest") return [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sort === "name") return [...result].sort((a, b) => a.name.localeCompare(b.name, "fa"));
    return result;
  }, [businesses, prices, sort, types]);

  function sync(nextTypes: BusinessType[], nextPrices: Price[], nextSort: Sort) {
    const params = new URLSearchParams({ city: city.slug });
    if (nextTypes.length) params.set("type", nextTypes.join(","));
    if (nextPrices.length) params.set("price", nextPrices.join(","));
    if (nextSort !== "relevant") params.set("sort", nextSort);
    router.replace(pathname + "?" + params.toString(), { scroll: false });
  }

  function toggleType(value: BusinessType) {
    const next = types.includes(value) ? types.filter((item) => item !== value) : [...types, value];
    setTypes(next); sync(next, prices, sort);
  }
  function togglePrice(value: Price) {
    const next = prices.includes(value) ? prices.filter((item) => item !== value) : [...prices, value];
    setPrices(next); sync(types, next, sort);
  }
  function clear() { setTypes([]); setPrices([]); setSort("relevant"); sync([], [], "relevant"); }

  return (
    <div className="sample-container min-h-screen pb-6">
      <div className="flex items-center justify-between py-4">
        <Link href={category ? "/?city=" + encodeURIComponent(city.slug) : "/"} className="text-xs font-bold text-[#8f8283] hover:text-[#c91442]">← بازگشت</Link>
        <span className="text-[11px] text-[#8f8283]">بیرون / {categoryName}</span>
      </div>
      <section className="border-b border-[#f0e9ea] pb-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#fff6f8] text-[#c91442]"><CategoryIcon slug={category?.slug || slug} className="h-6 w-6" /></span>
          <div><h1 className="text-[17px] font-extrabold">{title}</h1><p className="mt-1 text-[11px] text-[#8f8283]">{businesses.length.toLocaleString("fa-IR")} کسب‌وکار در {city.name}</p></div>
        </div>
      </section>
      <div className="sample-chip-row py-3">
        <Link href={"/category/" + slug + cityQuery} className={"sample-chip " + (!selected ? "active" : "")}>همه</Link>
        {subcategories.map((item) => <Link key={item.id} href={"/category/" + slug + "/" + item.slug + cityQuery} className={"sample-chip " + (selected?.slug === item.slug ? "active" : "")}>{item.name}</Link>)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[#f0e9ea] py-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => toggleType("physical")} className={"sample-chip " + (types.includes("physical") ? "active" : "")}>حضوری</button>
          <button onClick={() => toggleType("online_shop")} className={"sample-chip " + (types.includes("online_shop") ? "active" : "")}>آنلاین‌شاپ</button>
          <button onClick={() => togglePrice(1)} className={"sample-chip " + (prices.includes(1) ? "active" : "")}>اقتصادی</button>
          {((types.length > 0) || (prices.length > 0)) && <button onClick={clear} className="sample-chip text-[#c91442]">پاک کردن</button>}
        </div>
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#8f8283]">مرتب‌سازی
          <select value={sort} onChange={(event) => { const value = event.target.value as Sort; setSort(value); sync(types, prices, value); }} className="rounded-lg border border-[#f0e9ea] bg-white px-2 py-1.5 text-[10px] font-bold outline-none">
            <option value="relevant">مرتبط‌ترین</option><option value="newest">جدیدترین</option><option value="name">الفبایی</option>
          </select>
        </label>
      </div>
      <div className="mt-2 flex items-center justify-between"><h2 className="text-sm font-extrabold">نتیجه‌ها</h2><span className="text-[11px] text-[#8f8283]">{filtered.length} نتیجه</span></div>
      {filtered.length > 0 ? <div className="sample-grid-md mt-1">{filtered.map((business) => <BusinessCard key={business.id} b={business} />)}</div> : <div className="py-16 text-center text-xs text-[#8f8283]">با این فیلتر چیزی پیدا نشد.</div>}
    </div>
  );
}