"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { BrandCircle } from "@/components/Brand";
import { money } from "@/lib/types";
import { newEventId, trackBrowser } from "@/lib/tracking/queue";

type Download = { sku: string; name: string; url: string };

type Order = {
  public_id: string;
  email: string;
  total: number;
  paid?: boolean;
  status?: string;
  downloads?: Download[];
  items: { sku?: string; name: string; unit_price: number; is_upsell: boolean }[];
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function fileHref(url: string) {
  if (url.startsWith("http")) return url;
  return `${API}${url}`;
}

export function ThankYouClient() {
  const t = useTranslations("thanks");
  const sp = useSearchParams();
  const id = sp.get("order");
  const sessionId = sp.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    if (!id) {
      setMissing(true);
      return;
    }
    let stop = false;
    const load = async () => {
      try {
        if (sessionId) {
          const confirm = await api(`/orders/${id}/confirm`, {
            method: "POST",
            body: JSON.stringify({ session_id: sessionId }),
          });
          if (confirm.ok) {
            const paid = (await confirm.json()) as Order;
            if (!stop) setOrder(paid);
            if (paid.paid) {
              if (!tracked.current) {
                tracked.current = true;
                trackBrowser(
                  "Purchase",
                  {
                    value: paid.total || 0,
                    currency: "USD",
                    contents: (paid.items || []).map((i) => ({ id: i.sku, quantity: 1, item_price: i.unit_price })),
                  },
                  newEventId(),
                );
              }
              return true;
            }
          }
        }
        const res = await api(`/orders/${id}`);
        if (!res.ok) throw new Error("order");
        const data = (await res.json()) as Order;
        if (!stop) setOrder(data);
        if (data.paid && !tracked.current) {
          tracked.current = true;
          trackBrowser(
            "Purchase",
            {
              value: data.total || 0,
              currency: "USD",
              contents: (data.items || []).map((i) => ({ id: i.sku, quantity: 1, item_price: i.unit_price })),
            },
            newEventId(),
          );
        }
        return Boolean(data.paid);
      } catch {
        if (!stop) setMissing(true);
        return true;
      }
    };
    void load();
    const iv = setInterval(() => {
      void load().then((done) => {
        if (done) clearInterval(iv);
      });
    }, 2500);
    const to = setTimeout(() => clearInterval(iv), 45000);
    return () => {
      stop = true;
      clearInterval(iv);
      clearTimeout(to);
    };
  }, [id, sessionId]);

  if (missing) {
    return (
      <div className="py-24 text-center">
        <p>{t("missing")}</p>
        <Link href="/contact" className="mt-4 inline-block text-gold">
          hello@digi-world.online
        </Link>
      </div>
    );
  }
  if (!order) return <div className="py-24 text-center text-stone">…</div>;
  const files = order.paid ? order.downloads || [] : [];
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <div className="mx-auto mb-6 flex justify-center">
        <BrandCircle size={72} />
      </div>
      <h1 className="font-display text-5xl">{order.paid ? t("h1") : t("waiting")}</h1>
      <p className="mt-4 text-ivory/80">{order.paid ? t("sub", { email: order.email }) : t("waitingSub")}</p>
      <p className="mt-6 text-sm text-gold">
        {t("order")} {order.public_id} · {money(Math.round((order.total || 0) * 100))}
      </p>
      <ul className="mt-6 space-y-2 text-sm text-ivory/70">
        {order.items?.map((i) => (
          <li key={i.name}>
            {i.name} {i.is_upsell ? "· upsell" : ""} — {money(Math.round(i.unit_price * 100))}
          </li>
        ))}
      </ul>
      {order.paid ? (
        <ol className="mt-10 space-y-3 text-start text-ivory/80">
          <li>1. {t("s1")}</li>
          <li>2. {t("s2")}</li>
          <li>3. {t("s3")}</li>
        </ol>
      ) : (
        <p className="mt-8 text-sm text-stone">{t("unpaid")}</p>
      )}
      <div className="mt-10 flex flex-col items-center gap-3">
        {files.map((file) => (
          <a key={file.sku} href={fileHref(file.url)} className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
            {t("download")}
          </a>
        ))}
        <Link href="/collections" className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6">
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
