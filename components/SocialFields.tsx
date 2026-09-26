"use client";

import { SOCIAL_NETWORKS, type SocialLinks, type SocialNetworkKey } from "@/lib/social";

type Props = {
  value: SocialLinks;
  onChange: (value: SocialLinks) => void;
  accent?: "pink" | "green";
};

export default function SocialFields({ value, onChange, accent = "pink" }: Props) {
  const focusClass = accent === "green"
    ? "focus:border-[#38a18f] focus:ring-[#38a18f]/10"
    : "focus:border-[#ed0b55] focus:ring-[#ed0b55]/10";

  function set(key: SocialNetworkKey, next: string) {
    const trimmed = next.trim();
    const updated = { ...value };
    if (trimmed) updated[key] = next;
    else delete updated[key];
    onChange(updated);
  }

  return (
    <section className="space-y-4 border-t border-[#f0e5de] pt-6">
      <div>
        <h2 className="text-sm font-black text-[#4b3b3c]">شبکه‌های اجتماعی</h2>
        <p className="mt-1 text-xs leading-6 text-[#8a7b79]">
          هر شبکه‌ای را که برای کسب‌وکارت فعال است وارد کن؛ همه‌ی موارد در کارت و صفحه‌ی معرفی نمایش داده می‌شوند.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {SOCIAL_NETWORKS.map((network) => (
          <label key={network.key} className="text-xs font-bold text-[#4b3b3c]">
            {network.label}
            <input
              value={value[network.key] || ""}
              onChange={(event) => set(network.key, event.target.value)}
              placeholder={network.placeholder}
              dir="ltr"
              className={`mt-1.5 w-full rounded-xl border border-[#f0dfe0] bg-[#fffaf8] px-3 py-2.5 text-sm font-normal outline-none transition focus:ring-4 ${focusClass}`}
            />
          </label>
        ))}
      </div>
    </section>
  );
}