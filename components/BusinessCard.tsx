import Link from "next/link";
import { Business } from "@/lib/types";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function SocialLink({
  href,
  label,
  tone = "neutral",
}: {
  href: string;
  label: string;
  tone?: "neutral" | "red" | "gold" | "blue" | "green" | "purple" | "dark";
}) {
  const tones = {
    neutral: "border-[#e5e5e5] text-[#555] hover:border-[#ef4056] hover:text-[#ef4056]",
    red: "border-[#f4c3cb] bg-[#fff5f6] text-[#d9364b] hover:bg-[#ffecef]",
    gold: "border-[#ead9a9] bg-[#fffaf0] text-[#8f6d22] hover:bg-[#f8f0da]",
    blue: "border-[#cedeea] bg-[#f4f9fc] text-[#2c668f] hover:bg-[#e6f2fa]",
    green: "border-[#cce9dc] bg-[#f2fcf6] text-[#16805f] hover:bg-[#e6f8ef]",
    purple: "border-[#ddd2f2] bg-[#faf7ff] text-[#7254a7] hover:bg-[#f2ebff]",
    dark: "border-[#d9d9d9] bg-[#f8f8f8] text-[#3d3d3d] hover:bg-[#eee]",
  };
  return (
    <a href={href} target="_blank" rel="noreferrer" className={"inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition " + tones[tone]}>
      {label}
    </a>
  );
}

export default function BusinessCard({ b }: { b: Business }) {
  const onlineShop = Array.isArray(b.online_shop_details) ? b.online_shop_details[0] : b.online_shop_details;
  const websiteUrl = onlineShop?.website_url;
  const socialLinks = mergeSocialLinks(b.social_links, b);
  const socialButtons = SOCIAL_NETWORKS.filter((network) => socialLinks[network.key]).map((network) => (
    <SocialLink key={network.key} href={socialUrl(network.key, socialLinks[network.key]!)} label={network.label} tone={network.tone} />
  ));
  const mapUrl = b.neshan
    ? b.neshan.startsWith("http")
      ? b.neshan
      : "https://neshan.org/maps/search/" + encodeURIComponent(b.neshan)
    : b.lat && b.lng
      ? "https://neshan.org/maps/@" + b.lat + "," + b.lng + ",16z"
      : null;

  return (
    <article className="card-hover group relative overflow-hidden rounded-2xl border border-[#e4e4e4] bg-white p-4">
      <div className="absolute inset-x-0 top-0 h-1 bg-[#ef4056]" />
      <div className="flex items-start gap-3 pt-1">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#fff1f3] text-xl text-[#ef4056]">✦</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="truncate text-sm font-black text-[#242424]">
              <Link href={"/business/" + b.id} className="transition hover:text-[#ef4056]">{b.name}</Link>
            </h3>
            {b.business_type === "online_shop" && <span className="rounded-md bg-[#ecfdf5] px-1.5 py-1 text-[9px] font-bold text-[#16805f]">آنلاین</span>}
            {b.is_supporter && <span className="rounded-md bg-[#fff8e1] px-1.5 py-1 text-[9px] font-bold text-[#9a6b00]">ویژه</span>}
          </div>
          {b.address && <p className="mt-1 truncate text-[11px] text-[#888]">{b.address}</p>}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-[#f1f1f1] pt-3 text-[10px] text-[#888]">
        {b.price_tier && <span className="rounded-md bg-[#fff8e5] px-2 py-1 font-bold text-[#9a7525]">{priceLabel[b.price_tier]}</span>}
        {b.hours && <span className="truncate">• {b.hours}</span>}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {b.phone && <SocialLink href={"tel:" + b.phone} label="تماس" tone="red" />}
        {websiteUrl && <SocialLink href={websiteUrl} label="سایت" tone="gold" />}
        {socialButtons}
        {mapUrl && <SocialLink href={mapUrl} label="مسیریابی" tone="neutral" />}
      </div>

      <Link href={"/business/" + b.id} className="mt-4 inline-flex text-[10px] font-black text-[#ef4056] transition hover:text-[#d9364b]">
        دیدن جزئیات و راه‌های ارتباطی ←
      </Link>
    </article>
  );
}