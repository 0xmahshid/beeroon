"use client";

import { useEffect, useRef } from "react";
import { getAnonymousSessionId } from "@/lib/analytics";

type Props = {
  searchId: string;
  query?: string;
  city?: string;
  resultsCount: number;
};

export default function EmitSearchEvents({ searchId, query, city, resultsCount }: Props) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const sessionId = getAnonymousSessionId();
    const common: Record<string, unknown> = {
      anonymous_session_id: sessionId,
      search_id: searchId,
    };
    if (query) common.query = query;
    if (city) common.city = city;
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "search", ...common }),
    }).catch(() => undefined);
    if (resultsCount === 0) {
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventName: "search_no_results", ...common }),
      }).catch(() => undefined);
    }
  }, [searchId, query, city, resultsCount]);
  return null;
}
