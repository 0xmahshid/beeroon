"use client";

import Link from "next/link";
import { Business } from "@/lib/types";
import { getBusinessImageUrl } from "@/lib/business-images";
import { mergeSocialLinks, SOCIAL_NETWORKS, socialUrl } from "@/lib/social";
import SocialIcon from "@/components/SocialIcon";
import { computeOpenStatus, formatOpenStatus } from "@/lib/business-hours";
import { getAnonymousSessionId, type TrackArgs } from "@/lib/analytics";

const priceLabel = { 1: "اقتصادی", 2: "متوسط", 3: "ویژه" } as const;

function PinIcon({ className = "h-3.5 w-3.5 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2C9.5 22 2 14.5 2 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function WhatsappIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.693.627.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function DirectionsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
      <circle cx="12" cy="10" r="3" />
      <path d="m12 3 2 3" />
      <path d="m8 6 4-3" />
    </svg>
  );
}

function openStatusColor(kind: string): string {
  switch (kind) {
    case "open_24":
    case "open_until":
      return "bg-[#e6f8ee] text-[#1a7d4c] ring-1 ring-[#c6ecdb]";
    case "closed_today":
    case "closed_opening_at":
      return "bg-[#ffecef] text-[#b11240] ring-1 ring-[#f5d0d8]";
    case "no_hours":
    default:
      return "bg-[#f2eaed] text-[#7e6b74] ring-1 ring-[#e6d9df]";
  }
}

function openStatusDot(kind: string): string {
  switch (kind) {
    case "open_24":
    case "open_until":
      return "bg-[#22c55e]";
    case "closed_today":
    case "closed_opening_at":
      return "bg-[#ef4444]";
    case "no_hours":
    default:
      return "bg-[#94a3b8]";
  }
}

function localTrack(args: Omit<TrackArgs, "eventName"> & Pick<TrackArgs, "eventName">): void {
  const sessionId = getAnonymousSessionId();
  const body: Record<string, unknown> = {
    eventName: args.eventName,
    anonymous_session_id: sessionId,
  };
  if (args.businessId) body.businessId = args.businessId;
  if (args.searchId) body.search_id = args.searchId;
  if (args.query) body.query = args.query;
  if (args.city) body.city = args.city;
  if (args.neighborhood) body.neighborhood = args.neighborhood;
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => undefined);
}

