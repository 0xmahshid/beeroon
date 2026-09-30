"use client";

import { useState } from "react";

const REASONS: { key: string; label: string }[] = [
  { key: "wrong_phone", label: "شماره تلفن اشتباه" },
  { key: "wrong_address", label: "آدرس اشتباه" },
  { key: "closed", label: "کسب‌وکار تعطیل شده" },
  { key: "wrong_category", label: "دسته‌بندی اشتباه" },
  { key: "other", label: "سایر" },
];

export default function ReportForm({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setStatus("error");
      setErrorMsg("لطفاً دلیل گزارش را انتخاب کنید");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          reason,
          note: note.trim() || undefined,
          page_source: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "ارسال گزارش ناموفق بود");
      }
      setStatus("success");
      setReason("");
      setNote("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "ارسال گزارش ناموفق بود");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-[#e8dcdc] bg-[#fdfafa] px-4 py-3 text-xs font-bold text-[#6b5962] transition hover:border-[#d51f4f] hover:text-[#d51f4f]"
      >
        اطلاعات این کسب‌وکار اشتباه است؟ گزارش کنید
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#f0e9ea] bg-[#fdfafa] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#3a2a30]">گزارش اطلاعات اشتباه</h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setStatus("idle");
            setErrorMsg("");
          }}
          className="rounded-lg px-2 py-1 text-xs text-[#8f8283] hover:bg-[#f0e9ea]"
        >
          بستن
        </button>
      </div>

      {status === "success" ? (
        <div className="mt-4 rounded-xl border border-[#cfe9d4] bg-[#f2fbf4] p-4 text-xs font-bold text-[#14682a]">
          گزارش شما با موفقیت ثبت شد و به‌زودی بررسی می‌شود. ممنون از کمک شما.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#3a2a30]">دلیل گزارش *</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {REASONS.map((r) => (
                <label
                  key={r.key}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${
                    reason === r.key
                      ? "border-[#d51f4f] bg-[#fff6f8] text-[#c91442]"
                      : "border-[#e8dcdc] bg-white text-[#6b5962] hover:border-[#e2c5cd]"
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={r.key}
                    checked={reason === r.key}
                    onChange={() => setReason(r.key)}
                    className="h-3.5 w-3.5 accent-[#d51f4f]"
                  />
                  <span className="font-bold">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-[#3a2a30]">توضیحات اختیاری</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 1000))}
              rows={3}
              placeholder="جزئیات بیشتری توضیح دهید..."
              className="w-full rounded-xl border border-[#e8dcdc] bg-white px-3 py-2.5 text-xs text-[#3a2a30] outline-none transition focus:border-[#d51f4f] focus:ring-2 focus:ring-[#ffe3eb]"
            />
            <div className="mt-1 text-[10px] text-[#8f8283]">{note.length}/1000</div>
          </div>

          {status === "error" && errorMsg && (
            <div className="rounded-xl border border-[#f2cfcf] bg-[#fff3f3] p-3 text-xs font-bold text-[#b42335]">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-[#c91442] px-4 py-3 text-xs font-extrabold text-white transition hover:bg-[#b1113a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "در حال ارسال..." : "ثبت گزارش"}
          </button>

          <p className="text-[10px] leading-relaxed text-[#8f8283]">
            ثبت گزارش نیازی به ثبت‌نام ندارد. گزارش‌های شما فقط توسط تیم ادمین بررسی می‌شوند.
          </p>
        </div>
      )}
    </form>
  );
}
