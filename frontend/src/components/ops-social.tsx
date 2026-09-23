"use client";

import { useEffect, useState } from "react";
import { API } from "@/lib/types";

type Platform = "facebook" | "instagram" | "tiktok";

type Last = {
  status: string;
  remote_id?: string | null;
  error?: string | null;
  at?: string | null;
} | null;

type Row = {
  sku: string;
  slug: string;
  name: string;
  image: string;
  url: string;
  caption: string;
  last: Record<Platform, Last>;
};

const PLATFORMS: Platform[] = ["facebook", "instagram", "tiktok"];
const TOKEN_KEY = "dw_admin_token";
const TT_STATE_KEY = "dw_tt_state";

type TikTokInfo = { login?: boolean; connected?: boolean; username?: string | null; scope?: string | null };

export function OpsSocial() {
  const [token, setToken] = useState("");
  const [auto, setAuto] = useState(false);
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Row[]>([]);
  const [picked, setPicked] = useState<Record<Platform, boolean>>({
    facebook: false,
    instagram: false,
    tiktok: true,
  });
  const [force, setForce] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [tiktok, setTiktok] = useState<TikTokInfo>({});

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY) || "";
    if (saved) setToken(saved);
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (saved && code) {
      void exchangeCode(saved, code);
      return;
    }
    if (saved) void load(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(nextToken = token) {
    setError("");
    setNote("");
    const res = await fetch(`${API}/admin/social`, {
      headers: { Authorization: `Bearer ${nextToken}` },
    });
    if (res.status === 401) {
      setError("Wrong admin token.");
      return;
    }
    if (res.status === 503) {
      setError("Set ADMIN_TOKEN on the API, then try again.");
      return;
    }
    if (!res.ok) {
      setError(`Could not load (${res.status}).`);
      return;
    }
    const data = await res.json();
    sessionStorage.setItem(TOKEN_KEY, nextToken);
    setAuto(Boolean(data.auto));
    setPlatforms(data.platforms || {});
    setTiktok(data.tiktok || {});
    setProducts(data.products || []);
    const ready = data.platforms || {};
    setPicked({
      facebook: Boolean(ready.facebook),
      instagram: Boolean(ready.instagram),
      tiktok: Boolean(data.tiktok?.connected || ready.tiktok),
    });
    setNote("Signed in. Connect TikTok, then Publish a product.");
  }

  async function exchangeCode(nextToken: string, code: string) {
    setError("");
    setNote("Finishing TikTok Login Kit…");
    const res = await fetch(`${API}/admin/social/tiktok/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${nextToken}`,
      },
      body: JSON.stringify({ code, state: sessionStorage.getItem(TT_STATE_KEY) }),
    });
    window.history.replaceState({}, "", window.location.pathname);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "TikTok login failed.");
      await load(nextToken);
      return;
    }
    setNote(`TikTok connected${data.username ? ` as @${data.username}` : ""}. Scope: ${data.scope || "video.publish"}`);
    await load(nextToken);
  }

  async function connectTikTok() {
    setError("");
    const res = await fetch(`${API}/admin/social/tiktok/login`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "TikTok Login Kit is not configured on the API.");
      return;
    }
    sessionStorage.setItem(TT_STATE_KEY, data.state);
    window.location.href = data.url;
  }

  async function publish(sku: string) {
    const selected = PLATFORMS.filter((p) => picked[p]);
    if (!selected.length) {
      setError("Pick at least one platform.");
      return;
    }
    setBusy(sku);
    setError("");
    setNote("");
    try {
      const res = await fetch(`${API}/admin/social/announce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sku, platforms: selected, force }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || `Publish failed (${res.status}).`);
        return;
      }
      const parts = Object.entries(data.results || {}).map(([p, v]) => {
        const row = v as { status?: string; error?: string; note?: string; mode?: string };
        const extra = row.error || row.note || (row.mode === "MEDIA_UPLOAD" ? "inbox draft — open TikTok app" : "");
        return `${p}: ${row.status}${extra ? ` (${extra})` : ""}`;
      });
      const failed = Object.values(data.results || {}).some((v) => (v as { status?: string }).status === "failed");
      const msg = `${sku} — ${parts.join(" · ")}`;
      if (failed) setError(msg);
      else setNote(msg);
      await load();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-8">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
      >
        <label className="block min-w-[240px] flex-1">
          <span className="mb-1 block text-sm text-stone">ADMIN_TOKEN</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="h-12 w-full rounded-xl border border-line bg-ivory/10 px-3"
            autoComplete="off"
          />
        </label>
        <button type="submit" className="h-12 rounded-full bg-gold px-6 text-ink">
          Open desk
        </button>
      </form>

      {error ? <p className="text-danger">{error}</p> : null}
      {note ? <p className="text-proof">{note}</p> : null}

      {products.length ? (
        <>
          <div className="rounded-2xl border border-line bg-ink/30 p-5 text-sm">
            <p>
              Auto on new SKU: <strong>{auto ? "on" : "off"}</strong>
            </p>
            <p className="mt-2 text-stone">
              Facebook {platforms.facebook ? "ready" : "needs Page token"} · Instagram{" "}
              {platforms.instagram ? "ready" : "needs IG user id"}
            </p>
            <p className="mt-3 text-stone">
              TikTok posts go to an <strong className="text-ivory">inbox draft</strong> until the app is audited —
              open the TikTok app notification to finish. Direct Post only works if the account is{" "}
              <strong className="text-ivory">Private</strong>. Also verify{" "}
              <code className="text-ivory">digi-world.online</code> under TikTok Developer → URL properties.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="text-ivory">
                TikTok Login Kit:{" "}
                <strong>
                  {tiktok.connected
                    ? `connected${tiktok.username ? ` @${tiktok.username}` : ""}`
                    : "not connected"}
                </strong>
                {tiktok.scope ? <span className="text-stone"> · {tiktok.scope}</span> : null}
              </p>
              {tiktok.login ? (
                <button type="button" onClick={connectTikTok} className="h-10 rounded-full border border-line px-4">
                  {tiktok.connected ? "Reconnect TikTok" : "Connect TikTok"}
                </button>
              ) : (
                <span className="text-stone">Set TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET on the API.</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              {PLATFORMS.map((p) => (
                <label key={p} className="inline-flex items-center gap-2 capitalize">
                  <input
                    type="checkbox"
                    checked={picked[p]}
                    onChange={(e) => setPicked((cur) => ({ ...cur, [p]: e.target.checked }))}
                  />
                  {p}
                </label>
              ))}
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} />
                Post again even if already sent
              </label>
            </div>
          </div>

          <ul className="space-y-4">
            {products.map((p) => (
              <li key={p.sku} className="rounded-2xl border border-line bg-ink/20 p-4 md:flex md:items-center md:gap-5">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-xl bg-line" />
                )}
                <div className="mt-3 min-w-0 flex-1 md:mt-0">
                  <p className="font-display text-xl">{p.name}</p>
                  <p className="text-sm text-stone">
                    {p.sku} · {p.slug}
                  </p>
                  <p className="mt-2 text-sm text-ivory/80">
                    {PLATFORMS.map((plat) => {
                      const last = p.last[plat];
                      return `${plat}: ${last?.status || "—"}`;
                    }).join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy === p.sku}
                  onClick={() => publish(p.sku)}
                  className="mt-3 h-11 rounded-full bg-gold px-5 text-ink disabled:opacity-60 md:mt-0"
                >
                  {busy === p.sku ? "Publishing…" : "Publish"}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
