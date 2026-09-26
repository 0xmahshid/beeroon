import type { ReactNode, SVGProps } from "react";

type Props = { slug: string; className?: string };
type IconProps = SVGProps<SVGSVGElement>;

function Base({ className, children }: { className?: string; children: ReactNode }) {
  const props: IconProps = { viewBox: "0 0 64 64", className, fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  return <svg {...props}>{children}</svg>;
}

export default function CategoryIcon({ slug, className = "h-9 w-9" }: Props) {
  switch (slug) {
    case "food": return <Base className={className}><path d="M20 35h24l-2.3 9.8A5 5 0 0 1 36.8 49H27a5 5 0 0 1-4.9-4.2L20 35Z" fill="currentColor" fillOpacity=".13" /><path d="M18 35h28M22 51h20M26 25c-3-4 3-6 0-10M33 25c-3-4 3-6 0-10M40 25c-3-4 3-6 0-10" /><path d="M16 35c1.5-5 6-7.5 10-7.5h12c4 0 8.5 2.5 10 7.5" /></Base>;
    case "shopping": return <Base className={className}><path d="M16 24h32l-3 28H19l-3-28Z" fill="currentColor" fillOpacity=".12" /><path d="M23 25v-4a9 9 0 0 1 18 0v4M16 24h32l-3 28H19l-3-28Z" /><path d="m33 31 1.5 3.1 3.5.5-2.5 2.5.6 3.5-3.1-1.6-3.1 1.6.6-3.5-2.5-2.5 3.5-.5L33 31Z" fill="currentColor" stroke="none" /></Base>;
    case "fashion": return <Base className={className}><path d="m25 14 8 5 8-5 10 8-6 8-4-3v23H23V27l-4 3-6-8 10-8Z" fill="currentColor" fillOpacity=".12" /><path d="m25 14 8 5 8-5 10 8-6 8-4-3v23H23V27l-4 3-6-8 10-8ZM29 17c0 4 8 4 8 0" /></Base>;
    case "beauty": return <Base className={className}><path d="M27 17h10v30H27z" fill="currentColor" fillOpacity=".12" /><path d="M27 17h10v30H27zM27 22h10M27 42h10M25 14h14" /><path d="m45 27 1.3 2.8 2.7.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.7-.4L45 27Z" fill="currentColor" stroke="none" /></Base>;
    case "health": return <Base className={className}><path d="M32 51S14 40 14 27c0-6 4-10 9-10 4 0 7 3 9 6 2-3 5-6 9-6 5 0 9 4 9 10 0 13-18 24-18 24Z" fill="currentColor" fillOpacity=".12" /><path d="M32 51S14 40 14 27c0-6 4-10 9-10 4 0 7 3 9 6 2-3 5-6 9-6 5 0 9 4 9 10 0 13-18 24-18 24Z" /><path d="M32 25v12M26 31h12" /></Base>;
    case "education": return <Base className={className}><path d="m12 24 20-9 20 9-20 9-20-9Z" fill="currentColor" fillOpacity=".13" /><path d="m12 24 20-9 20 9-20 9-20-9ZM20 29v10c7 5 17 5 24 0V29M52 26v12" /><circle cx="52" cy="41" r="2" fill="currentColor" stroke="none" /><path d="m41 20 7-5 5 7" /></Base>;
    case "home": return <Base className={className}><path d="m12 30 20-17 20 17v20H12V30Z" fill="currentColor" fillOpacity=".12" /><path d="m12 30 20-17 20 17M17 27v23h30V27M27 50V37h10v13M23 29h5" /><path d="M44 17v7" /></Base>;
    case "automotive": return <Base className={className}><path d="m17 38 5-14h20l5 14v10H17V38Z" fill="currentColor" fillOpacity=".12" /><path d="m17 38 5-14h20l5 14v10H17V38ZM14 38h36M22 24l3-7h14l3 7M22 44h.1M42 44h.1" /><path d="M25 34h14" /></Base>;
    case "travel": return <Base className={className}><path d="m13 37 17-6-7-16 4-2 12 15 12-4 3 3-11 8 2 11-4 2-6-9-15 5-7-3Z" fill="currentColor" fillOpacity=".14" /><path d="m13 37 17-6-7-16 4-2 12 15 12-4 3 3-11 8 2 11-4 2-6-9-15 5-7-3Z" /></Base>;
    case "sport": return <Base className={className}><circle cx="32" cy="33" r="17" fill="currentColor" fillOpacity=".12" /><circle cx="32" cy="33" r="17" /><path d="m32 16 5 9-5 8-10-1-7-7M37 25l10 2M32 33l6 10-2 7M32 33l-10-1-5 8" /><path d="M14 19h8M11 25h7" /></Base>;
    case "culture": return <Base className={className}><path d="M17 42c-5 0-8-3-8-8 0-9 9-18 20-18 10 0 18 6 18 15 0 7-5 11-11 11H31c-2 0-3 1-3 3 0 3-3 5-6 5" fill="currentColor" fillOpacity=".12" /><path d="M17 42c-5 0-8-3-8-8 0-9 9-18 20-18 10 0 18 6 18 15 0 7-5 11-11 11H31c-2 0-3 1-3 3 0 3-3 5-6 5M22 27h.1M32 23h.1M42 28h.1M39 37h.1" /></Base>;
    case "technical": return <Base className={className}><path d="m39 15 5 5-7 7-5-5 7-7Z" fill="currentColor" fillOpacity=".13" /><path d="m39 15 5 5-7 7-5-5 7-7ZM32 22 14 40a5 5 0 0 0 7 7l18-18M18 43l3 3M14 49l-3 3M44 41l8 8M47 37l5-5" /></Base>;
    case "business": return <Base className={className}><rect x="13" y="22" width="38" height="27" rx="4" fill="currentColor" fillOpacity=".12" /><path d="M24 22v-4h16v4M13 31h38M32 29v5M27 49h10M42 13l7 7-7 7M49 20H35" /></Base>;
    case "technology": return <Base className={className}><rect x="12" y="15" width="40" height="28" rx="4" fill="currentColor" fillOpacity=".12" /><path d="M12 43h40M24 51h16M29 43l-2 8M35 43l2 8M22 25l5 5-5 5M31 35h10" /></Base>;
    case "finance": return <Base className={className}><path d="M14 24h36v25H14z" fill="currentColor" fillOpacity=".12" /><path d="M14 24h36v25H14zM14 30h36M39 39h.1M45 39h.1M20 19h29l-5 5H14v-1a4 4 0 0 1 4-4h2Z" /><circle cx="32" cy="40" r="5" /></Base>;
    case "legal": return <Base className={className}><path d="M32 14v35M21 50h22M17 21h30M32 18 20 24M32 18l12 6M12 25l8-2 5 10H15l-3-8ZM39 33h10l-5-10-8 2 3 8Z" fill="currentColor" fillOpacity=".1" /><path d="M32 14v35M21 50h22M17 21h30M32 18 20 24M32 18l12 6M12 25l8-2 5 10H15l-3-8ZM39 33h10l-5-10-8 2 3 8Z" /></Base>;
    case "real-estate": return <Base className={className}><path d="m12 29 20-16 20 16v22H12V29Z" fill="currentColor" fillOpacity=".12" /><path d="m12 29 20-16 20 16M18 27v24h28V27M25 51V35h14v16M29 39h6" /></Base>;
    case "events": return <Base className={className}><path d="M20 52V25M20 25c8-7 15 6 23-1v20c-8 7-15-6-23 1" fill="currentColor" fillOpacity=".14" /><path d="M20 52V25M20 25c8-7 15 6 23-1v20c-8 7-15-6-23 1M14 16h.1M24 11h.1M45 15h.1M51 25h.1" /></Base>;
    case "family": return <Base className={className}><circle cx="24" cy="23" r="7" fill="currentColor" fillOpacity=".12" /><circle cx="42" cy="26" r="5" fill="currentColor" fillOpacity=".12" /><path d="M12 49c0-8 5-13 12-13s12 5 12 13M37 38c7-2 13 2 14 9" /><path d="m32 49-2.2-2.1c-5-4.6-1.2-10.5 2.2-7 3.4-3.5 7.2 2.4 2.2 7L32 49Z" fill="currentColor" stroke="none" /></Base>;
    case "pets": return <Base className={className}><path d="M32 50c-4-5-15-7-15-16 0-5 3-8 7-8 4 0 6 3 8 5 2-2 4-5 8-5 4 0 7 3 7 8 0 9-11 11-15 16Z" fill="currentColor" fillOpacity=".13" /><circle cx="20" cy="20" r="4" fill="currentColor" fillOpacity=".18" /><circle cx="30" cy="16" r="4" fill="currentColor" fillOpacity=".18" /><circle cx="40" cy="16" r="4" fill="currentColor" fillOpacity=".18" /><circle cx="49" cy="22" r="4" fill="currentColor" fillOpacity=".18" /></Base>;
    case "agriculture": return <Base className={className}><path d="M32 51V28M32 37c-9 0-15-5-16-14 9-1 15 4 16 14ZM32 30c1-9 7-14 16-14-1 9-7 14-16 14Z" fill="currentColor" fillOpacity=".13" /><path d="M32 51V28M32 37c-9 0-15-5-16-14 9-1 15 4 16 14ZM32 30c1-9 7-14 16-14-1 9-7 14-16 14Z" /></Base>;
    case "industry": return <Base className={className}><path d="M12 51V27l13 7V25l14 8V18h13v33H12Z" fill="currentColor" fillOpacity=".12" /><path d="M12 51V27l13 7V25l14 8V18h13v33H12ZM20 42h.1M29 42h.1M39 42h.1M47 42h.1" /></Base>;
    case "media": return <Base className={className}><path d="M14 17h36v32H14z" fill="currentColor" fillOpacity=".12" /><path d="M14 17h36v32H14zM21 25h22M21 32h22M21 39h13" /><path d="m17 13 5 4" /></Base>;
    case "cleaning": return <Base className={className}><path d="m27 23 13 5-8 22a3 3 0 0 1-4 2l-4-2a3 3 0 0 1-2-4l8-22Z" fill="currentColor" fillOpacity=".12" /><path d="m27 23 13 5-8 22a3 3 0 0 1-4 2l-4-2a3 3 0 0 1-2-4l8-22ZM29 17l5-4 8 3-3 5M43 11h.1M50 18h.1M47 28h.1" /></Base>;
    default: return <Base className={className}><path d="m32 12 4.5 14.5L51 32l-14.5 5.5L32 52l-4.5-14.5L13 32l14.5-5.5L32 12Z" fill="currentColor" fillOpacity=".14" /><path d="m32 12 4.5 14.5L51 32l-14.5 5.5L32 52l-4.5-14.5L13 32l14.5-5.5L32 12Z" /></Base>;
  }
}
