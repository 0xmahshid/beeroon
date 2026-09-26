import Link from "next/link";
import { getCategories } from "@/lib/data";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-14 text-center sm:py-20">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          بیرون بزن، <span className="text-brand-500">همین نزدیکی‌هاست</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-900/60 dark:text-ink-50/60">
          هر کسب‌وکار محلی رو در سه ضربه پیدا کن. بدون الگوریتم، بدون تبلیغ پولی —
          دیده‌شدن برای همه برابره.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">دسته‌بندی‌ها</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="card-hover group flex flex-col items-center gap-2 rounded-xl2 border border-black/5 bg-white p-6 text-center dark:border-white/5 dark:bg-ink-900"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl2 bg-gradient-to-l from-brand-500/10 to-transparent p-8 text-center">
        <h3 className="text-lg font-bold">کسب‌وکار داری؟</h3>
        <p className="mt-2 text-sm text-ink-900/60 dark:text-ink-50/60">
          سه ماه اول رایگان — فقط با تکمیل پروفایل.
        </p>
        <Link
          href="/register-business"
          className="mt-4 inline-block rounded-full bg-brand-500 px-6 py-2.5 font-medium text-white hover:bg-brand-600"
        >
          ثبت رایگان کسب‌وکار
        </Link>
      </section>
    </div>
  );
}
