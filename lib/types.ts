export type City = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
};

export type OnlineShopDetails = {
  business_id: string;
  website_url: string | null;
  sales_type: "retail" | "wholesale" | "both";
  shipping_area: string;
  shipping_methods: string[];
  payment_methods: string[];
  specialty_category: string;
  created_at: string;
  updated_at: string;
};

import type { SocialLinks } from "./social";

export type Business = {
  id: string;
  name: string;
  city_id: string;
  business_type: "physical" | "online_shop";
  category_id: string;
  subcategory_id: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  social_links: SocialLinks | null;
  instagram: string | null;
  telegram: string | null;
  bale: string | null;
  whatsapp: string | null;
  neshan: string | null;
  hours: string | null;
  price_tier: 1 | 2 | 3 | null;
  is_supporter: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  online_shop_details?: OnlineShopDetails | OnlineShopDetails[] | null;
};