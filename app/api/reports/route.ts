import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

const reasons = new Set(["wrong_phone", "wrong_address", "closed", "wrong_category", "other"]);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    if (typeof payload?.businessId !== "string" || !reasons.has(payload?.reason)) {
      return NextResponse.json({ ok: false, error: "اطلاعات گزارش معتبر نیست" }, { status: 400 });
    }
    if (payload?.note != null && typeof payload.note !== "string") {
      return NextResponse.json({ ok: false, error: "یادداشت گزارش معتبر نیست" }, { status: 400 });
    }
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("business_reports").insert({
      business_id: payload.businessId,
      reason: payload.reason,
      note: typeof payload.note === "string" ? payload.note.slice(0, 1000) : null,
      status: "received",
    }).select("id, status").single();
    if (error) return NextResponse.json({ ok: false }, { status: 400 });
    return NextResponse.json({ ok: true, report: data }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
