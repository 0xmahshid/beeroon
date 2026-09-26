import Link from "next/link";
import { getSubcategories, getBusinesses } from "@/lib/data";
import BusinessCard from "@/components/BusinessCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subcategories = await getSubcategories(slug);
  const businesses = await getBusinesses({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-ink-900/50 hover:underline dark:text-ink-50/50">
        ← بازگشت
      </Link>

      {subcategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {subcategories.map((s) => (
            <Link
              key={s.id}
              href={`/category/${slug}/${s.slug}`}
              className="chip border-brand-500/30 text-brand-600 hover:bg-brand-500/10 dark:text-brand-400"
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((b) => (
          <BusinessCard key={b.id} b={b} />
        ))}
        {businesses.length === 0 && (
          <p className="col-span-full py-16 text-center text-ink-900/50 dark:text-ink-50/50">
            هنوز کسب‌وکاری در این دسته ثبت نشده — اولین نفر باش!
          </p>
        )}
      </div>
    </div>
  );
}
