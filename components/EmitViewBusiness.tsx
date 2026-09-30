"use client";

import { useEffect, useRef } from "react";
import { getAnonymousSessionId } from "@/lib/analytics";

type Props = {
  businessId: string;
  city?: string;
  neighborhood?: string;
};

export default function EmitViewBusiness({ businessId, city, neighborhood }: Props) {
  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const sessionId = getAnonymousSessionId();
    const body: Record<string, unknown> = {
      eventName: "view_business",
      anonymous_session_id: sessionId,
      businessId,
    };
    if (city) body.city = city;
    if (neighborhood) body.neighborhood = neighborhood;
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  }, [businessId, city, neighborhood]);
  return null;
}
