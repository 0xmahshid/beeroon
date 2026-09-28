"use client";

import { useState } from "react";
import { SOCIAL_NETWORKS, type SocialLinks, type SocialNetworkKey } from "@/lib/social";
import SocialIcon from "@/components/SocialIcon";

type Props = {
  value: SocialLinks;
  onChange: (value: SocialLinks) => void;
  accent?: "pink" | "green";
};

export default function SocialFields({ value, onChange, accent = "pink" }: Props) {
  const [selected, setSelected] = useState<SocialNetworkKey[]>(() =>
    SOCIAL_NETWORKS.filter((network) => Boolean(value[network.key])).map((network) => network.key),
  );
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

  function toggle(key: SocialNetworkKey) {
    if (selected.includes(key)) {
      setSelected((current) => current.filter((item) => item !== key));
      const updated = { ...value };
      delete updated[key];
      onChange(updated);
      return;
    }
    setSelected((current) => [...current, key]);
  }

  return (
    <section className="space-y-4 border-t border-[#f0e5de] pt-6">
      <div>
        <h2 className="text-sm font-black text-[#4b3b3c]">شبکه‌های اجتماعی</h2>
        <p className="mt-1 text-xs leading-6 text-[#8a7b79]">شبکه‌هایی را که کسب‌وکارت در آن‌ها فعال است انتخاب کن، سپس لینک هرکدام را اضافه کن.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SOCIAL_NETWORKS.map((network) => {
          const active = selected.includes(network.key);
          return <button key={network.key} type="button" onClick={() => toggle(network.key)} className={"inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-bold transition " + (active ? "border-[#ed0b55] bg-[#fff0f3] text-[#ed0b55] shadow-sm" : "border-[#eadfe3] bg-white text-[#8a7b79] hover:border-[#ed0b55]/50")}><SocialIcon network={network.key} className="h-4 w-4" style={{ color: network.color }} />{network.label}</button>;
        })}
      </div>
      {selected.length > 0 && <div className="grid gap-3 sm:grid-cols-2">
        {SOCIAL_NETWORKS.filter((network) => selected.includes(network.key)).map((network) => (
          <label key={network.key} className="text-xs font-bold text-[#4b3b3c]">
            <span className="flex items-center gap-1.5"><SocialIcon network={network.key} className="h-4 w-4" style={{ color: network.color }} />{network.label}</span>
            <input value={value[network.key] || ""} onChange={(event) => set(network.key, event.target.value)} placeholder={network.placeholder} dir="ltr" className={"mt-1.5 w-full rounded-xl border border-[#f0dfe0] bg-[#fffaf8] px-3 py-2.5 text-sm font-normal outline-none transition focus:ring-4 " + focusClass} />
          </label>
        ))}
      </div>}
    </section>
  );
}