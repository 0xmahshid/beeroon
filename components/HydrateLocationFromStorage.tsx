"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LS_CITY = "beeroon:lastCity";

export default function HydrateLocationFromStorage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(searchParams.toString());
    const hasCity = params.has("city");

    try {
      if (!hasCity) {
        const lastCity = localStorage.getItem(LS_CITY);
        if (lastCity) params.set("city", lastCity);
      }
      params.delete("neighborhood");
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
