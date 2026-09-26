"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { City } from "@/lib/types";

export default function CityPicker({ cities }: { cities: City[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("city") || "mashhad";
  const selected = cities.find((city) => city.slug === selectedSlug) || cities[0];

  function changeCity(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("city", value);
    router.replace(pathname + "?" + params.toString(), { scroll: false });
  }

  return (
    <label className="flex shrink-0 items-center gap-2 rounded-xl border border-[#eadfe2] bg-white px-2.5 py-2 text-[11px] font-bold text-[#5e4a52] shadow-[0_6px_16px_-16px_rgba(70,20,38,.5)]">
      <span className="text-[#ef4056]" aria-hidden="true">⌖</span>
      <span className="hidden text-[#a18e95] sm:inline">شهر</span>
      <select
        aria-label="انتخاب شهر"
        value={selected?.slug || "mashhad"}
        onChange={(event) => changeCity(event.target.value)}
        className="max-w-[6.5rem] cursor-pointer bg-transparent text-xs font-black text-[#3d1833] outline-none"
      >
        {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
      </select>
    </label>
  );
}