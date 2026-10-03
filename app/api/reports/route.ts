import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { checkRateLimit, isValidUuid } from "@/lib/rate-limit";

const reasons = new Set(["wrong_phone", "wrong_address", "closed", "wrong_category", "other"]);

export async function POST(request: Request) {
  const identity =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "anon";
  const rate = checkRateLimit("api_reports_per_ip", identity, 60 * 1000, 10);
  if (!rate.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rate.resetMs / 1000)) } },
    );
  }
  try {
    const payload = await request.json();
    if (!isValidUuid(payload?.businessId) || !reasons.has(payload?.reason)) {
      return NextResponse.json({ ok: false, error: "اطلاعات گزارش درست نیست." }, { status: 400 });
    }
    if (payload?.note != null && typeof payload.note !== "string") {
      return NextResponse.json({ ok: false, error: "یادداشت گزارش باید متن باشد." }, { status: 400 });
    }
    if (payload?.page_source != null && typeof payload.page_source !== "string") {
      return NextResponse.json({ ok: false, error: "منبع گزارش باید متن باشد." }, { status: 400 });
    }
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("business_reports")
      .insert({
        business_id: payload.businessId,
        reason: payload.reason,
        note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : null,
        page_source:
          typeof payload.page_source === "string" ? payload.page_source.slice(0, 512) : null,
        status: "received",
      })
      .select("id, status")
      .single();
    if (error) return NextResponse.json({ ok: false }, { status: 400 });
    return NextResponse.json({ ok: true, report: data }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

