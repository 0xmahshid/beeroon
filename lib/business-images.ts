import { supabase } from "@/lib/supabase";

export const BUSINESS_IMAGE_BUCKET = "business-images";

export function getBusinessImageUrl(imageUrl: string | null | undefined, socialLinks: unknown): string | null {
  if (imageUrl) return imageUrl;
  if (socialLinks && typeof socialLinks === "object" && !Array.isArray(socialLinks)) {
    const value = (socialLinks as Record<string, unknown>)._image_url;
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

export async function uploadBusinessImage(file: File, businessId: string) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = businessId + "/" + crypto.randomUUID() + "." + extension;
  const result = await supabase.storage.from(BUSINESS_IMAGE_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (result.error) return { error: result.error.message, url: null };
  return { error: null, url: supabase.storage.from(BUSINESS_IMAGE_BUCKET).getPublicUrl(result.data.path).data.publicUrl };
}