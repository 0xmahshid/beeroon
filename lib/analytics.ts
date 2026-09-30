const LS_SESSION_ID = "beeroon:anonymous_session_id";

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export function newUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function newSearchId(): string {
  return newUuid();
}

export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = localStorage.getItem(LS_SESSION_ID);
    if (existing && UUID_RE.test(existing)) return existing;
  } catch {
    /* storage unavailable */
  }
  const fresh = newSearchId();
  try {
    localStorage.setItem(LS_SESSION_ID, fresh);
  } catch {
    /* storage unavailable */
  }
  return fresh;
}

export type TrackArgs = {
  eventName:
    | "search"
    | "search_no_results"
    | "view_business"
    | "click_call"
    | "click_whatsapp"
    | "click_directions"
    | "click_website"
    | "profile_view"
    | "call"
    | "directions"
    | "whatsapp";
  businessId?: string;
  searchId?: string;
  query?: string;
  city?: string;
  neighborhood?: string;
  metadata?: Record<string, unknown>;
};

export async function track(payload: TrackArgs): Promise<void> {
  const sessionId = getAnonymousSessionId();
  const body: Record<string, unknown> = {
    eventName: payload.eventName,
    anonymous_session_id: sessionId,
  };
  if (payload.businessId) body.businessId = payload.businessId;
  if (payload.searchId) body.search_id = payload.searchId;
  if (payload.query) body.query = payload.query;
  if (payload.city) body.city = payload.city;
  if (payload.neighborhood) body.neighborhood = payload.neighborhood;
  if (payload.metadata && Object.keys(payload.metadata).length) body.metadata = payload.metadata;
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: typeof navigator !== "undefined",
    }).catch(() => undefined);
  } catch {
    /* swallow */
  }
}
