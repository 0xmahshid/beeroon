"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  initial?: any;
  businessId?: string;
};

export default function BusinessForm({ categories, initial, businessId }: Props) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    address: initial?.address || "",
    phone: initial?.phone || "",
    instagram: initial?.instagram || "",
    telegram: initial?.telegram || "",
    whatsapp: initial?.whatsapp || "",
    hours: initial?.hours || "",
    lat: initial?.lat || "",
    lng: initial?.lng || "",
    price_tier: initial?.price_tier || 1,
    category_id: initial?.category_id || categories[0]?.id || "",
    is_supporter: initial?.is_supporter || false,
    status: initial?.status || "approved",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function set(k: string, v: any) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null,
      price_tier: Number(form.price_tier),
      city_id: initial?.city_id || "mashhad",
    };
    if (businessId) {
      await supabase.from("businesses").update(payload).eq("id", businessId);
    } else {
      await supabase.from("businesses").insert(payload);
    }
    router.push("/admin/dashboard");
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-lg space-y-3 px-4 py-10">
      <h1 className="text-xl font-bold">{businessId ? "ویرایش کسب‌وکار" : "افزودن کسب‌وکار"}</h1>

      <input
        required
        placeholder="نام کسب‌وکار"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
      />
      <select
        value={form.category_id}
        onChange={(e) => set("category_id", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        placeholder="آدرس"
        value={form.address}
        onChange={(e) => set("address", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="عرض جغرافیایی (lat)"
          value={form.lat}
          onChange={(e) => set("lat", e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
          dir="ltr"
        />
        <input
          placeholder="طول جغرافیایی (lng)"
          value={form.lng}
          onChange={(e) => set("lng", e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
          dir="ltr"
        />
      </div>
      <input
        placeholder="تلفن"
        value={form.phone}
        onChange={(e) => set("phone", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        dir="ltr"
      />
      <input
        placeholder="اینستاگرام (بدون @)"
        value={form.instagram}
        onChange={(e) => set("instagram", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        dir="ltr"
      />
      <input
        placeholder="تلگرام"
        value={form.telegram}
        onChange={(e) => set("telegram", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        dir="ltr"
      />
      <input
        placeholder="واتساپ"
        value={form.whatsapp}
        onChange={(e) => set("whatsapp", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        dir="ltr"
      />
      <input
        placeholder="ساعات کاری"
        value={form.hours}
        onChange={(e) => set("hours", e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm">رده قیمتی</label>
        <select
          value={form.price_tier}
          onChange={(e) => set("price_tier", e.target.value)}
          className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-ink-900"
        >
          <option value={1}>$</option>
          <option value={2}>$$</option>
          <option value={3}>$$$</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input
            type="checkbox"
            checked={form.is_supporter}
            onChange={(e) => set("is_supporter", e.target.checked)}
          />
          حامی
        </label>
      </div>

      <button
        disabled={saving}
        className="w-full rounded-full bg-brand-500 py-2.5 font-medium text-white hover:bg-brand-600 disabled:opacity-50"
      >
        {saving ? "در حال ذخیره…" : "ذخیره"}
      </button>
    </form>
  );
}
