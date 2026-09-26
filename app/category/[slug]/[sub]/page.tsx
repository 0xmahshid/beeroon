import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";

export default async function SubcategoryPage({ params, searchParams }: { params: Promise<{ slug: string; sub: string }>; searchParams: Promise<{ type?: string | string[]; price?: string | string[]; sort?: string | string[] }> }) {
  const { slug, sub } = await params;
  const query = await searchParams;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, subcategorySlug: sub })]);
  const category = categories.find((item) => item.slug === slug);
  const selected = subcategories.find((item) => item.slug === sub);
  return <CategoryResults slug={slug} sub={sub} category={category} selected={selected} subcategories={subcategories} businesses={businesses} initialQuery={{ type: typeof query.type === "string" ? query.type : undefined, price: typeof query.price === "string" ? query.price : undefined, sort: typeof query.sort === "string" ? query.sort : undefined }} />;
}
