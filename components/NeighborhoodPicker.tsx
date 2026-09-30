"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Neighborhood } from "@/lib/types";

const LS_CITY = "beeroon:lastCity";
const LS_NEIGHBORHOOD = "beeroon:lastNeighborhood";

export default function NeighborhoodPicker({ initial }: { initial: Neighborhood[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const city = searchParams.get("city") || "mashhad";
  const neighborhoodFromUrl = searchParams.get("neighborhood");

  useEffect(() => {
    try {
      if (city) localStorage.setItem(LS_CITY, city);
      if (neighborhoodFromUrl) localStorage.setItem(LS_NEIGHBORHOOD, neighborhoodFromUrl);
      else localStorage.removeItem(LS_NEIGHBORHOOD);
    } catch {
      /* storage not available */
    }
  }, [city, neighborhoodFromUrl]);

  const options = initial.filter((item) => item.citySlug === city);
  const selected = neighborhoodFromUrl || "";

  if (!options.length) return null;

  function changeNeighborhood(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("neighborhood", value);
    else params.delete("neighborhood");
    router.replace(pathname + (params.toString() ? "?" + params.toString() : ""), { scroll: false });
  }

  return (
    <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#8f8283]">
      <span className="text-[#c91442]" aria-hidden="true">⌖</span>
      <select aria-label="انتخاب محله" value={selected} onChange={(event) => changeNeighborhood(event.target.value)} className="max-w-[7.5rem] cursor-pointer bg-transparent font-semibold text-[#8f8283] outline-none">
        <option value="">همه محله‌ها</option>
        {options.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
      </select>
    </label>
  );
}
