import Link from "next/link";
import { Business } from "@/lib/types";
import { getBusinessImageUrl } from "@/lib/business-images";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";
import SocialIcon from "@/components/SocialIcon";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function PinIcon() {
  return <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
}

function PhoneIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2Z" /></svg>;
}

export default function BusinessCard({ b, categoryName }: { b: Business; categoryName?: string }) {
  const mapUrl = b.neshan ? (b.neshan.startsWith("http") ? b.neshan : "https://neshan.org/maps/search/" + encodeURIComponent(b.neshan)) : b.lat && b.lng ? "https://neshan.org/maps/@" + b.lat + "," + b.lng + ",16z" : null;
  const initials = b.name.trim().slice(0, 1) || "ب";
  const imageUrl = getBusinessImageUrl(b.image_url, b.social_links);
  const socialLinks = mergeSocialLinks(b.social_links, b);
  return (
    <article className="business-card overflow-hidden rounded-[1.45rem] border border-[#eadfe3] bg-white shadow-[0_8px_25px_-23px_rgba(58,20,45,.6)]">
      <div className="business-card-cover relative aspect-[16/9] overflow-hidden border-b border-[#f1dfe3] bg-[linear-gradient(135deg,#32162d_0%,#d51f4f_58%,#f4a261_100%)]">
        {imageUrl && <img src={imageUrl} alt={"عکس " + b.name} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#32162d]/55 via-transparent to-black/5" />
        <span className="absolute right-4 top-4 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-black text-[#9a5365] backdrop-blur">{b.business_type === "online_shop" ? "آنلاین‌شاپ" : "حضوری"}</span>
        <div className="business-mono absolute bottom-[-19px] right-4 z-10 grid h-16 w-16 place-items-center rounded-[1.25rem] border-4 border-white bg-[#d51f4f] text-2xl font-black text-white shadow-lg">{initials}</div>
      </div>
      <div className="p-4 pt-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><h3 className="truncate text-sm font-black text-[#32162d]"><Link href={"/business/" + b.id} className="hover:text-[#d51f4f]">{b.name}</Link></h3><p className="mt-1 truncate text-[10px] text-[#93828a]">{categoryName || "کسب‌وکار محلی"}{b.is_supporter ? " · حامی بیرون" : ""}</p></div>
          {b.price_tier && <span className="beeroon-pill shrink-0 bg-[#fff5d9] text-[#9c761e]" title={priceLabel[b.price_tier]}><span>{priceLabel[b.price_tier]}</span></span>}
        </div>
        <div className="mt-4 space-y-2 border-t border-[#f3e8eb] pt-3 text-[10px] text-[#81717a]">
          {b.address && <p className="flex items-center gap-1.5 truncate"><PinIcon />{b.address}</p>}
          {b.hours && <p className="truncate text-[#a3939a]">ساعت کاری: {b.hours}</p>}
        </div>
        {SOCIAL_NETWORKS.some((network) => socialLinks[network.key]) && <div className="mt-3 flex flex-wrap items-start gap-x-2 gap-y-2 border-t border-[#f3e8eb] pt-3">{SOCIAL_NETWORKS.filter((network) => socialLinks[network.key]).map((network) => <a key={network.key} href={socialUrl(network.key, socialLinks[network.key]!)} target="_blank" rel="noreferrer" title={network.label} aria-label={network.label} className="flex w-[46px] flex-col items-center gap-1 rounded-xl py-1 transition hover:bg-[#fff5f7]"><SocialIcon network={network.key} className="h-5 w-5" style={{ color: network.color }} /><span className="w-full text-center text-[8px] leading-3 text-[#8d7d84]">{network.label}</span></a>)}</div>}
        <div className="mt-4 flex items-center gap-2">
          {b.phone ? <a href={"tel:" + b.phone} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#fff0f3] py-2.5 text-[10px] font-black text-[#d51f4f] transition hover:bg-[#ffe0e7]"><PhoneIcon />تماس</a> : <span className="flex-1" />}
          {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="rounded-xl border border-[#eadfe3] px-3 py-2.5 text-[10px] font-bold text-[#6d5c65] transition hover:border-[#d51f4f] hover:text-[#d51f4f]">مسیریابی</a>}
          <Link href={"/business/" + b.id} className="rounded-xl bg-[#32162d] px-3 py-2.5 text-[10px] font-black text-white transition hover:bg-[#4c2042]">جزئیات</Link>
        </div>
      </div>
    </article>
  );
}