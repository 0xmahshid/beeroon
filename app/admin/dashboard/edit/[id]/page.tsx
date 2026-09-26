import BusinessForm from "@/components/BusinessForm";
import { getCategories, getCities } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default async function EditBusiness({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, cities, business] = await Promise.all([
    getCategories(),
    getCities(),
    supabase.from("businesses").select("*").eq("id", id).single(),
  ]);
  return <BusinessForm categories={categories} cities={cities} initial={business.data} businessId={id} />;
}
