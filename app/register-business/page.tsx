"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CITY_SLUG, seedCities } from "@/lib/cities";
import SocialFields from "@/components/SocialFields";
import ImageUploadField from "@/components/ImageUploadField";
import { uploadBusinessImage } from "@/lib/business-images";
import type { SocialLinks } from "@/lib/social";

export default function RegisterBusiness() {
  const [form, setForm] = useState({ name: "", address: "", phone: "", neshan: "", hours: "", city_id: DEFAULT_CITY_SLUG });
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  function set(key: string, value: string) { setForm((current) => ({ ...current, [key]: value })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const businessId = crypto.randomUUID();
    let imageUrl: string | null = null;
    if (imageFile) {
      const upload = await uploadBusinessImage(imageFile, businessId);
      if (upload.error || !upload.url) { setErr("آپلود عکس انجام نشد؛ فضای ذخیره‌سازی هنوز فعال نشده است."); return; }
      imageUrl = upload.url;
    }
    const links = imageUrl ? { ...socialLinks, _image_url: imageUrl } : socialLinks;
    const { error } = await supabase.from("businesses").insert({
      id: businessId, name: form.name, address: form.address, phone: form.phone, social_links: links,
      instagram: socialLinks.instagram || null, telegram: socialLinks.telegram || null, bale: socialLinks.bale || null,
      whatsapp: socialLinks.whatsapp || null, neshan: form.neshan || null, hours: form.hours || null,
      status: "pending", business_type: "physical", city_id: form.city_id,
    });
    if (error) setErr("مشکلی پیش اومد. دوباره تلاش کن."); else setSent(true);
  }

  if (sent) return <div className="mx-auto max-w-md px-4 py-24 text-center"><p className="text-lg font-black text-[#ed0b55]">ثبت شد!</p><p className="mt-2 text-[#6f6261]">تیم بیرون به‌زودی اطلاعات شما را بررسی و فعال می‌کند.</p></div>;

  return <>
    <div className="mx-auto max-w-xl px-4 pt-8"><div className="flex items-center justify-between gap-4 rounded-2xl border border-[#ead9a9] bg-[#fffaf0] px-4 py-3 text-sm"><span className="text-[#725c2a]">آنلاین‌شاپ داری؟ فرم جداگانه‌اش اینجاست.</span><Link href="/register-online-shop" className="shrink-0 font-black text-[#ed0b55] hover:underline">ثبت آنلاین‌شاپ</Link></div></div>
    <form onSubmit={submit} className="mx-auto max-w-xl px-4 py-10"><div className="rounded-[2rem] border border-[#f0dfe0] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(77,30,36,0.55)] sm:p-9">
      <div className="mb-5 flex items-center gap-3"><img src="/beeroon-logo.png" alt="نشان بیرون" className="h-14 w-14 rounded-2xl object-cover shadow-sm" /><div><p className="text-xs font-black text-[#ed0b55]">بیرون</p><p className="mt-1 text-[11px] text-[#8a7b79]">دایرکتوری کسب‌وکارهای واقعی</p></div></div><p className="text-xs font-black tracking-[0.2em] text-[#ed0b55]">FOR LOCAL OWNERS</p><h1 className="mt-2 text-2xl font-black text-[#241b1c]">ثبت رایگان کسب‌وکار</h1><p className="mt-2 text-sm leading-7 text-[#80716f]">هر راه ارتباطی را که داری وارد کن تا مشتری‌ها راحت‌تر پیدایت کنند.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-[#4b3b3c]">شهر *<select required value={form.city_id} onChange={(e) => set("city_id", e.target.value)} className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none transition focus:border-[#ed0b55] focus:ring-4 focus:ring-[#ed0b55]/10">{seedCities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label>{[["name", "نام کسب‌وکار", true], ["address", "آدرس", true], ["phone", "تلفن", true], ["hours", "ساعات کاری", false], ["neshan", "لینک یا نام مکان در نشان", false]].map(([key, label, required]) => <label key={key as string} className="text-sm font-bold text-[#4b3b3c]">{label as string}<input required={required as boolean} value={form[key as keyof typeof form]} onChange={(e) => set(key as string, e.target.value)} className="mt-2 w-full rounded-2xl border border-[#f0dfe0] bg-[#fffaf8] px-4 py-3 font-normal outline-none transition focus:border-[#ed0b55] focus:ring-4 focus:ring-[#ed0b55]/10" /></label>)}</div>
      <div className="mt-5"><ImageUploadField onChange={setImageFile} /></div><SocialFields value={socialLinks} onChange={setSocialLinks} />{err && <p className="mt-4 text-sm text-[#d4134e]">{err}</p>}<button className="mt-7 w-full rounded-full bg-[#ed0b55] py-3.5 font-bold text-white transition hover:bg-[#c70d46]">ارسال برای بررسی</button>
    </div></form>
  </>;
}