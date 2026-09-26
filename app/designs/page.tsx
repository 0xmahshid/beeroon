import DesignShowcase from "@/components/DesignShowcase";
import { getDirectory } from "@/lib/data";

export const metadata = {
  title: "انتخاب مسیر طراحی | بیرون",
  description: "سه مسیر پیشنهادی برای تجربه‌ی کشف بیرون.",
};

export default async function DesignDirectionsPage() {
  const { categories, subcategories } = await getDirectory();

  return <DesignShowcase categories={categories} subcategories={subcategories} />;
}