export default function BusinessCard({
  b,
  categoryName,
  searchId,
  query,
  city,
  neighborhood,
}: {
  b: Business;
  categoryName?: string;
  searchId?: string;
  query?: string;
  city?: string;
  neighborhood?: string;
}) {
  const effSearchId = searchId || "";
  function track(eventName: TrackArgs["eventName"]) {
    localTrack({
      eventName,
      businessId: b.id,
      searchId: effSearchId || undefined,
      query,
      city,
      neighborhood,
    });
  }
  const mapUrl = b.neshan
    ? b.neshan.startsWith("http")
      ? b.neshan
      : "https://neshan.org/maps/search/" + encodeURIComponent(b.neshan)
    : b.lat != null && b.lng != null
      ? "https://neshan.org/maps/@" + b.lat + "," + b.lng + ",16z"
      : null;
  const initials = b.name.trim().slice(0, 1) || "ب";
  const imageUrl = getBusinessImageUrl(b.image_url, b.social_links);
  const socialLinks = mergeSocialLinks(b.social_links, b);
  const openStatus = computeOpenStatus(b.hours);
  const waRaw = socialLinks.whatsapp || b.phone ? socialLinks.whatsapp || b.phone : undefined;
  const waUrl = waRaw
    ? "https://wa.me/" + String(waRaw).replace(/[^0-9]/g, "")
    : null;
  const hasAnyContact = Boolean(b.phone || waUrl || mapUrl);
  const visibleSocials = SOCIAL_NETWORKS.filter((network) => socialLinks[network.key] && network.key !== "whatsapp").slice(0, 3);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-[#eadfe3] bg-white shadow-[0_10px_30px_-26px_rgba(58,20,45,.55)] transition duration-200 hover:-translate-y-1 hover:border-[#e6a8b6] hover:shadow-[0_30px_50px_-30px_rgba(213,31,79,.35)]">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-[#f1dfe3] bg-[linear-gradient(135deg,#3f1a37_0%,#d51f4f_50%,#f4a261_100%)]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={"عکس " + b.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-5xl font-black text-white/80" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.18), transparent 55%), radial-gradient(circle at 80% 100%, rgba(255,210,150,.35), transparent 50%)" }}>
            {initials}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#32162d]/60 via-transparent to-black/10" />
        <div className="absolute right-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {b.is_supporter && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff]/90 px-2.5 py-1 text-[9px] font-black text-[#d51f4f] shadow-[0_4px_12px_-4px_rgba(213,31,79,.4)] backdrop-blur">
              ⭐ حامی
            </span>
          )}
          {b.business_type === "online_shop" ? (
            <span className="rounded-full bg-[#eaf4ff]/95 px-2.5 py-1 text-[9px] font-black text-[#185fa7] shadow-[0_4px_12px_-4px_rgba(24,95,167,.35)] backdrop-blur">
              🛒 آنلاین‌شاپ
            </span>
          ) : (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black text-[#3e4c6e] shadow-[0_4px_12px_-4px_rgba(62,76,110,.35)] backdrop-blur">
              🏪 خرید حضوری
            </span>
          )}
          {b.is_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f4ff]/95 px-2.5 py-1 text-[9px] font-black text-[#185fa7] shadow-[0_4px_12px_-4px_rgba(24,95,167,.35)] backdrop-blur">
              ✓ تأییدشده
            </span>
          )}
        </div>
        {b.distanceKm != null && (
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-black text-[#d51f4f] shadow-[0_4px_12px_-4px_rgba(213,31,79,.35)] backdrop-blur">
            📍 {b.distanceKm.toLocaleString("fa-IR")} کیلومتر
          </div>
        )}
        <div className="absolute bottom-[-18px] right-4 z-10 grid h-16 w-16 place-items-center rounded-[20px] border-4 border-white bg-[#d51f4f] text-[26px] font-black text-white shadow-[0_14px_28px_-14px_rgba(213,31,79,.6)]">
          {initials}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-black text-[#32162d]">
              <Link href={"/business/" + b.id} className="hover:text-[#d51f4f]">
                {b.name}
              </Link>
            </h3>
            <p className="mt-1 truncate text-[11px] text-[#93828a]">
              {categoryName || "کسب‌وکار محلی"}
            </p>
            {b.matchReason && (
              <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#fff0f3] px-2.5 py-1 text-[10px] font-black text-[#c04870]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d51f4f]" />
                {b.matchReason}
              </p>
            )}
          </div>
          {b.price_tier && (
            <span
              className="beeroon-pill shrink-0 bg-[#fff5d9] text-[#9c761e] ring-1 ring-[#f2e3b7]"
              title={priceLabel[b.price_tier]}
            >
              {priceLabel[b.price_tier]}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10.5px]">
          <span
            className={
              "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-bold " +
              openStatusColor(openStatus.kind)
            }
          >
            <span className={"h-1.5 w-1.5 rounded-full " + openStatusDot(openStatus.kind)} />
            {formatOpenStatus(openStatus)}
          </span>
          {b.address && (
            <span className="inline-flex max-w-full items-center gap-1 truncate rounded-xl bg-[#f9f6f7] px-2.5 py-1.5 text-[#81717a] ring-1 ring-[#eee2e7]">
              <PinIcon className="h-3 w-3 shrink-0 text-[#c91442]" />
              <span className="truncate">{b.address}</span>
            </span>
          )}
          {b.hours && openStatus.kind !== "no_hours" && (
            <span className="inline-flex items-center gap-1 rounded-xl bg-[#fbfbfc] px-2.5 py-1.5 text-[#9a8a91] ring-1 ring-[#eee2e7]">
              ⏰ {b.hours}
            </span>
          )}
        </div>

        {(visibleSocials.length > 0 || waUrl) && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[#f3e8eb] pt-3">
            {waUrl && (
              <a
                onClick={() => track("whatsapp")}
                href={waUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 rounded-xl bg-[#e6f8ee] px-2.5 py-1.5 text-[10px] font-black text-[#1a7d4c] ring-1 ring-[#c6ecdb] transition hover:bg-[#d2f2e0]"
                style={{ minHeight: "32px" }}
                title="پیام واتساپ"
              >
                <WhatsappIcon className="h-3.5 w-3.5" />
                واتساپ
              </a>
            )}
            {visibleSocials.map((network) => (
              <a
                key={network.key}
                href={socialUrl(network.key, socialLinks[network.key]!)}
                target="_blank"
                rel="noreferrer"
                title={network.label}
                aria-label={network.label}
                className="inline-flex items-center gap-1 rounded-xl bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#6b5c65] ring-1 ring-[#eadfe3] transition hover:bg-[#fff5f7] hover:ring-[#e6b9c7]"
                style={{ minHeight: "32px" }}
              >
                <SocialIcon network={network.key} className="h-3.5 w-3.5" style={{ color: network.color }} />
                {network.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap items-center gap-2">
            {b.phone ? (
              <a
                onClick={() => track("call")}
                href={"tel:" + b.phone}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#d51f4f] px-3 py-3 text-[11.5px] font-black text-white shadow-[0_10px_22px_-12px_rgba(213,31,79,.7)] transition hover:bg-[#b91640]"
              >
                <PhoneIcon className="h-4 w-4" />
                تماس
              </a>
            ) : (
              hasAnyContact ? null : <div className="flex-1" />
            )}
            {waUrl && !b.phone ? (
              <a
                onClick={() => track("whatsapp")}
                href={waUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1fae5a] px-3 py-3 text-[11.5px] font-black text-white shadow-[0_10px_22px_-12px_rgba(31,174,90,.6)] transition hover:bg-[#17954b]"
              >
                <WhatsappIcon className="h-4 w-4" />
                پیام واتساپ
              </a>
            ) : null}
            {mapUrl && (
              <a
                onClick={() => track("directions")}
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#eadfe3] bg-white px-3 py-3 text-[11.5px] font-black text-[#6d5c65] transition hover:border-[#d51f4f] hover:text-[#d51f4f]"
              >
                <DirectionsIcon className="h-4 w-4" />
                مسیریابی
              </a>
            )}
            <Link
              onClick={() => track("profile_view")}
              href={"/business/" + b.id}
              className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#32162d] px-4 py-3 text-[11.5px] font-black text-white transition hover:bg-[#4c2042]"
            >
              جزئیات →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
