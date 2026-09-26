import BusinessForm from "@/components/BusinessForm";
import { getCategories, getCities } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function EditBusiness({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const serverSupabase = await createSupabaseServerClient();
  const [categories, cities, business] = await Promise.all([
    getCategories(),
    getCities(),
    serverSupabase.from("businesses").select("*").eq("id", id).single(),
  ]);
  return <BusinessForm categories={categories} cities={cities} initial={business.data} businessId={id} />;
}
