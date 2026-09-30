import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkRateLimit, isValidUuid } from "@/lib/rate-limit";

const allowedEvents = new Set([
  "search",
  "view_business",
  "click_call",
  "click_whatsapp",
  "click_directions",
  "click_website",
  "search_no_results",
  "call",
  "directions",
  "profile_view",
  "whatsapp",
  "website",
]);

export async function POST(request: Request) {
  const sessionId =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anon";
  const rate = checkRateLimit("api_events_per_session", sessionId, 60 * 1000, 30);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } },
    );
  }
  try {
    const payload = await request.json();
    if (!allowedEvents.has(payload?.eventName)) return NextResponse.json({ ok: false }, { status: 400 });
    if (payload?.businessId != null && !isValidUuid(payload.businessId)) {
      return NextResponse.json({ ok: false, error: "invalid_business_id" }, { status: 400 });
    }
    if (payload?.anonymous_session_id != null && !isValidUuid(payload.anonymous_session_id)) {
      return NextResponse.json({ ok: false, error: "invalid_session_id" }, { status: 400 });
    }
    if (payload?.search_id != null && !isValidUuid(payload.search_id)) {
      return NextResponse.json({ ok: false, error: "invalid_search_id" }, { status: 400 });
    }
    if (payload?.query != null && typeof payload.query !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("analytics_events").insert({
      event_name: payload.eventName,
      business_id: typeof payload.businessId === "string" ? payload.businessId : null,
      search_id: typeof payload.search_id === "string" ? payload.search_id : null,
      anonymous_session_id:
        typeof payload.anonymous_session_id === "string" ? payload.anonymous_session_id : null,
      query: typeof payload.query === "string" ? payload.query.slice(0, 240) : null,
      city: typeof payload.city === "string" ? payload.city.slice(0, 80) : null,
      neighborhood: typeof payload.neighborhood === "string" ? payload.neighborhood.slice(0, 120) : null,
    });
    if (error) return NextResponse.json({ ok: true, stored: false });
    return NextResponse.json({ ok: true, stored: true }, { status: 202 });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
