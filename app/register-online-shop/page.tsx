"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  phone: string;
  instagram: string;
  website_url: string;
  specialty_category: string;
  sales_type: "retail" | "wholesale" | "both";
  shipping_area: string;
  shipping_methods: string[];
  payment_methods: string[];
};

const shippingOptions = [
  ["courier", "پیک شهری"],
  ["post", "پست"],
  ["tipax", "تیپاکس"],
  ["pickup", "تحویل حضوری"],
  ["other", "روش دیگر"],
];

const paymentOptions = [
  ["gateway", "درگاه آنلاین"],
  ["card", "کارت‌به‌کارت"],
  ["cod", "پرداخت در محل"],
  ["wallet", "کیف پول / اعتبار"],
];

export default function RegisterOnlineShop() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    instagram: "",
    website_url: "",
    specialty_category: "",
    sales_type: "retail",
    shipping_area: "",
    shipping_methods: [],
    payment_methods: [],
  });
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function setField(key: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggle(key: "shipping_methods" | "payment_methods", value: string) {
    setForm((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!form.website_url.trim() && !form.instagram.trim()) {
      setErr("حداقل لینک سایت یا آیدی اینستاگرام را وارد کن.");
      return;
    }
    if (!form.shipping_methods.length || !form.payment_methods.length) {
      setErr("حداقل یک روش ارسال و یک روش پرداخت را انتخاب کن.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("submit_online_shop", {
      p_name: form.name.trim(),
      p_phone: form.phone.trim(),
      p_instagram: form.instagram.trim() || null,
      p_city_id: "mashhad",
      p_website_url: form.website_url.trim() || null,
      p_sales_type: form.sales_type,
      p_shipping_area: form.shipping_area.trim(),
      p_shipping_methods: form.shipping_methods,
      p_payment_methods: form.payment_methods,
      p_specialty_category: form.specialty_category.trim(),
    });
    setSaving(false);
    if (error) {
      setErr("ثبت اطلاعات انجام نشد. اگر مشکل ادامه داشت، دوباره تلاش کن.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="rounded-[2rem] border border-[#cfe6df] bg-[#f1fbf7] p-8">
          <p className="text-lg font-black text-[#287c68]">اطلاعات آنلاین‌شاپ ثبت شد ✦</p>
          <p className="mt-3 leading-8 text-[#58736c]">
            تیم بیرون اطلاعات را بررسی می‌کند و بعد از تایید، آنلاین‌شاپت در دایرکتوری نمایش داده می‌شود.
          </p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[#c91442] px-6 py-3 font-bold text-white">بازگشت به بیرون</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <Link href="/register-business" className="text-sm font-bold text-[#8a7b79] hover:text-[#c91442]">← فرم ثبت کسب‌وکار فیزیکی</Link>
      <div className="mt-5 rounded-[2rem] border border-[#cfe6df] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(40,124,104,0.55)] sm:p-9">
        <p className="text-xs font-black tracking-[0.2em] text-[#287c68]">FOR ONLINE SHOPS</p>
        <h1 className="mt-2 text-2xl font-black text-[#241b1c] sm:text-3xl">ثبت آنلاین‌شاپ</h1>
        <p className="mt-3 text-sm leading-7 text-[#80716f]">اطلاعات مخصوص فروش آنلاین را جدا ثبت کن تا مشتری بداند چه می‌فروشی و چطور سفارش می‌گیرد.</p>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[#4b3b3c]">اطلاعات اصلی</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">نام آنلاین‌شاپ *<input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="مثلاً خانه رنگی" className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
              <label className="text-sm font-bold text-[#4b3b3c]">شماره تماس *<input required value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="۰۹۱۲…" dir="ltr" className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">لینک سایت<span className="font-normal text-[#8a7b79]"> (اختیاری)</span><input type="url" value={form.website_url} onChange={(e) => setField("website_url", e.target.value)} placeholder="https://example.ir" dir="ltr" className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
              <label className="text-sm font-bold text-[#4b3b3c]">اینستاگرام<span className="font-normal text-[#8a7b79]"> (اختیاری)</span><input value={form.instagram} onChange={(e) => setField("instagram", e.target.value)} placeholder="@yourshop" dir="ltr" className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
            </div>
            <p className="text-xs text-[#8a7b79]">حداقل یکی از لینک سایت یا اینستاگرام لازم است.</p>
          </section>

          <section className="space-y-4 border-t border-[#f0e5de] pt-6">
            <h2 className="text-sm font-black text-[#4b3b3c]">نوع فروش و تخصص</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">دسته تخصصی *<input required value={form.specialty_category} onChange={(e) => setField("specialty_category", e.target.value)} placeholder="مثلاً لباس زنانه، زیورآلات…" className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
              <label className="text-sm font-bold text-[#4b3b3c]">نوع فروش *<select value={form.sales_type} onChange={(e) => setField("sales_type", e.target.value)} className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10"><option value="retail">فقط خرده‌فروشی</option><option value="wholesale">فقط عمده‌فروشی</option><option value="both">عمده و خرده</option></select></label>
            </div>
          </section>

          <section className="space-y-4 border-t border-[#f0e5de] pt-6">
            <h2 className="text-sm font-black text-[#4b3b3c]">ارسال و پرداخت</h2>
            <label className="block text-sm font-bold text-[#4b3b3c]">محدوده ارسال *<textarea required value={form.shipping_area} onChange={(e) => setField("shipping_area", e.target.value)} placeholder="مثلاً مشهد، سراسر ایران، یا فقط مناطق خاص" rows={3} className="mt-2 w-full rounded-2xl border border-[#eadfd7] bg-[#fffdf9] px-4 py-3 font-normal outline-none focus:border-[#287c68] focus:ring-4 focus:ring-[#287c68]/10" /></label>
            <div>
              <p className="text-sm font-bold text-[#4b3b3c]">روش ارسال *</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{shippingOptions.map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#eadfd7] px-3 py-2.5 text-sm font-normal hover:border-[#287c68]/50"><input type="checkbox" checked={form.shipping_methods.includes(value)} onChange={() => toggle("shipping_methods", value)} className="accent-[#287c68]" />{label}</label>)}</div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#4b3b3c]">روش پرداخت *</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{paymentOptions.map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#eadfd7] px-3 py-2.5 text-sm font-normal hover:border-[#287c68]/50"><input type="checkbox" checked={form.payment_methods.includes(value)} onChange={() => toggle("payment_methods", value)} className="accent-[#287c68]" />{label}</label>)}</div>
            </div>
          </section>

          {err && <p className="rounded-xl bg-[#fff1f3] px-4 py-3 text-sm font-bold text-[#b6113d]">{err}</p>}
          <button disabled={saving} className="w-full rounded-full bg-[#287c68] py-3.5 font-bold text-white transition hover:bg-[#216553] disabled:opacity-50">{saving ? "در حال ارسال…" : "ارسال برای بررسی"}</button>
        </form>
      </div>
    </div>
  );
}
