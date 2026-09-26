import { Business } from "@/lib/types";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function SocialLink({
  href,
  label,
  tone = "neutral",
}: {
  href: string;
  label: string;
  tone?: "neutral" | "red" | "gold" | "blue";
}) {
  const tones = {
    neutral: "border-[#e8ded8] text-[#655756] hover:border-[#c91442]/40 hover:text-[#c91442]",
    red: "border-[#f0c6d1] bg-[#fff6f8] text-[#b6113d] hover:bg-[#f9e4e9]",
    gold: "border-[#ead9a9] bg-[#fffaf0] text-[#8f6d22] hover:bg-[#f8f0da]",
    blue: "border-[#cedeea] bg-[#f4f9fc] text-[#2c668f] hover:bg-[#e6f2fa]",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${tones[tone]}`}
    >
      {label}
    </a>
  );
}

export default function BusinessCard({ b }: { b: Business }) {
  const mapUrl = b.neshan
    ? b.neshan.startsWith("http")
      ? b.neshan
      : `https://neshan.org/maps/search/${encodeURIComponent(b.neshan)}`
    : b.lat && b.lng
      ? `https://neshan.org/maps/@${b.lat},${b.lng},16z`
      : null;

  return (
    <article className="card-hover rounded-3xl border border-[#eadfd7] bg-white p-5 shadow-[0_12px_35px_-30px_rgba(77,30,36,0.8)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-[#302324]">{b.name}</h3>
          {b.address && <p className="mt-1 text-sm text-[#877876]">{b.address}</p>}
        </div>
        {b.is_supporter && (
          <span className="rounded-full border border-[#ead9a9] bg-[#fffaf0] px-2.5 py-1 text-[11px] font-bold text-[#8f6d22]">
            حامی
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8f807e]">
        {b.price_tier && <span>{priceLabel[b.price_tier]}</span>}
        {b.hours && <span>· {b.hours}</span>}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {b.phone && <SocialLink href={`tel:${b.phone}`} label="تماس" tone="red" />}
        {b.instagram && <SocialLink href={`https://instagram.com/${b.instagram}`} label="اینستاگرام" tone="red" />}
        {b.telegram && <SocialLink href={`https://t.me/${b.telegram}`} label="تلگرام" tone="blue" />}
        {b.bale && <SocialLink href={b.bale.startsWith("http") ? b.bale : `https://ble.ir/${b.bale}`} label="بله" tone="blue" />}
        {b.whatsapp && <SocialLink href={`https://wa.me/${b.whatsapp}`} label="واتساپ" tone="gold" />}
        {mapUrl && <SocialLink href={mapUrl} label="نشان" tone="gold" />}
      </div>
    </article>
  );
}