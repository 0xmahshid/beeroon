import BusinessForm from "@/components/BusinessForm";
import { getCategories, getCities } from "@/lib/data";

export default async function NewBusiness() {
  const [categories, cities] = await Promise.all([getCategories(), getCities()]);
  return <BusinessForm categories={categories} cities={cities} />;
}
