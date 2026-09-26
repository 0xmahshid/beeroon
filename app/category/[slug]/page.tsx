import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ type?: string | string[]; price?: string | string[]; sort?: string | string[] }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug })]);
  const category = categories.find((item) => item.slug === slug);
  return <CategoryResults slug={slug} category={category} subcategories={subcategories} businesses={businesses} initialQuery={{ type: typeof query.type === "string" ? query.type : undefined, price: typeof query.price === "string" ? query.price : undefined, sort: typeof query.sort === "string" ? query.sort : undefined }} />;
}
