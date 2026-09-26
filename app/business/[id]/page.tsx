import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryIcon from "@/components/CategoryIcon";
import { getBusinessById, getCityBySlug, getDirectory } from "@/lib/data";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [business, directory] = await Promise.all([getBusinessById(id), getDirectory()]);
  if (!business) notFound();

  const city = await getCityBySlug(business.city_id);
  const cityQuery = "?city=" + encodeURIComponent(city.slug);
  const category = directory.categories.find((item) => item.id === business.category_id);
  const subcategory = directory.subcategories.find((item) => item.id === business.subcategory_id);
  const onlineShop = Array.isArray(business.online_shop_details) ? business.online_shop_details[0] : business.online_shop_details;
  const websiteUrl = onlineShop?.website_url || null;
  const socialLinks = mergeSocialLinks(business.social_links, business);
  const mapUrl = business.neshan
    ? (business.neshan.startsWith("http") ? business.neshan : "https://neshan.org/maps/search/" + encodeURIComponent(business.neshan))
    : business.lat && business.lng
      ? "https://neshan.org/maps/@" + business.lat + "," + business.lng + ",16z"
      : null;
  const categoryPath = category ? "/category/" + category.slug : "/";
  const categoryHref = categoryPath + cityQuery;
  const subcategoryHref = category && subcategory ? categoryPath + "/" + subcategory.slug + cityQuery : categoryHref;

  return (
    <div className="min-h-screen bg-[#fcf7f8]">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href={categoryHref} className="inline-flex items-center gap-2 rounded-xl border border-[#eadfe2] bg-white px-3 py-2 text-xs font-bold text-[#6f5c64] transition hover:border-[#ef4056] hover:text-[#ef4056]">← بازگشت به نتایج</Link>
          <span className="hidden text-[11px] font-bold text-[#a18e95] sm:block">بیرون / {category?.name || "کسب‌وکار"}</span>
        </div>

        <section className="relative mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#3d1833] via-[#762348] to-[#ef4056] p-5 text-white shadow-[0_20px_45px_-28px_rgba(61,24,51,.8)] sm:mt-6 sm:p-8">
          <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-[#ffd36e]/20 blur-3xl" />
          <div className="absolute -bottom-24 right-8 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[1.4rem] border border-white/20 bg-white/15 text-[#ffd36e] backdrop-blur-sm sm:h-20 sm:w-20">
              <CategoryIcon slug={category?.slug || "services"} className="h-10 w-10 sm:h-12 sm:w-12" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black">{business.business_type === "online_shop" ? "آنلاین‌شاپ" : "کسب‌وکار حضوری"}</span>
                {business.is_supporter && <span className="rounded-full bg-[#ffd36e] px-3 py-1 text-[10px] font-black text-[#4d1a2e]">ویژه</span>}
              </div>
              <h1 className="mt-4 text-2xl font-black leading-[1.5] sm:text-4xl">{business.name}</h1>
              <p className="mt-2 text-xs leading-7 text-[#f8dce2] sm:text-sm">اطلاعات، آدرس و راه‌های ارتباطی را قبل از راه افتادن بررسی کن.</p>
            </div>
          </div>
          <div className="relative mt-7 flex flex-wrap gap-2 text-[11px] font-bold text-[#ffe0e6]">
            {category && <Link href={categoryHref} className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 transition hover:bg-white/15">{category.name}</Link>}
            {subcategory && <Link href={subcategoryHref} className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 transition hover:bg-white/15">{subcategory.name}</Link>}
            {business.price_tier && <span className="rounded-xl border border-white/15 bg-white/10 px-3 py-2">{priceLabel[business.price_tier]}</span>}
          </div>
        </section>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-[1.5rem] border border-[#f0dfe3] bg-white p-5 shadow-[0_12px_28px_-26px_rgba(111,35,50,.5)] sm:p-6">
            <span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">راه‌های ارتباطی</span>
            <h2 className="mt-2 text-xl font-black text-[#3d1833]">قبل از رفتن هماهنگ کن</h2>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {business.phone && <a href={"tel:" + business.phone} className="rounded-2xl border border-[#f0dfe3] bg-[#fff8f9] px-4 py-3 text-xs font-black text-[#d9364b] transition hover:border-[#ef4056]">تماس تلفنی <span className="mt-1 block text-[10px] font-normal text-[#87737b]">{business.phone}</span></a>}
              {websiteUrl && <a href={websiteUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#ead9a9] bg-[#fffaf0] px-4 py-3 text-xs font-black text-[#8f6d22] transition hover:border-[#c9aa5c]">وب‌سایت <span className="mt-1 block truncate text-[10px] font-normal text-[#87737b]">{websiteUrl}</span></a>}
              {SOCIAL_NETWORKS.filter((network) => socialLinks[network.key]).map((network) => <a key={network.key} href={socialUrl(network.key, socialLinks[network.key]!)} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#f0dfe3] bg-[#fff8f9] px-4 py-3 text-xs font-black text-[#d9364b] transition hover:border-[#ef4056]">{network.label} <span className="mt-1 block text-[10px] font-normal text-[#87737b]">مشاهده صفحه</span></a>)}
            </div>
            {business.address && <div className="mt-5 rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] p-4"><span className="text-[10px] font-black text-[#87737b]">آدرس</span><p className="mt-2 text-sm font-bold leading-7 text-[#3d1833]">{business.address}</p>{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-xl border border-[#eadfe2] px-4 py-2.5 text-xs font-black text-[#6f5c64] transition hover:border-[#ef4056] hover:text-[#ef4056]">باز کردن مسیر ←</a>}</div>}
          </section>

          <aside className="rounded-[1.5rem] border border-[#f0dfe3] bg-white p-5 shadow-[0_12px_28px_-26px_rgba(111,35,50,.5)] sm:p-6">
            <span className="text-[10px] font-black tracking-[0.12em] text-[#ef4056]">اطلاعات سریع</span>
            <div className="mt-5 space-y-4">
              <div><span className="text-[10px] text-[#a18e95]">دسته‌بندی</span><Link href={subcategoryHref} className="mt-1 block text-sm font-black text-[#3d1833] hover:text-[#ef4056]">{category?.name || "ثبت نشده"}{subcategory && <span className="text-xs font-bold text-[#87737b]"> · {subcategory.name}</span>}</Link></div>
              {business.hours && <div className="border-t border-[#f5ebed] pt-4"><span className="text-[10px] text-[#a18e95]">ساعت کاری</span><p className="mt-1 text-sm font-black text-[#3d1833]">{business.hours}</p></div>}
              <div className="border-t border-[#f5ebed] pt-4"><span className="text-[10px] text-[#a18e95]">نوع فعالیت</span><p className="mt-1 text-sm font-black text-[#3d1833]">{business.business_type === "online_shop" ? "فروش آنلاین" : "ارائه حضوری"}</p></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}