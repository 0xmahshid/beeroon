import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug })]);
  const category = categories.find((item) => item.slug === slug);
  return <CategoryResults slug={slug} category={category} subcategories={subcategories} businesses={businesses} />;
}
