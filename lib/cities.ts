import type { City } from "@/lib/types";

// The first release covers the provincial capitals. More cities can be added
// to Supabase without changing the UI or URL format.
export const seedCities: City[] = [
  { id: "mashhad", name: "مشهد", slug: "mashhad", active: true },
  { id: "tehran", name: "تهران", slug: "tehran", active: true },
  { id: "karaj", name: "کرج", slug: "karaj", active: true },
  { id: "isfahan", name: "اصفهان", slug: "isfahan", active: true },
  { id: "shiraz", name: "شیراز", slug: "shiraz", active: true },
  { id: "tabriz", name: "تبریز", slug: "tabriz", active: true },
  { id: "ahvaz", name: "اهواز", slug: "ahvaz", active: true },
  { id: "qom", name: "قم", slug: "qom", active: true },
  { id: "kermanshah", name: "کرمانشاه", slug: "kermanshah", active: true },
  { id: "urmia", name: "ارومیه", slug: "urmia", active: true },
  { id: "rasht", name: "رشت", slug: "rasht", active: true },
  { id: "zahedan", name: "زاهدان", slug: "zahedan", active: true },
  { id: "kerman", name: "کرمان", slug: "kerman", active: true },
  { id: "hamadan", name: "همدان", slug: "hamadan", active: true },
  { id: "yazd", name: "یزد", slug: "yazd", active: true },
  { id: "ardabil", name: "اردبیل", slug: "ardabil", active: true },
  { id: "bandar-abbas", name: "بندرعباس", slug: "bandar-abbas", active: true },
  { id: "arak", name: "اراک", slug: "arak", active: true },
  { id: "zanjan", name: "زنجان", slug: "zanjan", active: true },
  { id: "sanandaj", name: "سنندج", slug: "sanandaj", active: true },
  { id: "khorramabad", name: "خرم‌آباد", slug: "khorramabad", active: true },
  { id: "sari", name: "ساری", slug: "sari", active: true },
  { id: "gorgan", name: "گرگان", slug: "gorgan", active: true },
  { id: "qazvin", name: "قزوین", slug: "qazvin", active: true },
  { id: "bojnurd", name: "بجنورد", slug: "bojnurd", active: true },
  { id: "birjand", name: "بیرجند", slug: "birjand", active: true },
  { id: "ilam", name: "ایلام", slug: "ilam", active: true },
  { id: "bushehr", name: "بوشهر", slug: "bushehr", active: true },
  { id: "yasuj", name: "یاسوج", slug: "yasuj", active: true },
  { id: "shahrekord", name: "شهرکرد", slug: "shahrekord", active: true },
  { id: "semnan", name: "سمنان", slug: "semnan", active: true },
];

export const DEFAULT_CITY_SLUG = "mashhad";