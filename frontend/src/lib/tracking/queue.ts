export function newEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `dw_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type Queued = {
  platform: "meta" | "tiktok" | "snap";
  event: string;
  params: Record<string, unknown>;
  eventID: string;
};

declare global {
  interface Window {
    dwq: Queued[];
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void; identify: (o: object) => void; load: (id: string) => void };
    snaptr?: (...args: unknown[]) => void;
    dwPixelsReady?: { meta?: boolean; tiktok?: boolean; snap?: boolean };
  }
}

export function enqueue(item: Queued) {
  if (typeof window === "undefined") return;
  window.dwq = window.dwq || [];
  window.dwq.push(item);
  flush();
}

export function flush() {
  if (typeof window === "undefined") return;
  const q = window.dwq || [];
  const rest: Queued[] = [];
  for (const item of q) {
    const ok = flushOne(item);
    if (!ok) rest.push(item);
  }
  window.dwq = rest;
}

function flushOne(item: Queued): boolean {
  try {
    if (item.platform === "meta") {
      if (!window.fbq) return false;
      window.fbq("track", item.event, item.params, { eventID: item.eventID });
      return true;
    }
    if (item.platform === "tiktok") {
      if (!window.ttq?.track) return false;
      window.ttq.track(item.event, item.params, { event_id: item.eventID });
      return true;
    }
    if (item.platform === "snap") {
      if (!window.snaptr) return false;
      window.snaptr("track", item.event, { ...item.params, client_dedup_id: item.eventID });
      return true;
    }
  } catch {
    return false;
  }
  return true;
}

const TIKTOK: Record<string, string> = {
  PageView: "Pageview",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Lead: "SubmitForm",
  Purchase: "CompletePayment",
};
const SNAP: Record<string, string> = {
  PageView: "PAGE_VIEW",
  ViewContent: "VIEW_CONTENT",
  AddToCart: "ADD_CART",
  InitiateCheckout: "START_CHECKOUT",
  Lead: "SIGN_UP",
  Purchase: "PURCHASE",
};

export function trackBrowser(
  event: string,
  params: Record<string, unknown>,
  eventID: string,
) {
  enqueue({ platform: "meta", event, params, eventID });
  enqueue({ platform: "tiktok", event: TIKTOK[event] || event, params, eventID });
  enqueue({ platform: "snap", event: SNAP[event] || event, params, eventID });
}

export async function trackServer(body: Record<string, unknown>) {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    await fetch(`${api}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}
