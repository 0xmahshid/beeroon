import Link from "next/link";
import { getCategories } from "@/lib/data";

const discoveryPills = ["کافه", "دیجیتال مارکتینگ", "پزشک", "تعمیر خودرو", "کلاس زبان"];

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-[#fffdf9]">
      <section className="relative overflow-hidden border-b border-[#eadfd7] bg-white">
        <div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#c91442]/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-[#d7ad55]/[0.12] blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div className="relative order-2 text-right lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c91442]/15 bg-[#c91442]/[0.05] px-4 py-2 text-xs font-bold text-[#a70f37]">
              <span className="h-2 w-2 rounded-full bg-[#c91442]" />
              دایرکتوری واقعی شهر تو
            </span>
            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.35] text-[#241b1c] sm:text-6xl">
              هر چیزی که می‌خوای،
              <span className="block text-[#c91442]">همین نزدیکی‌هاست.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#6f6261] sm:text-lg">
              بیرون کمک می‌کنه کسب‌وکارهای واقعی شهرت رو سریع پیدا کنی؛ از یک کافه‌ی دنج تا
              یک شرکت دیجیتال مارکتینگ حرفه‌ای.
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-[#e8ded8] bg-[#fffaf6] p-2 shadow-[0_20px_70px_-35px_rgba(110,43,45,0.4)]">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex min-h-14 flex-1 items-center gap-3 rounded-2xl bg-white px-4 text-[#8a7b79]">
                  <span className="text-xl text-[#c91442]">⌕</span>
                  <input
                    type="search"
                    placeholder="دنبال چه کسب‌وکاری می‌گردی؟"
                    className="w-full bg-transparent text-sm text-[#241b1c] outline-none placeholder:text-[#a99b98]"
                  />
                </label>
                <button className="min-h-14 rounded-2xl bg-[#c91442] px-8 font-bold text-white transition hover:bg-[#a70f37]">
                  جست‌وجو
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#8a7b79]">
              <span>پیشنهاد امروز:</span>
              {discoveryPills.map((pill) => (
                <Link
                  key={pill}
                  href={`/category/${encodeURIComponent(pill)}`}
                  className="rounded-full border border-[#e8ded8] bg-white px-3 py-1.5 transition hover:border-[#c91442]/40 hover:text-[#c91442]"
                >
                  {pill}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative order-1 flex min-h-[280px] items-center justify-center lg:order-2 lg:min-h-[460px]">
            <div className="absolute h-64 w-64 rounded-full border border-[#d7ad55]/30 bg-[#fffaf0] shadow-[0_25px_90px_-30px_rgba(191,141,46,0.55)] sm:h-80 sm:w-80 lg:h-[25rem] lg:w-[25rem]" />
            <div className="absolute h-52 w-52 rounded-full border border-white bg-white/90 p-5 shadow-xl sm:h-64 sm:w-64 lg:h-80 lg:w-80">
              <img
                src="/beeroon-logo.svg"
                alt="لوگوی بیرون"
                className="h-full w-full rounded-[28%] object-contain"
              />
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#e8ded8] bg-white px-5 py-3 text-xs font-bold text-[#5f4b4b] shadow-lg sm:bottom-8">
              نزدیک‌ترین‌ها اینجاست
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.25em] text-[#c91442]">EXPLORE YOUR CITY</p>
            <h2 className="mt-2 text-3xl font-black text-[#241b1c]">از کجا شروع کنیم؟</h2>
            <p className="mt-2 text-sm text-[#80716f]">هر صنف، هر محله، یک‌جا و قابل جست‌وجو</p>
          </div>
          <span className="text-sm font-bold text-[#c91442]">{categories.length} دسته‌بندی فعال</span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-3xl border border-[#eadfd7] bg-white p-4 text-right shadow-[0_8px_30px_-24px_rgba(77,30,36,0.5)] transition duration-200 hover:-translate-y-1 hover:border-[#c91442]/35 hover:shadow-[0_18px_35px_-24px_rgba(201,20,66,0.45)]"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${
                  index % 4 === 0
                    ? "bg-[#f9e4e9] text-[#c91442]"
                    : index % 4 === 1
                      ? "bg-[#f8f0da] text-[#967024]"
                      : index % 4 === 2
                        ? "bg-[#e8f1ef] text-[#42796f]"
                        : "bg-[#eceaf5] text-[#655d96]"
                }`}
              >
                {category.icon || "•"}
              </span>
              <span className="mt-4 block text-sm font-bold text-[#3b2d2e] transition group-hover:text-[#c91442]">
                {category.name}
              </span>
              <span className="mt-1 block text-xs text-[#a19491]">مشاهده کسب‌وکارها</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#eadfd7] bg-[#fff7f2]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:grid-cols-3 lg:px-8">
          {[
            ["۰۱", "جست‌وجوی بی‌طرفانه", "ترتیب نمایش با پرداخت بیشتر عوض نمی‌شود."],
            ["۰۲", "اطلاعات کامل", "تلفن، آدرس، شبکه‌های اجتماعی و راه رسیدن."],
            ["۰۳", "برای همه‌ی شهرها", "امروز مشهد، فردا هر جایی که کسب‌وکاری هست."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-4">
              <span className="text-sm font-black text-[#c91442]">{number}</span>
              <div>
                <h3 className="font-black text-[#3b2d2e]">{title}</h3>
                <p className="mt-1 text-sm leading-7 text-[#80716f]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 text-center lg:py-20">
        <p className="text-xs font-black tracking-[0.25em] text-[#c91442]">FOR LOCAL OWNERS</p>
        <h2 className="mt-3 text-3xl font-black text-[#241b1c]">کسب‌وکار داری؟ دیده شو.</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#80716f]">
          پروفایل کاملت را رایگان ثبت کن تا مشتری‌ها آدرس، تلفن و شبکه‌های اجتماعی‌ات را یک‌جا پیدا کنند.
        </p>
        <Link
          href="/register-business"
          className="mt-7 inline-flex rounded-full bg-[#c91442] px-7 py-3.5 font-bold text-white transition hover:bg-[#a70f37]"
        >
          ثبت رایگان کسب‌وکار
        </Link>
      </section>
    </div>
  );
}