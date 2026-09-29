export type SearchIntent = {
  name: string;
  keywords: string[];
  categorySlugs?: string[];
  subcategorySlugs?: string[];
};

// The query can mention an item, but the result is always a local-business domain.
export const SEARCH_INTENTS: SearchIntent[] = [
  { name: "لوازم سوارکاری", keywords: ["اسب سواری", "اسب‌سواری", "سوارکاری", "لوازم اسب", "تجهیزات اسب", "تجهیزات سوارکاری", "زین", "یراق اسب", "شلوار اسب", "شلوار اسب سواری", "شلوار اسب‌سواری", "شلوار سوارکاری", "پوشاک سوارکاری"], categorySlugs: ["shopping", "sport"], subcategorySlugs: ["sports-store", "equestrian"] },
  { name: "تعمیرات موبایل", keywords: ["تعمیر موبایل", "تعمیرات موبایل", "تعمیر گوشی", "تعویض صفحه", "آیفون"], subcategorySlugs: ["mobile-repair"] },
  { name: "پوشاک کودک", keywords: ["لباس کودک", "لباس بچه", "لباس بچگانه", "پوشاک کودک", "پوشاک بچگانه", "بچگانه", "کودک", "سیسمونی"], subcategorySlugs: ["kids-clothing", "baby-store"] },
  { name: "خدمات زیبایی", keywords: ["آرایشگاه", "سالن زیبایی", "رنگ مو", "کوتاهی مو", "میکاپ"], categorySlugs: ["beauty"] },
  { name: "غذا و کافه", keywords: ["رستوران", "کافه", "غذا", "فست فود", "صبحانه"], categorySlugs: ["food"] },
  { name: "خدمات خودرو", keywords: ["تعمیر خودرو", "مکانیکی", "پنچرگیری", "لاستیک", "باتری خودرو"], categorySlugs: ["automotive", "technical"] },
  { name: "لوازم خانگی", keywords: ["یخچال", "لباسشویی", "لوازم خانه", "لوازم خانگی"], categorySlugs: ["home"], subcategorySlugs: ["home-appliances"] },
];

function normalize(value: string): string {
  return value.toLocaleLowerCase("fa-IR").replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u200d]/g, " ").replace(/\s+/g, " ").trim();
}

export function classifySearchIntent(query?: string): SearchIntent[] {
  if (!query) return [];
  const normalized = normalize(query);
  return SEARCH_INTENTS.filter((intent) => intent.keywords.some((keyword) => normalized.includes(normalize(keyword))));
}
