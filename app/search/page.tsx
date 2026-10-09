import Link from "next/link";
import { Suspense } from "react";
import BusinessCard from "@/components/BusinessCard";
import EmitSearchEvents from "@/components/EmitSearchEvents";
import SearchFilters from "@/components/SearchFilters";
import { parseFiltersFromUrl } from "@/lib/search-filters";
import { getBusinesses, getCityBySlug, getDirectory } from "@/lib/data";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { newUuid } from "@/lib/analytics";

export const metadata = { title: "جست‌وجو | بیرون", description: "کسب‌وکارهای نزدیکت را جست‌وجو کن و نشانی، ساعت کاری و راه تماس را ببین." };

type SearchParams = {
  q?: string | string[];
  city?: string | string[];
  sort?: string | string[];
  open?: string | string[];
  verified?: string | string[];
  has_phone?: string | string[];
  has_dir?: string | string[];
  in_person?: string | string[];
  online?: string | string[];
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const citySlug = typeof params.city === "string" ? params.city : DEFAULT_CITY_SLUG;
  const searchId = newUuid();

  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") urlParams.set(key, value);
  });
  const filters = parseFiltersFromUrl(urlParams);

  const [{ categories, subcategories }, city] = await Promise.all([
    getDirectory(),
    getCityBySlug(citySlug),
  ]);
  const [businesses, fallbackAll] = await Promise.all([
    getBusinesses({
      citySlug,
      query,
      sortMode: filters.sort,
      filters: {
        openNow: filters.openNow,
        verifiedOnly: filters.verifiedOnly,
        hasPhone: filters.hasPhone,
        hasDirections: filters.hasDirections,
        inPersonOnly: filters.inPersonOnly,
        onlineOnly: filters.onlineOnly,
      },
    }),
    !query
      ? Promise.resolve([])
      : getBusinesses({ citySlug, sortMode: "relevance" }).then((all) => all.slice(0, 6)),
  ]);

  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const subcategoryById = new Map(subcategories.map((item) => [item.id, item]));
  const placeQuery = "&city=" + encodeURIComponent(city.slug);

  const isFiltered =
    filters.openNow || filters.verifiedOnly || filters.hasPhone || filters.hasDirections || filters.inPersonOnly || filters.onlineOnly;
  const hasNoMatches = query && businesses.length === 0;
  const suggestionChips = ["کافه", "رستوران", "آرایشگاه", "تعمیرات موبایل", "پوشاک بچگانه", "کافه رستوران"];

  return (
    <div className="min-h-screen bg-[#f7f8fa] pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <EmitSearchEvents
          searchId={searchId}
          query={query || undefined}
          city={city.slug}
          resultsCount={businesses.length}
        />

        <section className="relative -mx-4 mb-0 overflow-hidden border-b border-[#e8eaee] bg-white px-4 pt-6 pb-5 sm:mx-0 sm:mt-0 sm:rounded-b-3xl sm:border-x sm:border-t sm:px-8 sm:pt-8">
          <div className="pointer-events-none absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 100% 0%, rgba(213,31,79,0.08), transparent 55%), radial-gradient(circle at 0% 100%, rgba(243,150,117,0.1), transparent 45%)" }} />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0f3] px-2.5 py-1 font-black text-[#d51f4f]">📍 {city.name}</span>
              {query && <span className="inline-flex items-center gap-1 rounded-full bg-[#f2f3f6] px-2.5 py-1 font-black text-[#545863]">🔎 «{query}»</span>}
            </div>
            <h1 className="mt-3 text-2xl font-black leading-[1.55] text-[#25252a] sm:text-3xl">
              {query ? <>نتیجه‌های «<span className="text-[#d51f4f]">{query}</span>» در {city.name}</> : <>کسب‌وکارهای <span className="text-[#d51f4f]">{city.name}</span></>}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-7 text-[#69707b] sm:text-sm">
              {businesses.length ? (
                <>
                  <span className="font-black text-[#25252a]">{businesses.length.toLocaleString("fa-IR")}</span> کسب‌وکار پیدا شد. برای محدودکردن نتیجه‌ها، فیلترها را انتخاب کن.
                </>
              ) : query ? (
                <>با این عبارت چیزی پیدا نشد. عبارت دیگری را امتحان کن یا یکی از پیشنهادها را ببین.</>
              ) : (
                <>اسم کسب‌وکار یا خدمتی را که لازم داری جست‌وجو کن.</>
              )}
            </p>

            <form action="/search" method="get" className="mt-5 flex max-w-3xl items-center gap-2 rounded-2xl border border-[#dfe2e7] bg-white p-1.5 shadow-[0_16px_30px_-20px_rgba(32,35,42,.35)] focus-within:border-[#e0a0af]">
              <span className="px-2 text-2xl leading-none text-[#9097a3]">⌕</span>
              <input type="hidden" name="city" value={city.slug} />
              <input
                name="q"
                defaultValue={query}
                autoFocus={!query}
                placeholder="مثلاً کافه یا تعمیرکار"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#25252a] outline-none placeholder:text-[#9ba1aa]"
                style={{ minHeight: "44px" }}
              />
              <button
                className="shrink-0 rounded-xl bg-[#d51f4f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b91640]"
                style={{ minHeight: "44px" }}
              >
                جست‌وجو
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-[#858c96]">
              <span className="font-bold text-[#69707b]">جست‌وجوهای پرتکرار:</span>
              {suggestionChips.map((term) => (
                <Link
                  key={term}
                  href={"/search?q=" + encodeURIComponent(term) + "&city=" + encodeURIComponent(city.slug)}
                  className="rounded-full border border-[#e3e6eb] bg-white px-3 py-1.5 font-bold transition hover:border-[#e0a0af] hover:text-[#d51f4f]"
                  style={{ minHeight: "32px" }}
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Suspense fallback={<div className="h-28" />}>
          <div className="pt-4">
            <SearchFilters totalResults={businesses.length} />
          </div>
        </Suspense>

        {businesses.length > 0 ? (
          <section className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.map((b) => (
                <BusinessCard
                  key={b.id}
                  b={b}
                  categoryName={subcategoryById.get(b.subcategory_id || "")?.name || categoryById.get(b.category_id)?.name}
                  searchId={searchId}
                  query={query || undefined}
                  city={city.slug}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-6">
            {hasNoMatches ? (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#e5cbd2] bg-white px-6 py-10 text-center shadow-[0_20px_50px_-30px_rgba(60,30,45,.3)] sm:py-14">
                <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 50% 0%, rgba(213,31,79,0.07), transparent 55%)" }} />
                <div className="relative">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#fff0f3] text-3xl">🔎</div>
                  <h3 className="mt-5 text-lg font-black text-[#32162d] sm:text-xl">برای «{query}» نتیجه‌ای پیدا نشد.</h3>
                  <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-[#69707b] sm:text-sm">
                    عبارت دیگری را جست‌وجو کن یا یکی از پیشنهادهای زیر را ببین.
                  </p>
                  <div className="mx-auto mt-5 flex max-w-md flex-wrap items-center justify-center gap-2">
                    {suggestionChips.slice(0, 4).map((term) => (
                      <Link
                        key={term}
                        href={"/search?q=" + encodeURIComponent(term) + "&city=" + encodeURIComponent(city.slug)}
                        className="rounded-full bg-[#f6f7fa] px-3 py-1.5 text-[10.5px] font-bold text-[#555a63] hover:bg-[#fff0f3] hover:text-[#d51f4f]"
                      >
                        جست‌وجوی {term}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Link
                      href={"/register-business?city=" + encodeURIComponent(city.slug)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#d51f4f] px-5 py-3 text-xs font-black text-white transition hover:bg-[#b91640]"
                      style={{ minHeight: "44px" }}
                    >
                      ثبت کسب‌وکار
                    </Link>
                    <Link
                      href={"/" + "?city=" + encodeURIComponent(city.slug)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8eaee] bg-white px-5 py-3 text-xs font-black text-[#555a63] hover:border-[#e0a0af] hover:text-[#d51f4f]"
                      style={{ minHeight: "44px" }}
                    >
                      ← صفحه‌ی اصلی
                    </Link>
                  </div>
                </div>
              </div>
            ) : !isFiltered ? (
              <div className="rounded-3xl bg-[#fff6f8] px-6 py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-white text-3xl">👀</div>
                <h3 className="mt-4 text-lg font-black text-[#32162d]">در {city.name} کسب‌وکاری ثبت نشده.</h3>
                <p className="mx-auto mt-2 max-w-xl text-xs leading-7 text-[#69707b] sm:text-sm">
                  شهر دیگری را انتخاب کن یا کسب‌وکارت را ثبت کن.
                </p>
                <Link href={"/register-business?city=" + encodeURIComponent(city.slug)} className="mt-5 inline-flex rounded-xl bg-[#d51f4f] px-5 py-3 text-xs font-black text-white">
                  ثبت کسب‌وکار
                </Link>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-[#e5cbd2] bg-white px-6 py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-[#fff0f3] text-3xl">🧹</div>
                <h3 className="mt-4 text-lg font-black text-[#32162d]">با این فیلترها نتیجه‌ای پیدا نشد.</h3>
                <p className="mx-auto mt-2 max-w-xl text-xs leading-7 text-[#69707b] sm:text-sm">
                  یکی از فیلترها را بردار یا عوض کن.
                </p>
              </div>
            )}

            {hasNoMatches && fallbackAll.length > 0 && (
              <div className="mt-10">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <span className="beeroon-section-label">پیشنهادهای دیگر</span>
                    <h3 className="mt-2 text-lg font-black text-[#25252a]">کسب‌وکارهای دیگر در {city.name}</h3>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {fallbackAll.map((b) => (
                    <BusinessCard
                      key={"fallback-" + b.id}
                      b={b}
                      categoryName={subcategoryById.get(b.subcategory_id || "")?.name || categoryById.get(b.category_id)?.name}
                      searchId={searchId}
                      city={city.slug}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-6 py-6 shadow-[0_20px_50px_-34px_rgba(60,30,45,.3)] sm:px-8">
          <div>
            <span className="text-[10px] font-black tracking-wide text-[#d51f4f]">صاحب کسب‌وکاری؟</span>
            <h4 className="mt-1.5 text-base font-black text-[#25252a]">اطلاعات کسب‌وکارت را ثبت کن.</h4>
            <p className="mt-1 text-xs leading-7 text-[#69707b]">نشانی و راه‌های تماس را وارد کن تا در بیرون نمایش داده شود.</p>
          </div>
          <Link
            href={"/register-business" + placeQuery}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#d51f4f] px-5 py-3 text-xs font-black text-white transition hover:bg-[#b91640]"
            style={{ minHeight: "44px" }}
          >
            ثبت کسب‌وکار →
          </Link>
        </div>
      </div>
    </div>
  );
}
