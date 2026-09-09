"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/api";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [ok, setOk] = useState(false);
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const res = await api("/contact", {
          method: "POST",
          body: JSON.stringify({
            name: fd.get("name"),
            email: fd.get("email"),
            message: fd.get("message"),
            locale,
          }),
        });
        if (res.ok) setOk(true);
      }}
    >
      <input name="name" required placeholder={t("name")} className="h-12 w-full rounded-xl border border-line bg-ivory/10 px-3" />
      <input name="email" type="email" required dir="ltr" placeholder={t("email")} className="h-12 w-full rounded-xl border border-line bg-ivory/10 px-3" />
      <textarea name="message" required rows={5} placeholder={t("message")} className="w-full rounded-xl border border-line bg-ivory/10 p-3" />
      <button className="h-12 rounded-full bg-gold px-6 text-ink">{t("cta")}</button>
      {ok ? <p className="text-proof">{t("ok")}</p> : null}
    </form>
  );
}
