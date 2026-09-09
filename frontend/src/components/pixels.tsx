"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { captureClickIds, hasConsent, setConsent } from "@/lib/tracking/clickids";
import { flush, newEventId, trackBrowser, trackServer } from "@/lib/tracking/queue";
import { useTranslations } from "next-intl";

const META = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
const TT = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";
const SNAP = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID || "";

export function PixelBoot({ forceInteractive }: { forceInteractive?: boolean }) {
  const [consent, setOk] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    captureClickIds();
    setOk(hasConsent());
  }, []);
  useEffect(() => {
    if (!consent) return;
    const id = newEventId();
    trackBrowser("PageView", {}, id);
    void trackServer({ event_name: "PageView", event_id: id, event_source_url: window.location.href });
  }, [pathname, consent]);

  const strategy = forceInteractive ? "afterInteractive" : "lazyOnload";

  return (
    <>
      <CookieBanner onChoice={() => setOk(hasConsent())} />
      {consent && META ? (
        <Script id="meta-pixel" strategy={strategy} onLoad={() => flush()}>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META}');`}
        </Script>
      ) : null}
      {consent && TT ? (
        <Script id="tt-pixel" strategy={strategy} src="https://analytics.tiktok.com/i18n/pixel/events.js" onLoad={() => {
          window.ttq?.load(TT);
          window.ttq?.page();
          flush();
        }} />
      ) : null}
      {consent && SNAP ? (
        <Script id="snap-pixel" strategy={strategy} onLoad={() => flush()}>
          {`(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${SNAP}');`}
        </Script>
      ) : null}
    </>
  );
}

function CookieBanner({ onChoice }: { onChoice: () => void }) {
  const t = useTranslations("cookie");
  const [show, setShow] = useState(false);
  useEffect(() => {
    const c = document.cookie.match(/(?:^|; )dw_consent=([^;]*)/);
    if (!c) setShow(true);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 top-16 z-30 border-b border-line bg-ink-2 p-4">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-ivory/80">{t("body")}</p>
        <div className="flex gap-2">
          <button
            className="h-10 rounded-full bg-gold px-4 text-sm text-ink"
            onClick={() => {
              setConsent(true);
              setShow(false);
              onChoice();
            }}
          >
            {t("accept")}
          </button>
          <button
            className="h-10 rounded-full border border-line px-4 text-sm"
            onClick={() => {
              setConsent(false);
              setShow(false);
              onChoice();
            }}
          >
            {t("reject")}
          </button>
        </div>
      </div>
    </div>
  );
}
