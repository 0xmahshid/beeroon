import type { SocialNetworkKey } from "@/lib/social";

type Props = { network: SocialNetworkKey; className?: string; style?: import("react").CSSProperties };

export default function SocialIcon({ network, className = "h-4 w-4", style }: Props) {
  const common = { className, style, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (network) {
    case "instagram":
      return <svg {...common}><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r=".8" fill="currentColor" stroke="none" /></svg>;
    case "telegram":
    case "telegram_group":
    case "telegram_channel":
      return <svg {...common} fill="currentColor" stroke="none"><path d="m21.2 4.3-3.1 15.1c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.5 12.9.6 11.4c-1.1-.3-1.1-1.1.2-1.6L19.9 3.4c.9-.3 1.7.2 1.3.9Z" /></svg>;
    case "whatsapp":
      return <svg {...common}><path d="M20.2 11.2a8.1 8.1 0 0 1-12 7.1L4 19.5l1.3-4a8.1 8.1 0 1 1 14.9-4.3Z" /><path d="M9.2 8.3c.2-.3.4-.3.7-.2l1 .8c.2.2.2.4.1.7l-.4.7c.7 1.3 1.5 2.1 2.8 2.7l.7-.5c.2-.2.5-.2.7 0l.9.9c.2.2.2.5 0 .7-.5.6-1.1.8-1.8.6-2.8-.8-4.7-2.7-5.6-5.4-.2-.6.1-1.1.9-1.3Z" /></svg>;
    case "bale":
      return <svg {...common}><path d="M7.2 18.7c-2.2-.6-3.8-2.6-3.8-5V9.8c0-3 2.4-5.4 5.4-5.4h6.4c3 0 5.4 2.4 5.4 5.4v3.9c0 3-2.4 5.4-5.4 5.4h-4.3l-3.7 2v-2.4Z" /><path d="M8.8 9h2.1c1.4 0 1.9 2 .7 2.8 1.5.6 1.1 3.1-.6 3.1H8.8V9Zm4.7 0h1.1c1.8 0 2.2 2.4.7 3 1.6.5 1.1 2.9-.7 2.9h-1.1V9Z" fill="currentColor" stroke="none" /></svg>;
    case "eitaa":
      return <svg {...common}><path d="M6 4.5h12a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H10l-4 2.2v-2.2H6a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" /><path d="M8 9h8M8 12h5" /></svg>;
    case "rubika":
      return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="m8 8 8 8M16 8l-8 8" /></svg>;
    case "soroush":
      return <svg {...common}><path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.5-1.2A8.5 8.5 0 1 0 12 3.5Z" /><path d="M8.2 11.2h7.6M8.2 14h5" /></svg>;
    case "tiktok":
      return <svg {...common}><path d="M14.7 4v10.2a3.8 3.8 0 1 1-3-3.7" /><path d="M14.7 4c.7 2.1 2 3.4 4.3 3.7" /></svg>;
    case "youtube":
      return <svg {...common}><path d="M21 8.2a2.6 2.6 0 0 0-1.8-1.8C17.7 6 12 6 12 6s-5.7 0-7.2.4A2.6 2.6 0 0 0 3 8.2 27 27 0 0 0 2.6 12 27 27 0 0 0 3 15.8a2.6 2.6 0 0 0 1.8 1.8c1.5.4 7.2.4 7.2.4s5.7 0 7.2-.4a2.6 2.6 0 0 0 1.8-1.8 27 27 0 0 0 .4-3.8 27 27 0 0 0-.4-3.8Z" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" /></svg>;
    case "linkedin":
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6M8 8v.1M11.5 16v-3.2a2 2 0 0 1 4 0V16M11.5 10v6" /></svg>;
    case "facebook":
      return <svg {...common}><path d="M14 20v-7h2.4l.4-2.8H14V8.4c0-.8.3-1.4 1.5-1.4h1.6V4.5c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.2H9.2V13H11v7" /></svg>;
    case "x":
      return <svg {...common}><path d="M5 4.5 19 19.5M19 4.5 5 19.5" /></svg>;
    case "aparat":
      return <svg {...common}><path d="M12 4a8 8 0 1 0 8 8" /><path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" /><path d="M17.5 5.5 19 4M6.5 18.5 5 20" /></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M9 12h6M12 9v6" /></svg>;
  }
}
