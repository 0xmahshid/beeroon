import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";
import { getBusinessById, getCityBySlug, getDirectory } from "@/lib/data";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";
import SocialIcon from "@/components/SocialIcon";

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
          {business.phone && <a className="sample-contact" href={"tel:" + business.phone} aria-label="تماس">☎</a>}
          {websiteUrl && <a className="sample-contact text-xs" href={websiteUrl} target="_blank" rel="noreferrer" aria-label="سایت">↗</a>}
          {SOCIAL_NETWORKS.filter((network) => socialLinks[network.key]).map((network) => <a key={network.key} className="sample-contact flex h-auto min-w-[45px] flex-col items-center gap-1 px-2 py-1" href={socialUrl(network.key, socialLinks[network.key]!)} target="_blank" rel="noreferrer" aria-label={network.label} title={network.label}><SocialIcon network={network.key} className="h-4 w-4" style={{ color: network.color }} /><span className="text-[8px] leading-3 text-[#8f8283]">{network.label}</span></a>)}
          {mapUrl && <a className="sample-contact text-xs" href={mapUrl} target="_blank" rel="noreferrer">⌖</a>}
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