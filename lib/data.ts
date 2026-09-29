import { supabase } from "./supabase";
import { seedBusinesses, seedCategories, seedSubcategories } from "./seed";
import { seedCities, DEFAULT_CITY_SLUG } from "./cities";
import { getNeighborhoodBySlug } from "./neighborhoods";
import { classifySearchIntent } from "./search-intent";
import { Business, Category, City, Subcategory } from "./types";

const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const categoryAliases: Record<string, string[]> = {
  "sports-store": ["ورزش", "ورزشی", "سوارکاری", "اسب", "فوتبال", "بدنسازی"],
  "kids-clothing": ["کودک", "بچه", "بچگانه", "نوجوان"],
  "mobile-repair": ["موبایل", "گوشی", "تلفن", "آیفون", "اندروید"],
  "womens-clothing": ["زنانه", "دخترانه", "مانتو", "پوشاک"],
  "mens-clothing": ["مردانه", "پسرانه", "پوشاک"],
  "beauty": ["آرایش", "زیبایی", "سالن", "مو"],
  "food": ["غذا", "رستوران", "کافه", "فست فود"],
  "home": ["خانه", "منزل", "لوازم خانگی"],
  "technical": ["تعمیر", "فنی", "خدمات"],
};

function normalizePersian(value: string): string {
  return value.toLocaleLowerCase("fa-IR").replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u200d]/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeSeedBusiness(business: Business | null | undefined, categories: Category[], subcategories: Subcategory[]): Business | null {
  if (!business) return null;
  const seedCategory = seedCategories.find((category) => category.id === business.category_id);
  const category = categories.find((item) => item.slug === seedCategory?.slug);
  const seedSubcategory = seedSubcategories.find((subcategory) => subcategory.id === business.subcategory_id);
  const subcategory = subcategories.find((item) => item.category_id === category?.id && item.slug === seedSubcategory?.slug);
  return { ...business, category_id: category?.id || business.category_id, subcategory_id: subcategory?.id || business.subcategory_id };
}

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const earthRadius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function relevance(business: Business, query: string | undefined, categories: Category[], subcategories: Subcategory[]): number {
  if (!query) return 0;
  const normalizedQuery = normalizePersian(query);
  const tokens = normalizedQuery.split(" ").filter((token) => token.length > 1);
  if (!tokens.length) return 0;
  const category = categories.find((item) => item.id === business.category_id);
  const subcategory = subcategories.find((item) => item.id === business.subcategory_id);
  const intents = classifySearchIntent(query);
  const intentMatch = intents.some((intent) => intent.categorySlugs?.includes(category?.slug || "") || intent.subcategorySlugs?.includes(subcategory?.slug || ""));
  const aliases = [...(categoryAliases[category?.slug || ""] || []), ...(categoryAliases[subcategory?.slug || ""] || []), ...intents.flatMap((intent) => intent.keywords)];
  const text = normalizePersian([business.name, business.address || "", category?.name || "", subcategory?.name || "", ...(business.search_terms || []), ...aliases].join(" "));
  const matches = tokens.filter((token) => text.includes(token)).length;
  if (intentMatch) return 0.95;
  return Math.min(1, matches / tokens.length);
}

function rankBusinesses(list: Business[], params: { citySlug?: string; neighborhoodSlug?: string; query?: string }, categories: Category[], subcategories: Subcategory[]): Business[] {
  const neighborhood = getNeighborhoodBySlug(params.citySlug, params.neighborhoodSlug);
  const prepared = list.map((business) => ({
    ...business,
    distanceKm: neighborhood && business.lat != null && business.lng != null ? Number(distanceKm(neighborhood.centerLat, neighborhood.centerLng, business.lat, business.lng).toFixed(1)) : undefined,
    _relevance: relevance(business, params.query, categories, subcategories),
  }));
  const filtered = params.query && normalizePersian(params.query).length > 1 ? prepared.filter((business) => business._relevance > 0) : prepared;
  return filtered.sort((a, b) => {
    if (params.query && b._relevance !== a._relevance) return b._relevance - a._relevance;
    if (neighborhood && a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) return a.distanceKm - b.distanceKm;
    if (neighborhood && a.distanceKm != null) return -1;
    if (neighborhood && b.distanceKm != null) return 1;
    return a.name.localeCompare(b.name, "fa");
  }).map(({ _relevance, ...business }) => business);
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

export async function getBusinesses(params: { categorySlug?: string; subcategorySlug?: string; citySlug?: string; neighborhoodSlug?: string; query?: string }): Promise<Business[]> {
  const directory = await getDirectory();
  let list: Business[];
  if (!configured) {
    list = seedBusinesses.filter((business) => business.status === "approved");
  } else {
    let query = supabase.from("businesses").select("*, online_shop_details(*)").eq("status", "approved");
    if (params.categorySlug) {
      const category = await supabase.from("categories").select("id").eq("slug", params.categorySlug).maybeSingle();
      if (category.error || !category.data) return [];
      query = query.eq("category_id", category.data.id);
    }
    if (params.subcategorySlug) {
      const subcategory = await supabase.from("subcategories").select("id").eq("slug", params.subcategorySlug).maybeSingle();
      if (subcategory.error || !subcategory.data) return [];
      query = query.eq("subcategory_id", subcategory.data.id);
    }
    if (params.citySlug) {
      const city = await getCityBySlug(params.citySlug);
      query = query.eq("city_id", city.id);
    }
    const result = await query;
    if (result.error) return [];
    list = result.data as Business[];
    const demo = normalizeSeedBusiness(seedBusinesses.find((business) => business.id === "go2china" && business.status === "approved"), directory.categories, directory.subcategories);
    const demoCategory = demo && directory.categories.find((category) => category.id === demo.category_id);
    const demoSubcategory = demo && directory.subcategories.find((subcategory) => subcategory.id === demo.subcategory_id);
    const demoMatches = demo && (!params.citySlug || demo.city_id === params.citySlug) && (!params.categorySlug || demoCategory?.slug === params.categorySlug) && (!params.subcategorySlug || demoSubcategory?.slug === params.subcategorySlug) ? [demo] : [];
    const remoteIds = new Set(list.map((business) => business.id));
    list = [...demoMatches.filter((business) => !remoteIds.has(business.id)), ...list];
  }
  if (params.categorySlug) {
    const category = directory.categories.find((item) => item.slug === params.categorySlug);
    list = list.filter((business) => business.category_id === category?.id);
  }
  if (params.subcategorySlug) {
    const category = directory.categories.find((item) => item.slug === params.categorySlug);
    const subcategory = directory.subcategories.find((item) => item.category_id === category?.id && item.slug === params.subcategorySlug);
    list = list.filter((business) => business.subcategory_id === subcategory?.id);
  }
  if (params.citySlug && !configured) list = list.filter((business) => business.city_id === params.citySlug);
  return rankBusinesses(list, params, directory.categories, directory.subcategories);
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
