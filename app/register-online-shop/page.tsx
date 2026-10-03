"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CITY_SLUG, seedCities } from "@/lib/cities";
import SocialFields from "@/components/SocialFields";
import type { SocialLinks } from "@/lib/social";

type FormState = {
  name: string;
  city_id: string;
  phone: string;
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
    city_id: DEFAULT_CITY_SLUG,
    phone: "",
    website_url: "",
    specialty_category: "",
    sales_type: "retail",
    shipping_area: "",
    shipping_methods: [],
    payment_methods: [],
  });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
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
    if (!form.website_url.trim() && Object.keys(socialLinks).length === 0) {
      setErr("لینک سایت یا دست‌کم یک شبکه‌ی اجتماعی را وارد کن.");
      return;
    }
    if (!form.shipping_methods.length || !form.payment_methods.length) {
      setErr("یک روش ارسال و یک روش پرداخت انتخاب کن.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.rpc("submit_online_shop", {
      p_name: form.name.trim(),
      p_phone: form.phone.trim(),
      p_instagram: socialLinks.instagram || null,
       p_city_id: form.city_id,
      p_website_url: form.website_url.trim() || null,
      p_sales_type: form.sales_type,
      p_shipping_area: form.shipping_area.trim(),
      p_shipping_methods: form.shipping_methods,
      p_payment_methods: form.payment_methods,
      p_specialty_category: form.specialty_category.trim(),
      p_social_links: socialLinks,
    });
    setSaving(false);
    if (error) {
      setErr("اطلاعات ثبت نشد. دوباره تلاش کن.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="rounded-[2rem] border border-[#c9eee4] bg-[#e8f8f2] p-8">
          <p className="text-lg font-black text-[#38a18f]">اطلاعات آنلاین‌شاپ ثبت شد.</p>
          <p className="mt-3 leading-8 text-[#58736c]">
            تیم بیرون اطلاعات را بررسی می‌کند. بررسی آنلاین‌شاپ ممکن است کمی بیشتر طول بکشد. بعد از تأیید، صفحه‌اش در بیرون نمایش داده می‌شود.
          </p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[#ed0b55] px-6 py-3 font-bold text-white">رفتن به صفحه‌ی اصلی</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <Link href="/register-business" className="text-sm font-bold text-[#8a7b79] hover:text-[#ed0b55]">← ثبت کسب‌وکار حضوری</Link>
      <div className="mt-5 rounded-[2rem] border border-[#c9eee4] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(40,124,104,0.55)] sm:p-9">
        <div className="mb-5 flex items-center gap-3"><img src="/beeroon-logo.png" alt="نشان بیرون" className="h-14 w-14 rounded-2xl object-cover shadow-sm" /><div><p className="text-xs font-black text-[#38a18f]">بیرون</p><p className="mt-1 text-[11px] text-[#8a7b79]">کسب‌وکارهای نزدیکت را پیدا کن</p></div></div><p className="text-xs font-black text-[#38a18f]">برای فروشگاه‌های آنلاین</p>
        <h1 className="mt-2 text-2xl font-black text-[#241b1c] sm:text-3xl">ثبت آنلاین‌شاپ</h1>
        <p className="mt-3 text-sm leading-7 text-[#80716f]">اطلاعات فروشگاهت را وارد کن تا مشتری‌ها بدانند چه می‌فروشی و چطور سفارش بدهند.</p>
        <div className="mt-5 rounded-2xl border border-[#ead9a9] bg-[#fffaf0] px-4 py-3.5">
          <p className="text-xs font-black text-[#725c2a]">زمان بررسی</p>
          <p className="mt-1.5 text-xs leading-6 text-[#806d3d]">
            بررسی آنلاین‌شاپ ممکن است کمی بیشتر طول بکشد. بعد از تأیید، اطلاعاتش در بیرون نمایش داده می‌شود.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-black text-[#4b3b3c]">اطلاعات آنلاین‌شاپ</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">نام آنلاین‌شاپ *<input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="مثلاً خانه رنگی" className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10" /></label>
               <label className="text-sm font-bold text-[#4b3b3c]">شهر *<select required value={form.city_id} onChange={(e) => setField("city_id", e.target.value)} className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10">{seedCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label>
              <label className="text-sm font-bold text-[#4b3b3c]">شماره تماس *<input required value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="۰۹۱۲…" dir="ltr" className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">لینک سایت <span className="font-normal text-[#8a7b79]">(اختیاری)</span><input type="url" value={form.website_url} onChange={(e) => setField("website_url", e.target.value)} placeholder="https://example.ir" dir="ltr" className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10" /></label>
            </div>
            <p className="text-xs text-[#8a7b79]">لینک سایت یا دست‌کم یک شبکه‌ی اجتماعی را وارد کن.</p>
          </section>

          <SocialFields value={socialLinks} onChange={setSocialLinks} accent="green" />

          <section className="space-y-4 border-t border-[#f0e5de] pt-6">
            <h2 className="text-sm font-black text-[#4b3b3c]">محصولات و روش فروش</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-[#4b3b3c]">چه محصولی می‌فروشی؟ *<input required value={form.specialty_category} onChange={(e) => setField("specialty_category", e.target.value)} placeholder="مثلاً لباس یا زیورآلات" className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10" /></label>
              <label className="text-sm font-bold text-[#4b3b3c]">روش فروش *<select value={form.sales_type} onChange={(e) => setField("sales_type", e.target.value)} className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10"><option value="retail">خرده‌فروشی</option><option value="wholesale">عمده‌فروشی</option><option value="both">عمده و خرده</option></select></label>
            </div>
          </section>

          <section className="space-y-4 border-t border-[#f0e5de] pt-6">
            <h2 className="text-sm font-black text-[#4b3b3c]">ارسال و پرداخت</h2>
            <label className="block text-sm font-bold text-[#4b3b3c]">کجا ارسال می‌کنی؟ *<textarea required value={form.shipping_area} onChange={(e) => setField("shipping_area", e.target.value)} placeholder="مثلاً مشهد، سراسر ایران یا چند شهر مشخص" rows={3} className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none focus:border-[#38a18f] focus:ring-4 focus:ring-[#38a18f]/10" /></label>
            <div>
              <p className="text-sm font-bold text-[#4b3b3c]">روش ارسال *</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{shippingOptions.map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#f0dfe0] px-3 py-2.5 text-sm font-normal hover:border-[#38a18f]/50"><input type="checkbox" checked={form.shipping_methods.includes(value)} onChange={() => toggle("shipping_methods", value)} className="accent-[#38a18f]" />{label}</label>)}</div>
            </div>
            <div>
              <p className="text-sm font-bold text-[#4b3b3c]">روش پرداخت *</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{paymentOptions.map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#f0dfe0] px-3 py-2.5 text-sm font-normal hover:border-[#38a18f]/50"><input type="checkbox" checked={form.payment_methods.includes(value)} onChange={() => toggle("payment_methods", value)} className="accent-[#38a18f]" />{label}</label>)}</div>
            </div>
          </section>

          {err && <p className="rounded-xl bg-[#fff1f3] px-4 py-3 text-sm font-bold text-[#d4134e]">{err}</p>}
          <button disabled={saving} className="w-full rounded-full bg-[#38a18f] py-3.5 font-bold text-white transition hover:bg-[#2c7f70] disabled:opacity-50">{saving ? "در حال ثبت…" : "ثبت آنلاین‌شاپ"}</button>
        </form>
      </div>
    </div>
  );
}
