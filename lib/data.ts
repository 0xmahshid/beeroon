import { supabase } from "./supabase";
import { seedBusinesses, seedCategories, seedSubcategories } from "./seed";
import { seedCities, DEFAULT_CITY_SLUG } from "./cities";
import { Business, Category, City, Subcategory } from "./types";

const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function normalizeSeedBusiness(business: Business | undefined, categories: Category[], subcategories: Subcategory[]): Business | null {
  if (!business) return null;
  const seedCategory = seedCategories.find((category) => category.id === business.category_id);
  const category = categories.find((item) => item.slug === seedCategory?.slug);
  const seedSubcategory = seedSubcategories.find((subcategory) => subcategory.id === business.subcategory_id);
  const subcategory = subcategories.find((item) => item.category_id === category?.id && item.slug === seedSubcategory?.slug);
  return { ...business, category_id: category?.id || business.category_id, subcategory_id: subcategory?.id || business.subcategory_id };
}

export async function getCities(): Promise<City[]> {
  if (!configured) return seedCities.filter((city) => city.active);
  const { data, error } = await supabase.from("cities").select("*").eq("active", true).order("name");
  if (error || !data?.length) return seedCities.filter((city) => city.active);
  const remote = data as City[];
  const remoteSlugs = new Set(remote.map((city) => city.slug));
  return [...remote, ...seedCities.filter((city) => city.active && !remoteSlugs.has(city.slug))];
}

export async function getCityBySlug(slug?: string): Promise<City> {
  const cities = await getCities();
  return cities.find((city) => city.slug === slug) || cities.find((city) => city.slug === DEFAULT_CITY_SLUG) || seedCities[0];
}

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
  const fallback = seedSubcategories.flatMap((item) => {
    const seedCategory = seedCategories.find((category) => category.id === item.category_id);
    const actualCategory = categories.find((category) => category.slug === seedCategory?.slug);
    if (!actualCategory) return [];
    const normalized = { ...item, category_id: actualCategory.id, id: actualCategory.id + "-" + item.slug };
    return remoteKeys.has(actualCategory.id + ":" + item.slug) ? [] : [normalized];
  });
  return { categories, subcategories: [...remote, ...fallback] };
}

export async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  const seedCategory = seedCategories.find((category) => category.slug === categorySlug);
  const seedRows = seedSubcategories.filter((subcategory) => subcategory.category_id === seedCategory?.id);
  if (!configured) return seedRows;
  const { data: category } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();
  if (!category) return seedRows;
  const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", category.id).order("name");
  if (error) return seedRows;
  const remote = data as Subcategory[];
  const remoteSlugs = new Set(remote.map((subcategory) => subcategory.slug));
  return [...remote, ...seedRows.filter((subcategory) => !remoteSlugs.has(subcategory.slug))];
}

export async function getBusinesses(params: { categorySlug?: string; subcategorySlug?: string; citySlug?: string }): Promise<Business[]> {
  if (!configured) {
    let list = seedBusinesses.filter((business) => business.status === "approved");
    if (params.categorySlug) {
      const category = seedCategories.find((item) => item.slug === params.categorySlug);
      if (!category) return [];
      list = list.filter((business) => business.category_id === category.id);
    }
    if (params.subcategorySlug) {
      const category = seedCategories.find((item) => item.slug === params.categorySlug);
      const subcategory = seedSubcategories.find((item) => item.category_id === category?.id && item.slug === params.subcategorySlug);
      if (!subcategory) return [];
      list = list.filter((business) => business.subcategory_id === subcategory.id);
    }
    if (params.citySlug) list = list.filter((business) => business.city_id === params.citySlug);
    return list.sort(() => Math.random() - 0.5);
  }

  let query = supabase.from("businesses").select("*, online_shop_details(*)").eq("status", "approved");
  if (params.categorySlug) {
    const { data: category, error } = await supabase.from("categories").select("id").eq("slug", params.categorySlug).maybeSingle();
    if (error || !category) return [];
    query = query.eq("category_id", category.id);
  }
  if (params.subcategorySlug) {
    const { data: subcategory, error } = await supabase.from("subcategories").select("id").eq("slug", params.subcategorySlug).maybeSingle();
    if (error || !subcategory) return [];
    query = query.eq("subcategory_id", subcategory.id);
  }
  if (params.citySlug) {
    const city = await getCityBySlug(params.citySlug);
    query = query.eq("city_id", city.id);
  }
  const { data, error } = await query;
  if (error) return [];
  const remote = data as Business[];
  const directory = await getDirectory();
  const demo = normalizeSeedBusiness(seedBusinesses.find((business) => business.id === "go2china" && business.status === "approved"), directory.categories, directory.subcategories);
  const demoCategory = demo && directory.categories.find((category) => category.id === demo.category_id);
  const demoSubcategory = demo && directory.subcategories.find((subcategory) => subcategory.id === demo.subcategory_id);
  const demoMatches = demo && (!params.citySlug || demo.city_id === params.citySlug) && (!params.categorySlug || demoCategory?.slug === params.categorySlug) && (!params.subcategorySlug || demoSubcategory?.slug === params.subcategorySlug) ? [demo] : [];
  const remoteIds = new Set(remote.map((business) => business.id));
  return [...demoMatches.filter((business) => !remoteIds.has(business.id)), ...remote];
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const seedFallback = seedBusinesses.find((business) => business.id === id && business.status === "approved") || null;
  if (!configured) return normalizeSeedBusiness(seedFallback, seedCategories, seedSubcategories);
  const directory = await getDirectory();
  const fallback = normalizeSeedBusiness(seedFallback, directory.categories, directory.subcategories);
  const { data, error } = await supabase.from("businesses").select("*, online_shop_details(*)").eq("id", id).eq("status", "approved").maybeSingle();
  if (error || !data) return fallback;
  return data as Business;
}
