import { Business } from "@/lib/types";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function SocialLink({ href, label, tone = "neutral" }: { href: string; label: string; tone?: "neutral" | "red" | "gold" | "blue" }) {
  const tones = {
    neutral: "border-[#e8ded8] text-[#655756] hover:border-[#ed0b55]/40 hover:text-[#ed0b55]",
    red: "border-[#f0c6d1] bg-[#fff6f8] text-[#d4134e] hover:bg-[#f9e4e9]",
    gold: "border-[#ead9a9] bg-[#fffaf0] text-[#8f6d22] hover:bg-[#f8f0da]",
    blue: "border-[#cedeea] bg-[#f4f9fc] text-[#2c668f] hover:bg-[#e6f2fa]",
  };
  return <a href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-bold transition ${tones[tone]}`}>{label}</a>;
}

export default function BusinessCard({ b }: { b: Business }) {
  const onlineShop = Array.isArray(b.online_shop_details) ? b.online_shop_details[0] : b.online_shop_details;
  const websiteUrl = onlineShop?.website_url;
  const instagramUrl = b.instagram?.startsWith("http") ? b.instagram : b.instagram ? "https://instagram.com/" + b.instagram.replace(/^@/, "") : null;
  const mapUrl = b.neshan ? (b.neshan.startsWith("http") ? b.neshan : `https://neshan.org/maps/search/${encodeURIComponent(b.neshan)}`) : b.lat && b.lng ? `https://neshan.org/maps/@${b.lat},${b.lng},16z` : null;

  return (
    <article className="card-hover group relative overflow-hidden rounded-[1.35rem] border border-[#eee3e4] bg-white p-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#ed0b55] via-[#ff7f91] to-[#ffd77e]" />
      <div className="flex items-start gap-3">
        <div className="beeroon-tile grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe2e8] to-[#fff5f6] text-xl text-[#d4134e]">✦</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-black text-[#302324]">{b.name}</h3>
            {b.business_type === "online_shop" && <span className="rounded-full bg-[#e8f8f2] px-2 py-1 text-[10px] font-bold text-[#38a18f]">آنلاین‌شاپ</span>}
            {b.is_supporter && <span className="rounded-full bg-[#fff7dd] px-2 py-1 text-[10px] font-bold text-[#a67518]">حامی بیرون</span>}
          </div>
          {b.address && <p className="mt-1 truncate text-xs text-[#877876]">{b.address}</p>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-[#8f807e]">
        {b.price_tier && <span className="rounded-full bg-[#fff8f5] px-2.5 py-1">{priceLabel[b.price_tier]}</span>}
        {b.hours && <span>• {b.hours}</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {b.phone && <SocialLink href={`tel:${b.phone}`} label="تماس" tone="red" />}
        {instagramUrl && <SocialLink href={instagramUrl} label="اینستاگرام" tone="red" />}
        {websiteUrl && <SocialLink href={websiteUrl} label="سایت" tone="gold" />}
        {b.telegram && <SocialLink href={`https://t.me/${b.telegram}`} label="تلگرام" tone="blue" />}
        {b.whatsapp && <SocialLink href={`https://wa.me/${b.whatsapp}`} label="واتساپ" tone="gold" />}
        {mapUrl && <SocialLink href={mapUrl} label="مسیریابی" tone="neutral" />}
      </div>
    </article>
  );
}