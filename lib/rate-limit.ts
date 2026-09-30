type RateEntry = { count: number; firstTs: number };

const stores = new Map<string, Map<string, RateEntry>>();

function getStore(key: string): Map<string, RateEntry> {
  let store = stores.get(key);
  if (!store) {
    store = new Map();
    stores.set(key, store);
  }
  return store;
}

export function checkRateLimit(
  namespace: string,
  identity: string,
  windowMs: number,
  maxPerWindow: number,
): { ok: boolean; remaining: number; resetMs: number } {
  if (!identity) return { ok: true, remaining: maxPerWindow, resetMs: windowMs };
  const store = getStore(namespace);
  const now = Date.now();
  const entry = store.get(identity);
  if (!entry || now - entry.firstTs > windowMs) {
    const fresh: RateEntry = { count: 1, firstTs: now };
    store.set(identity, fresh);
    return { ok: true, remaining: Math.max(0, maxPerWindow - 1), resetMs: windowMs };
  }
  if (entry.count >= maxPerWindow) {
    return {
      ok: false,
      remaining: 0,
      resetMs: Math.max(0, windowMs - (now - entry.firstTs)),
    };
  }
  entry.count += 1;
  return {
    ok: true,
    remaining: Math.max(0, maxPerWindow - entry.count),
    resetMs: Math.max(0, windowMs - (now - entry.firstTs)),
  };
}

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}
