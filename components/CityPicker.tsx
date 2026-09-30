"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { City } from "@/lib/types";

const LS_CITY = "beeroon:lastCity";
const LS_NEIGHBORHOOD = "beeroon:lastNeighborhood";

export default function CityPicker({ cities }: { cities: City[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("city") || "mashhad";
  const selected = cities.find((city) => city.slug === selectedSlug) || cities[0];

  useEffect(() => {
    try {
      if (selectedSlug) localStorage.setItem(LS_CITY, selectedSlug);
    } catch {
      /* storage not available */
    }
  }, [selectedSlug]);

  function changeCity(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("city", value);
    params.delete("neighborhood");
    try {
      localStorage.setItem(LS_CITY, value);
      localStorage.removeItem(LS_NEIGHBORHOOD);
    } catch {
      /* storage not available */
    }
    router.replace(pathname + "?" + params.toString(), { scroll: false });
  }

  return (
    <label className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold text-[#8f8283]">
      <svg className="h-3.5 w-3.5 text-[#c91442]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" />
      </svg>
      <select aria-label="انتخاب شهر" value={selected?.slug || "mashhad"} onChange={(event) => changeCity(event.target.value)} className="max-w-[6.5rem] cursor-pointer bg-transparent font-semibold text-[#8f8283] outline-none">
        {cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}
      </select>
    </label>
  );
}
