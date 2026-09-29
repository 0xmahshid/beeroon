import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const allowedEvents = new Set(["call", "directions", "profile_view", "whatsapp", "website"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (!allowedEvents.has(payload?.eventName) || typeof payload?.businessId !== "string") return NextResponse.json({ ok: false }, { status: 400 });
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("analytics_events").insert({ event_name: payload.eventName, business_id: payload.businessId });
    if (error) return NextResponse.json({ ok: true, stored: false });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }
}
