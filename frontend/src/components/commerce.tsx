"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { priceOffer, type CartLine, type OfferId } from "@/lib/offers";
import { readAttrib } from "@/lib/tracking/clickids";
import { newEventId, trackBrowser, trackServer } from "@/lib/tracking/queue";
import { loc, money, type Catalog, type Product, duoCents, isPremium } from "@/lib/types";
import { cartTotal, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export function OfferTiles({
  product,
  pair,
  value,
  onChange,
}: {
  product: Product;
  pair?: Product | null;
  value: OfferId;
  onChange: (v: OfferId) => void;
}) {
  const t = useTranslations("product");
  const photo = product.slug === "photographer-os";
  const keys = product.slug === "key-fob-programming-mastery";
  const crm = product.slug === "client-tracker";
  const premium = isPremium(product);
  if (product.type === "addon") return null;
  if (product.type === "vault") {
    return (
      <div className="grid gap-3">
        <Tile active={value === "vault"} onClick={() => onChange("vault")} title={t("solo")} sub={money(product.price_cents)} price={product.price_cents} compare={product.compare_cents} />
        <Tile active={value === "vault_duo"} onClick={() => onChange("vault_duo")} title={t("duo")} sub={t("duoSub")} price={product.duo_price_cents || 14900} compare={19400} />
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      <Tile active={value === "solo"} onClick={() => onChange("solo")} title={keys ? t("techSolo") : photo || crm ? t("studioSolo") : premium ? t("orgSolo") : t("solo")} sub={keys ? t("techSoloSub") : photo || crm ? t("studioSoloSub") : premium ? t("orgSoloSub") : t("soloSub")} price={product.price_cents} />
      <Tile active={value === "duo"} onClick={() => onChange("duo")} title={keys ? t("techDuo") : photo || crm ? t("studioDuo") : premium ? t("orgDuo") : t("duo")} sub={keys ? t("techDuoSub") : photo || crm ? t("studioDuoSub") : premium ? t("orgDuoSub") : t("duoSub")} price={duoCents(product)} compare={keys || photo || crm || premium ? product.price_cents * 2 : 3800} badge={t("chosen")} />
      {pair && !premium && !keys && !photo && !crm ? <Tile active={value === "pair"} onClick={() => onChange("pair")} title={t("pair")} sub={t("pairSub")} price={product.pair_price_cents || 3400} compare={3800} badge={t("pairBadge")} /> : null}
    </div>
  );
}

function Tile({ active, onClick, title, sub, price, compare, badge }: { active: boolean; onClick: () => void; title: string; sub: string; price: number; compare?: number | null; badge?: string }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-start ${active ? "border-gold bg-gold/10" : "border-line bg-ink-3"}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          {badge ? <p className="text-[10px] uppercase tracking-widest text-gold">{badge}</p> : null}
          <p className="font-display text-lg">{title}</p>
          <p className="text-sm text-stone">{sub}</p>
        </div>
        <div className="text-end">
          {compare ? <p className="text-xs text-stone line-through">{money(compare)}</p> : null}
          <p className="font-display text-2xl text-gold">{money(price)}</p>
        </div>
      </div>
    </button>
  );
}

export function AddToVaultButton({ product, catalog, offerId }: { product: Product; catalog: Catalog; offerId: OfferId }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const addLines = useCart((s) => s.addLines);
  const { setCartOpen } = useUI();
  const pair = catalog.products.find((p) => p.slug === product.pair_sku || p.sku === product.pair_sku);
  return (
    <button
      className="inline-flex h-12 w-full items-center justify-center rounded-full bg-gold px-6 font-medium text-ink hover:bg-gold-2 active:scale-[0.98]"
      onClick={() => {
        const priced = priceOffer(product, offerId, pair);
        const lines: CartLine[] = priced.lines.map((l, i) => {
          const src = catalog.products.find((p) => p.sku === l.sku)!;
          return {
            ...l,
            key: `${l.sku}-${l.offerId}-${i}`,
            name: loc(src.name, locale),
            image: src.images[0] || "/images/og-default.png",
          };
        });
        addLines(lines);
        const eventID = newEventId();
        const params = { value: priced.cents / 100, currency: "USD", contents: lines.map((l) => ({ id: l.sku, quantity: l.qty, item_price: l.unitPriceCents / 100 })) };
        trackBrowser("AddToCart", params, eventID);
        void trackServer({ event_name: "AddToCart", event_id: eventID, event_source_url: window.location.href, ...params, ...readAttrib() });
        setCartOpen(true);
      }}
    >
      {t("add")}
    </button>
  );
}

export function CommerceLayer({ catalog }: { catalog: Catalog }) {
  return (
    <>
      <CartDrawer catalog={catalog} />
      <CheckoutModal catalog={catalog} />
      <UpsellOverlay catalog={catalog} />
      <OrderSentCard />
    </>
  );
}

function CartDrawer({ catalog }: { catalog: Catalog }) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { cartOpen, setCartOpen, setCheckoutOpen } = useUI();
  const { lines, remove, addLines } = useCart();
  const total = cartTotal(lines);
  const hasVault = lines.some((l) => l.offerId === "vault" || l.offerId === "vault_duo");
  const first = catalog.products.find((p) => p.sku === lines[0]?.sku);
  const crosses = useMemo(() => {
    if (hasVault || !first) return [];
    const owned = new Set(lines.map((l) => l.sku));
    return (first.cross_sell || [])
      .map((slug) => catalog.products.find((p) => p.slug === slug || p.sku === slug))
      .filter((p): p is Product => !!p && !owned.has(p.sku))
      .slice(0, 3);
  }, [catalog.products, first, hasVault, lines]);

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal>
      <button className="absolute inset-0 bg-black/60" aria-label="Close" onClick={() => setCartOpen(false)} />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-ink-2 shadow-[0_24px_80px_rgba(61,50,42,.14)]">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl">{t("title")}</h2>
          <button onClick={() => setCartOpen(false)} className="text-stone">✕</button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {lines.length === 0 ? <p className="text-stone">{t("empty")}</p> : null}
          {lines.map((l) => (
            <div key={l.key} className="flex gap-3">
              <div className="relative h-20 w-16 overflow-hidden rounded-xl">
                <Image src={l.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{l.name}</p>
                <p className="text-sm text-gold">{money(l.unitPriceCents)}</p>
                <button className="text-xs text-stone" onClick={() => remove(l.key)}>{t("remove")}</button>
              </div>
            </div>
          ))}
          {hasVault ? <p className="text-sm text-gold">{t("holding")}</p> : null}
          {crosses.length > 0 ? (
            <div>
              <p className="mb-3 text-xs uppercase tracking-widest text-gold">{t("complete")}</p>
              <div className="space-y-3">
                {crosses.map((p) => (
                  <button
                    key={p.sku}
                    className="flex w-full items-center gap-3 rounded-2xl border border-line p-3 text-start"
                    onClick={() => {
                      const priced = priceOffer(p, p.type === "addon" ? "addon" : "solo");
                      addLines(
                        priced.lines.map((l, i) => ({
                          ...l,
                          key: `${l.sku}-xs-${i}-${Date.now()}`,
                          name: loc(p.name, locale),
                          image: p.images[0],
                          isCrossSell: true,
                        })),
                      );
                      const eventID = newEventId();
                      trackBrowser("AddToCart", { value: priced.cents / 100, currency: "USD", contents: [{ id: p.sku, quantity: 1 }] }, eventID);
                      void trackServer({ event_name: "AddToCart", event_id: eventID, event_source_url: window.location.href, value: priced.cents / 100, currency: "USD", contents: [{ id: p.sku, quantity: 1 }], ...readAttrib() });
                    }}
                  >
                    <div className="relative h-14 w-12 overflow-hidden rounded-lg">
                      <Image src={p.images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{loc(p.name, locale)}</p>
                      <p className="text-sm text-gold">{money(p.price_cents)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="border-t border-line p-5">
          <div className="mb-4 flex justify-between font-display text-xl">
            <span>{t("subtotal")}</span>
            <span className="text-gold">{money(total)}</span>
          </div>
          <button
            disabled={!lines.length}
            className="h-12 w-full rounded-full bg-gold font-medium text-ink disabled:opacity-40"
            onClick={() => {
              const eventID = newEventId();
              trackBrowser("InitiateCheckout", { value: total / 100, currency: "USD" }, eventID);
              void trackServer({ event_name: "InitiateCheckout", event_id: eventID, event_source_url: window.location.href, value: total / 100, currency: "USD", ...readAttrib() });
              setCheckoutOpen(true);
            }}
          >
            {t("cta")}
          </button>
        </div>
      </aside>
    </div>
  );
}

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
});

function CheckoutModal({ catalog: _catalog }: { catalog: Catalog }) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { checkoutOpen, setCheckoutOpen, setOrderSent } = useUI();
  const { lines, clear, setLastOrder } = useCart();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const total = cartTotal(lines);
  if (!checkoutOpen) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dw-pay-title">
      <button className="absolute inset-0 bg-black/70" aria-label="Close" onClick={() => setCheckoutOpen(false)} />
      <form
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-ink-3 p-6 shadow-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          const fd = new FormData(e.currentTarget);
          const parsed = schema.safeParse({ name: fd.get("name"), email: fd.get("email") });
          if (!parsed.success) {
            setErr(t("error"));
            return;
          }
          setBusy(true);
          const purchaseId = newEventId();
          const leadId = newEventId();
          const grouped = new Map<string, CartLine[]>();
          for (const l of lines) {
            const k = `${l.sku}:${l.offerId}`;
            grouped.set(k, [...(grouped.get(k) || []), l]);
          }
          const items = [...grouped.values()].map((g) => ({ sku: g[0].sku, offer_id: g[0].offerId, qty: 1 }));
          try {
            const attrib = readAttrib();
            const res = await api("/orders", {
              method: "POST",
              body: JSON.stringify({
                client_order_id: newEventId(),
                name: parsed.data.name,
                email: parsed.data.email,
                locale,
                items,
                currency: "USD",
                attribution: attrib,
                event_id: purchaseId,
                event_id_lead: leadId,
                event_source_url: window.location.href,
                user_agent: navigator.userAgent,
              }),
            });
            const data = await res.json().catch(() => ({} as Record<string, unknown>));
            if (!res.ok || !data.public_id) {
              const detail = typeof data.detail === "string" ? data.detail : "";
              setErr(res.status === 503 ? t("notReady") : detail || t("error"));
              return;
            }
            const contents = lines.map((l) => ({ id: l.sku, quantity: l.qty, item_price: l.unitPriceCents / 100 }));
            trackBrowser("Lead", { value: 0, currency: "USD", contents }, leadId);
            trackBrowser("Purchase", { value: total / 100, currency: "USD", contents }, purchaseId);
            setLastOrder(String(data.public_id), parsed.data.email);
            sessionStorage.setItem("dw_order", JSON.stringify(data));
            clear();
            setCheckoutOpen(false);

            if (data.checkout_url) {
              window.location.href = data.checkout_url as string;
              return;
            }

            setOrderSent(true, parsed.data.email, Boolean(data.email_sent));
          } catch {
            setErr(t("error"));
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{t("secure")}</p>
        <h2 id="dw-pay-title" className="mt-2 font-display text-3xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-stone">{t("sub")}</p>
        <div className="my-5 space-y-2 rounded-2xl border border-line bg-ink-2 p-4 text-sm">
          {lines.map((l) => (
            <div key={l.key} className="flex justify-between gap-3">
              <span>{l.name}</span>
              <span className="text-gold">{money(l.unitPriceCents)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-2 font-display text-lg">
            <span>{t("total")}</span>
            <span className="text-gold">{money(total)}</span>
          </div>
        </div>
        <label className="mb-3 block text-sm text-stone">
          {t("name")}
          <input name="name" required minLength={2} autoComplete="name" className="mt-1 h-12 w-full rounded-xl border border-line bg-ivory/10 px-3 text-ivory" />
        </label>
        <label className="mb-4 block text-sm text-stone">
          {t("email")}
          <input name="email" type="email" required dir="ltr" autoComplete="email" className="mt-1 h-12 w-full rounded-xl border border-line bg-ivory/10 px-3 text-ivory" />
        </label>
        <div className="mb-4 rounded-2xl border border-gold/30 bg-gold/5 p-4">
          <p className="text-sm font-medium">{t("payTitle")}</p>
          <p className="mt-1 text-xs text-stone">{t("paySub")}</p>
          <p className="mt-3 text-[11px] tracking-wide text-ivory/70">{t("cards")}</p>
        </div>
        {err ? <p className="mb-3 text-sm text-danger">{err}</p> : null}
        <button disabled={busy} className="h-12 w-full rounded-full bg-gold font-medium text-ink disabled:opacity-40">
          {busy ? t("opening") : t("cta", { price: money(total) })}
        </button>
        <p className="mt-3 text-center text-xs text-stone">{t("lock")}</p>
      </form>
    </div>
  );
}

function OrderSentCard() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { orderSentOpen, orderSentEmail, orderEmailSent, setOrderSent } = useUI();
  const lastOrderId = useCart((s) => s.lastOrderId);
  if (!orderSentOpen) return null;

  function close() {
    setOrderSent(false);
    if (lastOrderId) router.push(`/thank-you?order=${lastOrderId}`);
    else router.push("/thank-you");
  }

  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="dw-sent-title">
      <button className="absolute inset-0 bg-black/75" aria-label="Close" onClick={close} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold/40 bg-ink-3 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-3xl text-gold">✓</div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold">{t("sentEyebrow")}</p>
        <h2 id="dw-sent-title" className="mt-2 font-display text-3xl text-ivory">
          {orderEmailSent ? t("sentTitle") : t("readyTitle")}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ivory/80">
          {orderEmailSent
            ? t("sentBody", { email: orderSentEmail || "your inbox" })
            : t("readyBody", { email: orderSentEmail || "your inbox" })}
        </p>
        <p className="mt-3 text-sm text-stone">{t("sentWish")}</p>
        <button type="button" onClick={close} className="mt-7 h-12 w-full rounded-full bg-gold font-medium text-ink">
          {t("sentCta")}
        </button>
        <p className="mt-3 text-xs text-stone">{orderEmailSent ? t("sentSpam") : t("readyHint")}</p>
      </div>
    </div>
  );
}

function UpsellOverlay({ catalog }: { catalog: Catalog }) {
  const t = useTranslations("upsell");
  const locale = useLocale();
  const router = useRouter();
  const { upsellOpen, setUpsellOpen } = useUI();
  const lastOrderId = useCart((s) => s.lastOrderId);
  const [left, setLeft] = useState(12);
  const [payload, setPayload] = useState<{ sku: string; slug: string; name: Record<string, string>; image?: string; price_cents: number; compare_cents?: number } | null>(null);

  useEffect(() => {
    if (!upsellOpen) return;
    try {
      const raw = sessionStorage.getItem("dw_upsell");
      setPayload(raw ? JSON.parse(raw) : null);
    } catch {
      setPayload(null);
    }
    setLeft(12);
    const iv = setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          clearInterval(iv);
          setUpsellOpen(false);
          const id = useCart.getState().lastOrderId;
          if (id) router.push(`/thank-you?order=${id}`);
          else router.push("/thank-you");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [upsellOpen, router, setUpsellOpen]);

  function goThanks() {
    setUpsellOpen(false);
    if (lastOrderId) router.push(`/thank-you?order=${lastOrderId}`);
    else router.push("/thank-you");
  }

  if (!upsellOpen) return null;
  const product = payload ? catalog.products.find((p) => p.sku === payload.sku || p.slug === payload.slug) : catalog.products.find((p) => p.slug === "launch-sprint");
  const price = payload?.price_cents || 900;
  const title = payload ? loc(payload.name, locale) : product ? loc(product.name, locale) : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-5" role="dialog">
      <div className="w-full max-w-lg text-center">
        <p className="font-display text-5xl text-gold">{left}s</p>
        <h2 className="mt-4 font-display text-3xl">{t("title")}</h2>
        <div className="relative mx-auto my-6 aspect-[4/5] max-w-xs overflow-hidden rounded-2xl">
          <Image src={payload?.image || product?.images[0] || "/images/og-default.png"} alt="" fill className="object-cover" />
        </div>
        <p className="text-ivory/80">{t("body", { product: title, price: money(price) })}</p>
        <button
          className="mt-6 h-12 w-full max-w-sm rounded-full bg-gold font-medium text-ink"
          onClick={async () => {
            if (!lastOrderId || !product) return goThanks();
            const eventID = newEventId();
            await api(`/orders/${lastOrderId}/upsell`, {
              method: "POST",
              body: JSON.stringify({ sku: product.sku, event_id: eventID, event_source_url: window.location.href }),
            });
            trackBrowser("Purchase", { value: price / 100, currency: "USD", contents: [{ id: product.sku, quantity: 1, item_price: price / 100 }] }, eventID);
            goThanks();
          }}
        >
          {t("cta", { price: money(price) })}
        </button>
        <button className="mt-4 text-sm text-stone" onClick={goThanks}>
          {t("skip")}
        </button>
      </div>
    </div>
  );
}

export function PdpOffers({ product, catalog }: { product: Product; catalog: Catalog }) {
  const [offer, setOffer] = useState<OfferId>(product.type === "addon" ? "addon" : product.type === "vault" ? "vault" : isPremium(product) ? "solo" : "duo");
  const pair = catalog.products.find((p) => p.slug === product.pair_sku || p.sku === product.pair_sku);
  const remaining = Math.max(product.license_pool - product.licenses_issued, 0);
  const t = useTranslations("product");
  return (
    <div className="space-y-4">
      <OfferTiles product={product} pair={pair} value={offer} onChange={setOffer} />
      {remaining < 80 ? <p className="text-sm text-danger">{t("remaining", { n: remaining })}</p> : null}
      <AddToVaultButton product={product} catalog={catalog} offerId={offer} />
      <p className="text-xs text-stone">{t("usd")}</p>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink/95 p-3 md:hidden">
        <AddToVaultButton product={product} catalog={catalog} offerId={offer} />
      </div>
    </div>
  );
}
