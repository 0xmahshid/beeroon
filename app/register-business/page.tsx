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
    bale: "",
    whatsapp: "",
    neshan: "",
    hours: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function set(key: string, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
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
      bale: form.bale || null,
      whatsapp: form.whatsapp || null,
      neshan: form.neshan || null,
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
        <p className="text-lg font-black text-[#c91442]">ثبت شد!</p>
        <p className="mt-2 text-[#6f6261]">
          تیم بیرون به‌زودی اطلاعات شما را بررسی و فعال می‌کند.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl px-4 py-14">
      <div className="rounded-[2rem] border border-[#eadfd7] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(77,30,36,0.55)] sm:p-9">
        <p className="text-xs font-black tracking-[0.2em] text-[#c91442]">FOR LOCAL OWNERS</p>
        <h1 className="mt-2 text-2xl font-black text-[#241b1c]">ثبت رایگان کسب‌وکار</h1>
        <p className="mt-2 text-sm leading-7 text-[#80716f]">
          هر راه ارتباطی را که داری وارد کن تا مشتری‌ها راحت‌تر پیدایت کنند.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {[
            ["name", "نام کسب‌وکار", true],
            ["address", "آدرس", true],
            ["phone", "تلفن", true],
            ["hours", "ساعات کاری", false],
            ["instagram", "آیدی اینستاگرام", false],
            ["telegram", "آیدی تلگرام", false],
            ["bale", "آیدی بله", false],
            ["whatsapp", "شماره واتساپ", false],
            ["neshan", "لینک یا نام مکان در نشان", false],
          ].map(([key, label, required]) => (
            <label key={key as string} className="text-sm font-bold text-[#4b3b3c]">
              {label as string}
              <input
                required={required as boolean}
                value={form[key as keyof typeof form]}
                onChange={(e) => set(key as string, e.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none transition focus:border-[#c91442] focus:ring-4 focus:ring-[#c91442]/10"
              />
            </label>
          ))}
        </div>
        {err && <p className="mt-4 text-sm text-[#b6113d]">{err}</p>}
        <button className="mt-7 w-full rounded-full bg-[#c91442] py-3.5 font-bold text-white transition hover:bg-[#a70f37]">
          ارسال برای بررسی
        </button>
      </div>
    </form>
  );
}