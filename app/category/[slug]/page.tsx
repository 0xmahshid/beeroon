import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { getCityBySlug } from "@/lib/data";

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ type?: string | string[]; price?: string | string[]; sort?: string | string[]; city?: string | string[] }> }) {
  const { slug } = await params;
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const [categories, subcategories, businesses, city] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, citySlug }), getCityBySlug(citySlug)]);
  const category = categories.find((item) => item.slug === slug);
  return <CategoryResults slug={slug} category={category} subcategories={subcategories} businesses={businesses} city={city} initialQuery={{ type: typeof query.type === "string" ? query.type : undefined, price: typeof query.price === "string" ? query.price : undefined, sort: typeof query.sort === "string" ? query.sort : undefined }} />;
}
