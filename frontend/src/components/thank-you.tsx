"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { BrandCircle } from "@/components/Brand";
import { money } from "@/lib/types";

const VAULT_FILES: Record<string, string> = {
  "DW-SYS-009": "/vault/DW-SYS-009-smb-ai-governance-kit.zip",
  "DW-SYS-010": "/vault/DW-SYS-010-photographer-os.zip",
};

type Order = {
  public_id: string;
  email: string;
  total: number;
  items: { sku?: string; name: string; unit_price: number; is_upsell: boolean }[];
};

export function ThankYouClient() {
  const t = useTranslations("thanks");
  const sp = useSearchParams();
  const id = sp.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id) {
      try {
        const raw = sessionStorage.getItem("dw_order");
        if (raw) setOrder(JSON.parse(raw));
        else setMissing(true);
      } catch {
        setMissing(true);
      }
      return;
    }
    api(`/orders/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setOrder)
      .catch(() => setMissing(true));
  }, [id]);

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
  const files = [
    ...new Set(
      (order.items || [])
        .map((item) => (item.sku ? VAULT_FILES[item.sku] : undefined))
        .filter((href): href is string => Boolean(href)),
    ),
  ];
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <div className="mx-auto mb-6 flex justify-center">
        <BrandCircle size={72} />
      </div>
      <h1 className="font-display text-5xl">{t("h1")}</h1>
      <p className="mt-4 text-ivory/80">{t("sub", { email: order.email })}</p>
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
      <ol className="mt-10 space-y-3 text-start text-ivory/80">
        <li>1. {t("s1")}</li>
        <li>2. {t("s2")}</li>
        <li>3. {t("s3")}</li>
      </ol>
      <div className="mt-10 flex flex-col items-center gap-3">
        {files.map((href) => (
          <a key={href} href={href} download className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink">
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
