import DesignShowcase from "@/components/DesignShowcase";
import { getDirectory } from "@/lib/data";

export const metadata = {
  title: "راه‌های جست‌وجو | بیرون",
  description: "سه راه برای پیدا کردن کسب‌وکارهای بیرون را مقایسه کن.",
};

export default async function DesignDirectionsPage() {
  const { categories, subcategories } = await getDirectory();

  return <DesignShowcase categories={categories} subcategories={subcategories} />;
}