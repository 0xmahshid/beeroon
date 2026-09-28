"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Category, City } from "@/lib/types";
import SocialFields from "@/components/SocialFields";
import ImageUploadField from "@/components/ImageUploadField";
import { getBusinessImageUrl, uploadBusinessImage } from "@/lib/business-images";
import { mergeSocialLinks } from "@/lib/social";

type Props = { categories: Category[]; cities: City[]; initial?: any; businessId?: string };

export default function BusinessForm({ categories, cities, initial, businessId }: Props) {
  const existingImageUrl = getBusinessImageUrl(initial?.image_url, initial?.social_links);
  const [form, setForm] = useState({
    name: initial?.name || "", address: initial?.address || "", phone: initial?.phone || "",
    social_links: mergeSocialLinks(initial?.social_links, initial), hours: initial?.hours || "",
    lat: initial?.lat || "", lng: initial?.lng || "", price_tier: initial?.price_tier || 1,
    category_id: initial?.category_id || categories[0]?.id || "", city_id: initial?.city_id || cities[0]?.id || "mashhad",
    is_supporter: initial?.is_supporter || false, status: initial?.status || "approved",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function set(key: string, value: any) { setForm((current) => ({ ...current, [key]: value })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const recordId = businessId || (imageFile ? crypto.randomUUID() : undefined);
    let imageUrl = existingImageUrl;
    if (imageFile) {
      if (!recordId) { setSaving(false); setError("برای ذخیرهٔ عکس، شناسهٔ کسب‌وکار ساخته نشد."); return; }
      const upload = await uploadBusinessImage(imageFile, recordId);
      if (upload.error || !upload.url) { setSaving(false); setError("آپلود عکس انجام نشد؛ migration مربوط به business-images را اجرا کن."); return; }
      imageUrl = upload.url;
    }
    const socialLinks = { ...form.social_links } as Record<string, string>;
    if (imageUrl) socialLinks._image_url = imageUrl;
    const payload: any = {
      ...form, social_links: socialLinks,
      instagram: form.social_links.instagram || null, telegram: form.social_links.telegram || null,
      bale: form.social_links.bale || null, whatsapp: form.social_links.whatsapp || null,
      lat: form.lat ? Number(form.lat) : null, lng: form.lng ? Number(form.lng) : null,
      price_tier: Number(form.price_tier), city_id: form.city_id,
    };
    if (recordId && !businessId) payload.id = recordId;
    const result = businessId ? await supabase.from("businesses").update(payload).eq("id", businessId) : await supabase.from("businesses").insert(payload);
    setSaving(false);
    if (result.error) { setError("ذخیره انجام نشد. اتصال دیتابیس و اطلاعات واردشده را بررسی کن."); return; }
    router.push("/admin/dashboard"); router.refresh();
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-3 px-4 py-10">
      <h1 className="text-xl font-bold">{businessId ? "ویرایش کسب‌وکار" : "افزودن کسب‌وکار"}</h1>
      <input required placeholder="نام کسب‌وکار" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" />
      <select value={form.city_id} onChange={(e) => set("city_id", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900">{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select>
      <select value={form.category_id} onChange={(e) => set("category_id", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
      <input placeholder="آدرس" value={form.address} onChange={(e) => set("address", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" />
      <div className="grid grid-cols-2 gap-3"><input placeholder="عرض جغرافیایی (lat)" value={form.lat} onChange={(e) => set("lat", e.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" dir="ltr" /><input placeholder="طول جغرافیایی (lng)" value={form.lng} onChange={(e) => set("lng", e.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" dir="ltr" /></div>
      <input placeholder="تلفن" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" dir="ltr" />
      <input placeholder="ساعات کاری" value={form.hours} onChange={(e) => set("hours", e.target.value)} className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900" />
      <ImageUploadField value={existingImageUrl} onChange={setImageFile} />
      <SocialFields value={form.social_links} onChange={(value) => set("social_links", value)} />
      <div className="flex items-center gap-3"><label className="text-sm">رده قیمتی</label><select value={form.price_tier} onChange={(e) => set("price_tier", e.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"><option value={1}>$</option><option value={2}>$$</option><option value={3}>$$$</option></select><label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={form.is_supporter} onChange={(e) => set("is_supporter", e.target.checked)} />حامی</label></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={saving} className="w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50">{saving ? "در حال ذخیره…" : "ذخیره"}</button>
    </form>
  );
}