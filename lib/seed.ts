import { Business, Category, Subcategory } from "./types";

export const seedCategories: Category[] = [
  { id: "c1", name: "ورزشی", slug: "sport", icon: "🏇" },
  { id: "c2", name: "خوراکی", slug: "food", icon: "🍽️" },
  { id: "c3", name: "صنایع‌دستی", slug: "handicraft", icon: "🧶" },
  { id: "c4", name: "خدمات فنی", slug: "services", icon: "🛠️" },
];

export const seedSubcategories: Subcategory[] = [
  { id: "s1", category_id: "c1", name: "سوارکاری", slug: "equestrian" },
  { id: "s2", category_id: "c1", name: "لوازم کوهنوردی", slug: "mountaineering" },
  { id: "s3", category_id: "c2", name: "کافه", slug: "cafe" },
  { id: "s4", category_id: "c3", name: "فرش‌دستباف", slug: "handmade-rug" },
];

export const seedBusinesses: Business[] = [
  {
    id: "b1",
    name: "باشگاه سوارکاری آفتاب",
    city_id: "mashhad",
    category_id: "c1",
    subcategory_id: "s1",
    address: "مشهد، بلوار وکیل‌آباد",
    lat: 36.297,
    lng: 59.556,
    phone: "09150000000",
    instagram: "aftab_equestrian",
    telegram: null,
    whatsapp: "989150000000",
    hours: "۸ تا ۲۰",
    price_tier: 2,
    is_supporter: true,
    status: "approved",
    created_at: new Date().toISOString(),
  },
  {
    id: "b2",
    name: "کافه نمور",
    city_id: "mashhad",
    category_id: "c2",
    subcategory_id: "s3",
    address: "مشهد، احمدآباد",
    lat: 36.303,
    lng: 59.588,
    phone: "05100000000",
    instagram: "namoor.cafe",
    telegram: null,
    whatsapp: null,
    hours: "۹ تا ۲۳",
    price_tier: 1,
    is_supporter: false,
    status: "approved",
    created_at: new Date().toISOString(),
  },
];
