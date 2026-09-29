import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";
import { getBusinessById, getCityBySlug, getDirectory } from "@/lib/data";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";
import SocialIcon from "@/components/SocialIcon";

function WebsiteIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>;
}

function NeshanIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6.656 13.966 6.557 3.784m21.456 12.42 6.562 3.788m-24.643 2.64c1.41 0 2.82-.034 4.227-.102 9.161-.499 14.27-3.68 14.926-12.232 0-6.606-5.247-11.75-12.154-12-5.814.378-11.274 4.006-11.628 11.615.28 4.31 1.346 6.422 4.63 12.72Z"/><path d="m34.908 5 5.015 10.642c2.766 5.932 2.215 10.538.783 14.79l1.164 2.306c.586 1.193.265 1.947-.784 2.35l-3.068.126c-3.224 4.14-7.561 6.788-13.604 7.151L13.093 43 8.037 32.93c-2.943-5.588-2.488-10.631-.889-15.489L5.943 15.05c-.344-1.504.221-1.961.995-2.18l3.11-.147c4.782-5.576 8.962-6.076 13.076-6.771L34.908 5Z"/><path d="m21.811 15.996 1.842 1.092c2.312-1.145 6.106.318 6.296 3.634l1.927 1.113-1.1 1.906c1.491 2.935-1.116 6.41-3.59 6.217l-1.145 1.984-1.834-1.059c-2.812 1.264-5.995-.66-6.324-3.651l-1.927-1.112 1.097-1.9c-1.293-3.356 1.25-6.204 3.664-6.347l1.094-1.877Z"/></svg>;
}

function InfoIcon({ type }: { type: "pin" | "phone" | "clock" }) {
  const content = type === "pin" ? <><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" /><circle cx="12" cy="9" r="2.4" /></> : type === "phone" ? <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2Z" /> : <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content}</svg>;
}

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [business, directory] = await Promise.all([getBusinessById(id), getDirectory()]);
  if (!business) notFound();
  const city = await getCityBySlug(business.city_id);
  const category = directory.categories.find((item) => item.id === business.category_id);
  const subcategory = directory.subcategories.find((item) => item.id === business.subcategory_id);
  const onlineShop = Array.isArray(business.online_shop_details) ? business.online_shop_details[0] : business.online_shop_details;
  const websiteUrl = onlineShop?.website_url;
  const socialLinks = mergeSocialLinks(business.social_links, business);
  const mapUrl = business.neshan ? (business.neshan.startsWith("http") ? business.neshan : "https://neshan.org/maps/search/" + encodeURIComponent(business.neshan)) : null;
  const categoryHref = category ? "/category/" + category.slug + "?city=" + encodeURIComponent(city.slug) : "/";

  return (
    <div className="sample-container min-h-screen pb-6">
      <div className="py-4"><Link href={categoryHref} className="text-xs font-bold text-[#8f8283] hover:text-[#c91442]">← بازگشت به نتایج</Link></div>
      <section className="border-b border-[#f0e9ea] pb-5">
        <div className="grid h-16 w-16 place-items-center rounded-[18px] border border-[#f0e9ea] bg-[#fdfaf9] text-[#c91442]"><CategoryIcon slug={category?.slug || "services"} className="h-8 w-8" /></div>
        <h1 className="mt-4 text-[17px] font-extrabold">{business.name} {business.is_supporter && <span className="mr-1.5 align-middle rounded-[7px] bg-[#fff6f8] px-2 py-1 text-[9.5px] font-bold text-[#c91442]">حامی پلتفرم</span>}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#8f8283]"><span>{city.name}{business.address ? " · " + business.address : ""}</span>{category && <span>{category.name}{subcategory ? " · " + subcategory.name : ""}</span>}</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {business.phone && <a className="social-contact" href={"tel:" + business.phone} aria-label="تماس" title="تماس"><InfoIcon type="phone" /><span className="social-contact-label">تماس</span></a>}
          {websiteUrl && <a className="social-contact" href={websiteUrl} target="_blank" rel="noreferrer" aria-label="سایت" title="سایت"><WebsiteIcon className="h-4 w-4 text-[#c91442]" /><span className="social-contact-label">سایت</span></a>}
          {SOCIAL_NETWORKS.filter((network) => socialLinks[network.key]).map((network) => <a key={network.key} className="social-contact" href={socialUrl(network.key, socialLinks[network.key]!)} target="_blank" rel="noreferrer" aria-label={network.label} title={network.label}><SocialIcon network={network.key} className="h-4 w-4" style={{ color: network.color }} /><span className="social-contact-label">{network.label}</span></a>)}
          {mapUrl && <a className="social-contact" href={mapUrl} target="_blank" rel="noreferrer" aria-label="نشان" title="نشان"><NeshanIcon className="h-4 w-4 text-[#ed0b55]" /><span className="social-contact-label">نشان</span></a>}
        </div>
      </section>
      <div className="sample-section-head mt-5"><h2>درباره و راه‌های ارتباطی</h2></div>
      <div className="border-t border-[#f0e9ea]">
        {business.address && <div className="sample-row"><div className="sample-contact text-[#c91442]"><InfoIcon type="pin" /></div><div className="sample-row-body"><div className="sample-row-title">آدرس</div><div className="sample-row-meta">{business.address}</div></div></div>}
        {business.phone && <div className="sample-row"><div className="sample-contact text-[#c91442]"><InfoIcon type="phone" /></div><div className="sample-row-body"><div className="sample-row-title">تماس</div><div className="sample-row-meta">{business.phone}</div></div></div>}
        {business.hours && <div className="sample-row"><div className="sample-contact text-[#c91442]"><InfoIcon type="clock" /></div><div className="sample-row-body"><div className="sample-row-title">ساعت کاری</div><div className="sample-row-meta">{business.hours}</div></div></div>}
      </div>
      <a href={business.phone ? "tel:" + business.phone : categoryHref} className="sample-primary mt-5 w-full">تماس مستقیم با {business.name}</a>
    </div>
  );
}