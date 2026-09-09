const DAYS = 90;

function setCookie(name: string, value: string) {
  const max = DAYS * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${max};SameSite=Lax`;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  ttclid?: string;
  ttp?: string;
  sc_click_id?: string;
  sc_cookie1?: string;
  landing_page?: string;
  referrer?: string;
  consent?: boolean;
};

export function captureClickIds() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const fbclid = url.searchParams.get("fbclid");
  const ttclid = url.searchParams.get("ttclid");
  const sccid = url.searchParams.get("ScCid") || url.searchParams.get("sccid");
  if (fbclid) {
    setCookie("fbclid", fbclid);
    if (!getCookie("_fbc")) setCookie("_fbc", `fb.1.${Date.now()}.${fbclid}`);
  }
  if (ttclid) setCookie("ttclid", ttclid);
  if (sccid) setCookie("sc_click_id", sccid);
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const v = url.searchParams.get(k);
    if (v) utm[k] = v;
  }
  if (Object.keys(utm).length) {
    const prev = readAttrib();
    setCookie("dw_attrib", JSON.stringify({ ...prev, ...utm, landing_page: prev.landing_page || window.location.href }));
  } else if (!getCookie("dw_attrib")) {
    setCookie("dw_attrib", JSON.stringify({ landing_page: window.location.href, referrer: document.referrer }));
  }
}

export function readAttrib(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(getCookie("dw_attrib") || "{}") as Attribution;
  } catch {
    stored = {};
  }
  return {
    ...stored,
    fbclid: getCookie("fbclid") || stored.fbclid,
    fbp: getCookie("_fbp") || stored.fbp,
    fbc: getCookie("_fbc") || stored.fbc,
    ttclid: getCookie("ttclid") || stored.ttclid,
    ttp: getCookie("_ttp") || stored.ttp,
    sc_click_id: getCookie("sc_click_id") || stored.sc_click_id,
    sc_cookie1: getCookie("_scid") || stored.sc_cookie1,
    landing_page: stored.landing_page || window.location.href,
    referrer: stored.referrer || document.referrer,
    consent: getCookie("dw_consent") === "1",
  };
}

export function setConsent(ok: boolean) {
  setCookie("dw_consent", ok ? "1" : "0");
}

export function hasConsent() {
  return getCookie("dw_consent") === "1";
}
