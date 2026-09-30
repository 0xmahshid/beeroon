"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LS_CITY = "beeroon:lastCity";
const LS_NEIGHBORHOOD = "beeroon:lastNeighborhood";

export default function HydrateLocationFromStorage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    if (typeof window === "undefined") return;
    const hasCity = searchParams.has("city");
    const hasNeighborhood = searchParams.has("neighborhood");

    if (hasCity && hasNeighborhood) return;
    if (hasCity) return;

    try {
      const lastCity = localStorage.getItem(LS_CITY);
      const lastNeighborhood = localStorage.getItem(LS_NEIGHBORHOOD);
      if (!lastCity) return;

      const params = new URLSearchParams(searchParams.toString());
      if (!hasCity && lastCity) params.set("city", lastCity);
      if (!hasNeighborhood && lastNeighborhood) params.set("neighborhood", lastNeighborhood);

      const queryString = params.toString();
      if (queryString !== searchParams.toString()) {
        router.replace(pathname + (queryString ? "?" + queryString : ""), { scroll: false });
      }
    } catch {
      /* storage unavailable or malformed */
    }
  }, [pathname, router, searchParams]);

  return null;
}
