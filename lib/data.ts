import { supabase } from "./supabase";
import { seedBusinesses, seedCategories, seedSubcategories } from "./seed";
import { seedCities, DEFAULT_CITY_SLUG } from "./cities";
import { classifySearchIntent, type SearchIntent } from "./search-intent";
import { normalizeSearch, tokenize, buildSearchText } from "./persian";
import { computeScore, sortBusinesses, type SortMode } from "./ranking";
import { isOpenNow } from "./business-hours";
import { computeProfileCompleteness, daysSince } from "./profile-completeness";
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

function normalizeSeedBusiness(business: Business | null | undefined, categories: Category[], subcategories: Subcategory[]): Business | null {
  if (!business) return null;
  const seedCategory = seedCategories.find((category) => category.id === business.category_id);
  const category = categories.find((item) => item.slug === seedCategory?.slug);
  const seedSubcategory = seedSubcategories.find((subcategory) => subcategory.id === business.subcategory_id);
  const subcategory = subcategories.find((item) => item.category_id === category?.id && item.slug === seedSubcategory?.slug);
  return { ...business, category_id: category?.id || business.category_id, subcategory_id: subcategory?.id || business.subcategory_id };
}

function relevance(
  business: Business,
  query: string | undefined,
  categories: Category[],
  subcategories: Subcategory[],
  intents: SearchIntent[],
): { score: number; matchedIntent?: SearchIntent; matchedSubcategory?: Subcategory; matchedCategory?: Category } {
  const category = categories.find((item) => item.id === business.category_id);
  const subcategory = subcategories.find((item) => item.id === business.subcategory_id);
  if (!query) return { score: 0, matchedCategory: category, matchedSubcategory: subcategory };

  const tokens = tokenize(query);
  if (!tokens.length) return { score: 0, matchedCategory: category, matchedSubcategory: subcategory };

  const matchedIntent = intents.find(
    (intent) =>
      intent.categorySlugs?.includes(category?.slug || "") ||
      intent.subcategorySlugs?.includes(subcategory?.slug || ""),
  );
  const aliases = [
    ...(categoryAliases[category?.slug || ""] || []),
    ...(categoryAliases[subcategory?.slug || ""] || []),
    ...intents.flatMap((intent) => intent.keywords),
  ];
  const text = buildSearchText([
    business.name,
    business.address,
    category?.name,
    subcategory?.name,
    ...(business.search_terms || []),
    ...aliases,
  ]);
  const matches = tokens.filter((tok) => text.includes(tok)).length;
  const rawScore = matchedIntent ? 0.95 : Math.min(1, matches / tokens.length);
  return {
    score: rawScore,
    matchedIntent,
    matchedCategory: category,
    matchedSubcategory: subcategory,
  };
}

function buildMatchReason(
  intent: SearchIntent | undefined,
  category: Category | undefined,
  subcategory: Subcategory | undefined,
): string {
  if (intent) return `مرتبط با جست‌وجوی ${intent.name}`;
  if (subcategory) return `دسته: ${subcategory.name}`;
  if (category) return `دسته: ${category.name}`;
  return "";
}

function rankBusinesses(
  list: Business[],
  params: { query?: string; sortMode?: SortMode },
  categories: Category[],
  subcategories: Subcategory[],
): Business[] {
  const intents = classifySearchIntent(params.query);
  const prepared = list.map((business) => {
    const rel = relevance(business, params.query, categories, subcategories, intents);
    const openNow = isOpenNow(business.hours) ?? false;
    const profileCompleteness = computeProfileCompleteness(business);
    const updatedDaysAgo = daysSince((business as any).updated_at || business.created_at);
    const score = computeScore({
      relevance: rel.score,
      openNow,
      profileCompleteness,
      verified: Boolean(business.is_verified),
      updatedDaysAgo,
    });
    const matchReason = buildMatchReason(rel.matchedIntent, rel.matchedCategory, rel.matchedSubcategory);
    return {
      ...business,
      score,
      matchReason,
      _relevance: rel.score,
      updatedAt: (business as any).updated_at || business.created_at,
    };
  });

  const filtered = params.query && normalizeSearch(params.query).length > 1
    ? prepared.filter((business) => business._relevance > 0)
    : prepared;

  const sorted = sortBusinesses(filtered, params.sortMode || "relevance");
  return sorted.map(({ _relevance, updatedAt, ...rest }) => rest as Business);
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
  const { data: categoryRow, error: categoryError } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();
  if (categoryError || !categoryRow) return seedRows;
  const { data, error } = await supabase.from("subcategories").select("*").eq("category_id", (categoryRow as { id: string }).id).order("name");
  if (error) return seedRows;
  const remote = data as Subcategory[];
  const remoteSlugs = new Set(remote.map((subcategory) => subcategory.slug));
  return [...remote, ...seedRows.filter((subcategory) => !remoteSlugs.has(subcategory.slug))];
}

