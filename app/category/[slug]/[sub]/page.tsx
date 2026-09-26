import { getBusinesses, getCategories, getSubcategories } from "@/lib/data";
import CategoryResults from "@/components/CategoryResults";

export default async function SubcategoryPage({ params }: { params: Promise<{ slug: string; sub: string }> }) {
  const { slug, sub } = await params;
  const [categories, subcategories, businesses] = await Promise.all([getCategories(), getSubcategories(slug), getBusinesses({ categorySlug: slug, subcategorySlug: sub })]);
  const category = categories.find((item) => item.slug === slug);
  const selected = subcategories.find((item) => item.slug === sub);
  return <CategoryResults slug={slug} sub={sub} category={category} selected={selected} subcategories={subcategories} businesses={businesses} />;
}
