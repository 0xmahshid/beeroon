import { Business } from "@/lib/types";

const priceLabel = { 1: "$", 2: "$$", 3: "$$$" } as const;

export default function BusinessCard({ b }: { b: Business }) {
  const mapUrl =
    b.lat && b.lng ? `https://www.google.com/maps?q=${b.lat},${b.lng}` : null;

  return (
    <div className="card-hover rounded-xl2 border border-black/5 bg-white p-5 dark:border-white/5 dark:bg-ink-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold">{b.name}</h3>
        {b.is_supporter && (
          <span className="chip border-brand-500/30 text-brand-600 dark:text-brand-400">
            ⭐ حامی
          </span>
        )}
      </div>
      {b.address && (
        <p className="mt-1 text-sm text-ink-900/60 dark:text-ink-50/60">{b.address}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-900/50 dark:text-ink-50/50">
        {b.price_tier && <span>{priceLabel[b.price_tier]}</span>}
        {b.hours && <span>· {b.hours}</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {b.phone && (
          <a href={`tel:${b.phone}`} className="chip border-black/10 dark:border-white/10">
            📞 تماس
          </a>
        )}
        {b.whatsapp && (
          <a
            href={`https://wa.me/${b.whatsapp}`}
            target="_blank"
            className="chip border-black/10 dark:border-white/10"
          >
            💬 واتساپ
          </a>
        )}
        {b.instagram && (
          <a
            href={`https://instagram.com/${b.instagram}`}
            target="_blank"
            className="chip border-black/10 dark:border-white/10"
          >
            📷 اینستاگرام
          </a>
        )}
        {b.telegram && (
          <a
            href={`https://t.me/${b.telegram}`}
            target="_blank"
            className="chip border-black/10 dark:border-white/10"
          >
            ✈️ تلگرام
          </a>
        )}
        {mapUrl && (
          <a href={mapUrl} target="_blank" className="chip border-black/10 dark:border-white/10">
            📍 نقشه
          </a>
        )}
      </div>
    </div>
  );
}