export type BusinessFilters = {
  openNow?: boolean;
  verifiedOnly?: boolean;
  hasPhone?: boolean;
  hasDirections?: boolean;
  inPersonOnly?: boolean;
  onlineOnly?: boolean;
};

export async function getBusinesses(params: {
  categorySlug?: string;
  subcategorySlug?: string;
  citySlug?: string;
  query?: string;
  sortMode?: SortMode;
  filters?: BusinessFilters;
}): Promise<Business[]> {
  const directory = await getDirectory();
  const citySlug = params.citySlug;
  let list: Business[];

  if (!configured) {
    list = seedBusinesses.filter((business) => business.status === "approved");
  } else {
    let query = supabase.from("businesses").select("*, online_shop_details(*)").eq("status", "approved");

    if (params.categorySlug) {
      const { data: categoryRow, error: categoryError } = await supabase.from("categories").select("id").eq("slug", params.categorySlug).maybeSingle();
      if (categoryError || !categoryRow) return [];
      query = query.eq("category_id", (categoryRow as { id: string }).id);
    }
    if (params.subcategorySlug) {
      const { data: subcategoryRow, error: subcategoryError } = await supabase.from("subcategories").select("id").eq("slug", params.subcategorySlug).maybeSingle();
      if (subcategoryError || !subcategoryRow) return [];
      query = query.eq("subcategory_id", (subcategoryRow as { id: string }).id);
    }
    if (citySlug) {
      const city = await getCityBySlug(citySlug);
      query = query.eq("city_id", city.id);
    }
    const result = await query;
    if (result.error) return [];
    list = result.data as Business[];

    const demo = normalizeSeedBusiness(
      seedBusinesses.find((business) => business.id === "go2china" && business.status === "approved"),
      directory.categories,
      directory.subcategories,
    );
    const demoCategory = demo && directory.categories.find((category) => category.id === demo.category_id);
    const demoSubcategory = demo && directory.subcategories.find((subcategory) => subcategory.id === demo.subcategory_id);
    const demoMatches = demo &&
      (!citySlug || demo.city_id === citySlug) &&
      (!params.categorySlug || demoCategory?.slug === params.categorySlug) &&
      (!params.subcategorySlug || demoSubcategory?.slug === params.subcategorySlug)
      ? [demo]
      : [];
    const remoteIds = new Set(list.map((business) => business.id));
    list = [...demoMatches.filter((business) => !remoteIds.has(business.id)), ...list];
  }

  if (params.categorySlug) {
    const category = directory.categories.find((item) => item.slug === params.categorySlug);
    list = list.filter((business) => business.category_id === category?.id);
  }
  if (params.subcategorySlug) {
    const category = directory.categories.find((item) => item.slug === params.categorySlug);
    const subcategory = directory.subcategories.find(
      (item) => item.category_id === category?.id && item.slug === params.subcategorySlug,
    );
    list = list.filter((business) => business.subcategory_id === subcategory?.id);
  }
  if (citySlug && !configured) {
    list = list.filter((business) => business.city_id === citySlug);
  }
  const ranked = rankBusinesses(list, params, directory.categories, directory.subcategories);

  const f = params.filters || {};
  return ranked.filter((b) => {
    if (f.openNow && !isOpenNow(b.hours)) return false;
    if (f.verifiedOnly && !b.is_verified) return false;
    if (f.hasPhone && !b.phone?.trim()) return false;
    if (f.hasDirections && !b.neshan?.trim() && (b.lat == null || b.lng == null)) return false;
    if (f.inPersonOnly && !b.address?.trim()) return false;
    if (f.onlineOnly) {
      const os = Array.isArray(b.online_shop_details) ? b.online_shop_details[0] : b.online_shop_details;
      const hasOnlineSignal =
        !!os?.website_url ||
        !!b.website_url ||
        !!b.instagram ||
        !!b.telegram ||
        !!b.bale ||
        !!b.whatsapp ||
        !!b.social_links?.instagram ||
        !!b.social_links?.telegram ||
        !!b.social_links?.bale ||
        !!b.social_links?.whatsapp;
      if (!hasOnlineSignal) return false;
    }
    return true;
  });
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const seedFallback = seedBusinesses.find((business) => business.id === id && business.status === "approved") || null;
  if (!configured) return normalizeSeedBusiness(seedFallback, seedCategories, seedSubcategories);
  const directory = await getDirectory();
  const fallback = normalizeSeedBusiness(seedFallback, directory.categories, directory.subcategories);
  const { data, error } = await supabase
    .from("businesses")
    .select("*, online_shop_details(*)")
    .eq("id", id)
    .eq("status", "approved")
    .maybeSingle();
  if (error || !data) return fallback;
  const business = data as Business;
  const intents: SearchIntent[] = [];
  const category = directory.categories.find((c) => c.id === business.category_id);
  const subcategory = directory.subcategories.find((s) => s.id === business.subcategory_id);
  return {
    ...business,
    matchReason: buildMatchReason(undefined, category, subcategory),
  };
}
