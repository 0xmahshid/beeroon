import { supabase } from "./supabase";
import { seedBusinesses, seedCategories, seedSubcategories } from "./seed";
import { Business, Category, Subcategory } from "./types";
const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getCategories(): Promise<Category[]> {
  if (!configured) return seedCategories;
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data?.length) return seedCategories;
  const remote = data as Category[];
  const remoteSlugs = new Set(remote.map((category) => category.slug));
  return [...remote, ...seedCategories.filter((category) => !remoteSlugs.has(category.slug))];
}
export async function getDirectory(): Promise<{ categories: Category[]; subcategories: Subcategory[] }> {
  const categories = await getCategories();
  if (!configured) return { categories: seedCategories, subcategories: seedSubcategories };
  const { data, error } = await supabase.from("subcategories").select("*").order("name");
  if (error || !data?.length) return { categories, subcategories: seedSubcategories };
  const remote = data as Subcategory[];
  const remoteKeys = new Set(remote.map((item) => item.category_id + ":" + item.slug));
  const fallback = seedSubcategories.flatMap((item) => { const seedCategory = seedCategories.find((category) => category.id === item.category_id); const actualCategory = categories.find((category) => category.slug === seedCategory?.slug); if (!actualCategory) return []; const normalized = { ...item, category_id: actualCategory.id, id: actualCategory.id + "-" + item.slug }; return remoteKeys.has(actualCategory.id + ":" + item.slug) ? [] : [normalized]; });
  return { categories, subcategories: [...remote, ...fallback] };
}
export async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  const seedCategory = seedCategories.find((category) => category.slug === categorySlug);
  const seedRows = seedSubcategories.filter((subcategory) => subcategory.category_id === seedCategory?.id);
  if (!configured) return seedRows;
  const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).single();
  if (!category) return seedRows;
  const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", category.id).order("name");
  if (error) return seedRows;
  const remote = data as Subcategory[]; const remoteSlugs = new Set(remote.map((subcategory) => subcategory.slug));
  return [...remote, ...seedRows.filter((subcategory) => !remoteSlugs.has(subcategory.slug))];
}
export async function getBusinesses(params: { categorySlug?: string; subcategorySlug?: string; citySlug?: string }): Promise<Business[]> {
  if (!configured) { let list = seedBusinesses.filter((business) => business.status === "approved"); if (params.categorySlug) { const category = seedCategories.find((item) => item.slug === params.categorySlug); list = list.filter((business) => business.category_id === category?.id); } if (params.subcategorySlug) { const category = seedCategories.find((item) => item.slug === params.categorySlug); const subcategory = seedSubcategories.find((item) => item.category_id === category?.id && item.slug === params.subcategorySlug); list = list.filter((business) => business.subcategory_id === subcategory?.id); } if (params.citySlug) list = list.filter((business) => business.city_id === params.citySlug); return list.sort(() => Math.random() - 0.5); }
  let query = supabase.from("businesses").select("*").eq("status", "approved");
  if (params.categorySlug) { const { data: category } = await supabase.from("categories").select("id").eq("slug", params.categorySlug).single(); if (category) query = query.eq("category_id", category.id); }
  if (params.subcategorySlug) { const { data: subcategory } = await supabase.from("subcategories").select("id").eq("slug", params.subcategorySlug).single(); if (subcategory) query = query.eq("subcategory_id", subcategory.id); }
  if (params.citySlug) query = query.eq("city_id", params.citySlug);
  const { data, error } = await query; if (error) return []; return (data as Business[]).sort(() => Math.random() - 0.5);
}
