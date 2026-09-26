"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterBusiness() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
    hours: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.from("businesses").insert({
      name: form.name,
      address: form.address,
      phone: form.phone,
      instagram: form.instagram || null,
      telegram: form.telegram || null,
      whatsapp: form.whatsapp || null,
      hours: form.hours || null,
      status: "pending",
      city_id: "mashhad",
    });
    if (error) setErr("مشکلی پیش اومد. دوباره تلاش کن.");
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="text-lg font-bold">ثبت شد! 🎉</p>
        <p className="mt-2 text-ink-900/60 dark:text-ink-50/60">
          تیم بیرون به‌زودی اطلاعات شما رو بررسی و فعال می‌کنه.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-xl font-bold">ثبت رایگان کسب‌وکار</h1>
      <p className="mt-1 text-sm text-ink-900/60 dark:text-ink-50/60">
        سه ماه اول رایگان — فقط پروفایل رو کامل کن.
      </p>
      <div className="mt-6 space-y-3">
        {[
          ["name", "نام کسب‌وکار"],
          ["address", "آدرس"],
          ["phone", "تلفن"],
          ["instagram", "آیدی اینستاگرام (بدون @)"],
          ["telegram", "آیدی تلگرام (اختیاری)"],
          ["whatsapp", "شماره واتساپ (اختیاری)"],
          ["hours", "ساعات کاری"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
              required={["name", "address", "phone"].includes(key)}
              value={(form as any)[key]}
              onChange={(e) => set(key, e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 outline-none focus:border-brand-500 dark:border-white/10 dark:bg-ink-900"
            />
          </div>
        ))}
      </div>
      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      <button className="mt-6 w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600">
        ثبت کسب‌وکار
      </button>
    </form>
  );
}
