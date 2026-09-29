import { NextResponse } from "next/server";
    import { createSupabaseServerClient } from "@/lib/supabase-server";

    const allowedEvents = new Set(["search", "view_business", "click_call", "click_whatsapp", "click_directions", "search_no_results", "call", "directions", "profile_view", "whatsapp", "website"]);

    export async function POST(request: Request) {
    try {
      const payload = await request.json();
      if (!allowedEvents.has(payload?.eventName)) return NextResponse.json({ ok: false }, { status: 400 });
      if (payload?.businessId != null && typeof payload.businessId !== "string") return NextResponse.json({ ok: false }, { status: 400 });
      if (payload?.query != null && typeof payload.query !== "string") return NextResponse.json({ ok: false }, { status: 400 });
      const supabase = await createSupabaseServerClient();
      const { error } = await supabase.from("analytics_events").insert({
        event_name: payload.eventName,
        business_id: payload.businessId || null,
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
    