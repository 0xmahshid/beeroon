"use client";

import { useEffect, useState } from "react";

type Props = { value?: string | null; onChange: (file: File | null) => void };

export default function ImageUploadField({ value, onChange }: Props) {
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  function choose(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    onChange(file);
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div><p className="text-sm font-black text-[#4b3b3c]">عکس کسب‌وکار</p><p className="mt-1 text-[11px] leading-5 text-[#8a7b79]">تصویر افقی ۱۶:۹ · حداکثر ۵ مگابایت · برش خودکار</p></div>
        <label className="cursor-pointer rounded-full border border-[#ed0b55]/30 bg-[#fff0f3] px-3 py-2 text-[11px] font-bold text-[#ed0b55] hover:bg-[#ffe1e8]">انتخاب عکس<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} /></label>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-dashed border-[#eadfe3] bg-[#fffaf8]">
        {preview ? <img src={preview} alt="پیش‌نمایش عکس کسب‌وکار" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-[#a3939a]">پیش‌نمایش عکس اینجا نمایش داده می‌شود</div>}
      </div>
    </div>
  );
}