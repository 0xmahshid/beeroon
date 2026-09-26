import BusinessForm from "@/components/BusinessForm";
import { getCategories } from "@/lib/data";

export default async function NewBusiness() {
  const categories = await getCategories();
  return <BusinessForm categories={categories} />;
}
