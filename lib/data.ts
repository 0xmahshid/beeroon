import { supabase } from "./supabase";
import { seedBusinesses, seedCategories, seedSubcategories } from "./seed";
import { Business, Category, Subcategory } from "./types";

const configured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getCategories(): Promise<Category[]> {
  if (!configured) return seedCategories;
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data?.length) return seedCategories;
  return data as Category[];
}

export async function getSubcategories(categorySlug: string): Promise<Subcategory[]> {
  if (!configured) {
    const cat = seedCategories.find((c) => c.slug === categorySlug);
    return seedSubcategories.filter((s) => s.category_id === cat?.id);
  }
  const { data: cat } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();
  if (!cat) return [];
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", cat.id)
    .order("name");
  if (error) return [];
  return data as Subcategory[];
}

export async function getBusinesses(params: {
  categorySlug?: string;
  subcategorySlug?: string;
  citySlug?: string;
}): Promise<Business[]> {
  if (!configured) {
    let list = seedBusinesses.filter((b) => b.status === "approved");
    if (params.categorySlug) {
      const cat = seedCategories.find((c) => c.slug === params.categorySlug);
      list = list.filter((b) => b.category_id === cat?.id);
    }
    return list;
  }
  let query = supabase.from("businesses").select("*").eq("status", "approved");
  if (params.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }
  if (params.subcategorySlug) {
    const { data: sub } = await supabase
      .from("subcategories")
      .select("id")
      .eq("slug", params.subcategorySlug)
      .single();
    if (sub) query = query.eq("subcategory_id", sub.id);
  }
  const { data, error } = await query;
  if (error) return [];
  // Fair ranking: supporters are only ever mixed in randomly, never boosted to the top.
  return (data as Business[]).sort(() => Math.random() - 0.5);
}
