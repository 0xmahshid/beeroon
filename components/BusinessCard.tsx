import Link from "next/link";
import { Business } from "@/lib/types";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></svg>;
}

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2Z" /></svg>;
}

export default function BusinessCard({ b }: { b: Business }) {
  const mapUrl = b.neshan ? (b.neshan.startsWith("http") ? b.neshan : "https://neshan.org/maps/search/" + encodeURIComponent(b.neshan)) : b.lat && b.lng ? "https://neshan.org/maps/@" + b.lat + "," + b.lng + ",16z" : null;
  return (
    <article className="sample-row group">
      <Link href={"/business/" + b.id} className="sample-thumb grid place-items-center bg-[#f8eff1] text-[#c91442] transition group-hover:bg-[#f9dfe5]">
        <span className="text-2xl">✦</span>
      </Link>
      <div className="sample-row-body">
        <div className="sample-row-title truncate">
          <Link href={"/business/" + b.id} className="hover:text-[#c91442]">{b.name}</Link>
          {b.is_supporter && <span className="mr-1.5 inline-flex items-center rounded-[7px] bg-[#fff6f8] px-1.5 py-0.5 text-[9.5px] font-bold text-[#c91442]">حامی</span>}
        </div>
        <div className="sample-row-meta truncate"><PinIcon />{b.address || (b.business_type === "online_shop" ? "آنلاین‌شاپ" : "آدرس ثبت نشده")}</div>
        {b.hours && <div className="mt-1 truncate text-[10px] text-[#aaa]">{b.hours}</div>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {b.price_tier && <div className="sample-price" title={priceLabel[b.price_tier]}><i className={b.price_tier >= 1 ? "on" : ""} /><i className={b.price_tier >= 2 ? "on" : ""} /><i className={b.price_tier >= 3 ? "on" : ""} /></div>}
        {b.phone && <a className="sample-contact" href={"tel:" + b.phone} aria-label="تماس"><PhoneIcon /></a>}
        {mapUrl && <a className="hidden sample-contact sm:grid" href={mapUrl} target="_blank" rel="noreferrer" aria-label="مسیریابی">↗</a>}
      </div>
    </article>
  );
}