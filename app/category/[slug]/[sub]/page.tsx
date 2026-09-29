import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import { getCityBySlug } from "@/lib/data";

export default async function SubcategoryPage({ params, searchParams }: { params: Promise<{ slug: string; sub: string }>; searchParams: Promise<{ type?: string | string[]; price?: string | string[]; sort?: string | string[]; city?: string | string[]; neighborhood?: string | string[] }> }) {
  const { slug, sub } = await params;
  const query = await searchParams;
  const citySlug = typeof query.city === "string" ? query.city : DEFAULT_CITY_SLUG;
  const neighborhoodSlug = typeof query.neighborhood === "string" ? query.neighborhood : undefined;
  const [categories, subcategories, businesses, city] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, subcategorySlug: sub, citySlug, neighborhoodSlug }), getCityBySlug(citySlug)]);
  const category = categories.find((item) => item.slug === slug);
  const selected = subcategories.find((item) => item.slug === sub);
  return <CategoryResults slug={slug} sub={sub} category={category} selected={selected} subcategories={subcategories} businesses={businesses} city={city} neighborhoodSlug={neighborhoodSlug} initialQuery={{ type: typeof query.type === "string" ? query.type : undefined, price: typeof query.price === "string" ? query.price : undefined, sort: typeof query.sort === "string" ? query.sort : undefined }} />;
}
