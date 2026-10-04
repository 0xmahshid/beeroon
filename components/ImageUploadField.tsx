"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string | null;
  onChange: (file: File | null) => void;
  onProcessingChange?: (processing: boolean) => void;
};

const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const MAX_LOGO_BYTES = 10 * 1024;
const LOGO_SIZES = [256, 192, 160, 128, 96, 72, 48, 32, 24, 16];
const QUALITY_STEPS = [0.82, 0.68, 0.54, 0.4, 0.28, 0.18];
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

async function compressLogo(file: File): Promise<File> {
  const sourceUrl = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("image-decode-failed"));
      image.src = sourceUrl;
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas-unavailable");

  const formats = [
    { type: "image/webp", background: "transparent" },
    { type: "image/jpeg", background: "#ffffff" },
  ];
  const dotIndex = file.name.lastIndexOf(".");
  const baseName = (dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name) || "business-logo";

  for (const format of formats) {
    for (const size of LOGO_SIZES) {
      canvas.width = size;
      canvas.height = size;
      context.clearRect(0, 0, size, size);
      if (format.background !== "transparent") {
        context.fillStyle = format.background;
        context.fillRect(0, 0, size, size);
      }
      const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);

      for (const quality of QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, format.type, quality);
        if (!blob || blob.size >= MAX_LOGO_BYTES) continue;
        const type = blob.type || format.type;
        const extension = type === "image/jpeg" ? "jpg" : type === "image/png" ? "png" : "webp";
        return new File([blob], baseName + "." + extension, { type, lastModified: Date.now() });
      }
    }
  }

  throw new Error("logo-cannot-fit-size-limit");
}

export default function ImageUploadField({ value, onChange }: Props) {
  const [preview, setPreview] = useState(value || "");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const localPreview = useRef<string | null>(null);

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  useEffect(() => () => {
    if (localPreview.current) URL.revokeObjectURL(localPreview.current);
  }, []);

  function clearSelection() {
    onChange(null);
    if (localPreview.current) URL.revokeObjectURL(localPreview.current);
    localPreview.current = null;
    setPreview(value || "");
  }

  async function choose(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!ACCEPTED_TYPES.has(file.type)) {
      clearSelection();
      setError("لطفاً لوگویی با فرمت JPG، PNG یا WebP انتخاب کن.");
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      clearSelection();
      setError("حجم تصویر اولیه باید کمتر از ۵ مگابایت باشد.");
      return;
    }

    setProcessing(true);
    onProcessingChange?.(true);
    try {
      const compressed = await compressLogo(file);
      if (compressed.size >= MAX_LOGO_BYTES) throw new Error("logo-size-limit-exceeded");
      onChange(compressed);
      if (localPreview.current) URL.revokeObjectURL(localPreview.current);
      localPreview.current = URL.createObjectURL(compressed);
      setPreview(localPreview.current);
    } catch {
      clearSelection();
      setError("فشرده‌سازی لوگو به کمتر از ۱۰ کیلوبایت انجام نشد؛ لطفاً تصویر ساده‌تری انتخاب کن.");
    } finally {
      setProcessing(false);
      onProcessingChange?.(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#4b3b3c]">لوگوی کسب‌وکار</p>
          <p className="mt-1 text-[11px] leading-5 text-[#8a7b79]">لوگوی مربعی · حداکثر ۵ مگابایت برای فایل اولیه · فشرده‌سازی خودکار به کمتر از ۱۰ کیلوبایت</p>
        </div>
        <label className="shrink-0 cursor-pointer rounded-full border border-[#ed0b55]/30 bg-[#fff0f3] px-3 py-2 text-[11px] font-bold text-[#ed0b55] hover:bg-[#ffe1e8]">
          {processing ? "در حال فشرده‌سازی…" : "انتخاب لوگو"}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={processing} className="sr-only" onChange={(event) => { void choose(event.currentTarget.files?.[0]); event.currentTarget.value = ""; }} />
        </label>
      </div>
      <div className="flex min-h-[104px] items-center justify-center rounded-2xl border border-dashed border-[#eadfe3] bg-[#fffaf8] p-3">
        {preview ? <img src={preview} alt="پیش‌نمایش لوگوی کسب‌وکار" className="h-20 w-20 rounded-xl object-contain" /> : <p className="text-xs text-[#a3939a]">پیش‌نمایش لوگو اینجا نمایش داده می‌شود</p>}
      </div>
      {error && <p role="alert" className="text-xs text-[#d4134e]">{error}</p>}
    </div>
  );
}
