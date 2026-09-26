import BusinessForm from "@/components/BusinessForm";
import { getCategories } from "@/lib/data";
import { supabase } from "@/lib/supabase";

export default async function EditBusiness({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categories = await getCategories();
  const { data } = await supabase.from("businesses").select("*").eq("id", id).single();
  return <BusinessForm categories={categories} initial={data} businessId={id} />;
}
