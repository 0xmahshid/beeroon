import Link from "next/link";
import { getBusinesses } from "@/lib/data";
import BusinessCard from "@/components/BusinessCard";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string; sub: string }>;
}) {
  const { slug, sub } = await params;
  const businesses = await getBusinesses({
    categorySlug: slug,
    subcategorySlug: sub,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href={`/category/${slug}`}
        className="text-sm text-ink-900/50 hover:underline dark:text-ink-50/50"
      >
        ← بازگشت
      </Link>
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
