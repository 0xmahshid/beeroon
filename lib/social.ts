export const SOCIAL_NETWORKS = [
  { key: "instagram", label: "اینستاگرام", placeholder: "@yourbusiness", base: "https://instagram.com/", tone: "red" },
  { key: "telegram", label: "تلگرام", placeholder: "@yourchannel", base: "https://t.me/", tone: "blue" },
  { key: "telegram_group", label: "گروه تلگرام", placeholder: "@yourgroup", base: "https://t.me/", tone: "blue" },
  { key: "telegram_channel", label: "کانال تلگرام", placeholder: "@yourchannel", base: "https://t.me/", tone: "blue" },
  { key: "whatsapp", label: "واتساپ", placeholder: "98912...", base: "https://wa.me/", tone: "green" },
  { key: "bale", label: "بله", placeholder: "@yourchannel", base: "https://ble.ir/", tone: "blue" },
  { key: "eitaa", label: "ایتا", placeholder: "@yourchannel", base: "https://eitaa.com/", tone: "blue" },
  { key: "rubika", label: "روبیکا", placeholder: "@yourchannel", base: "https://rubika.ir/", tone: "purple" },
  { key: "soroush", label: "سروش", placeholder: "@yourchannel", base: "https://splus.ir/", tone: "blue" },
  { key: "tiktok", label: "تیک‌تاک", placeholder: "@yourbusiness", base: "https://tiktok.com/@", tone: "dark" },
  { key: "youtube", label: "یوتیوب", placeholder: "@yourchannel", base: "https://youtube.com/@", tone: "red" },
  { key: "linkedin", label: "لینکدین", placeholder: "company/yourbusiness", base: "https://linkedin.com/", tone: "blue" },
  { key: "facebook", label: "فیسبوک", placeholder: "yourbusiness", base: "https://facebook.com/", tone: "blue" },
  { key: "x", label: "X / توییتر", placeholder: "@yourbusiness", base: "https://x.com/", tone: "dark" },
  { key: "aparat", label: "آپارات", placeholder: "yourchannel", base: "https://aparat.com/", tone: "red" },
] as const;

export type SocialNetworkKey = (typeof SOCIAL_NETWORKS)[number]["key"];
export type SocialLinks = Partial<Record<SocialNetworkKey, string>>;

const legacySocialKeys = ["instagram", "telegram", "whatsapp", "bale"] as const;

export function mergeSocialLinks(
  value: unknown,
  legacy?: Partial<Record<(typeof legacySocialKeys)[number], string | null>>,
): SocialLinks {
  const links: SocialLinks =
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          Object.entries(value).filter(
            ([key, item]) =>
              SOCIAL_NETWORKS.some((network) => network.key === key) &&
              typeof item === "string" &&
              item.trim().length > 0,
          ),
        )
      : {};

  for (const key of legacySocialKeys) {
    if (!links[key] && legacy?.[key]) links[key] = legacy[key] as string;
  }
  return links;
}

export function socialUrl(key: SocialNetworkKey, value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const network = SOCIAL_NETWORKS.find((item) => item.key === key);
  if (!network) return trimmed;
  const handle = key === "whatsapp" ? trimmed.replace(/[^\d+]/g, "").replace(/^\+/, "") : trimmed.replace(/^@/, "");
  return network.base + handle;
}