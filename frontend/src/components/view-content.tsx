"use client";

import { useEffect } from "react";
import { readAttrib } from "@/lib/tracking/clickids";
import { newEventId, trackBrowser, trackServer } from "@/lib/tracking/queue";

export function ViewContentPing({ sku, value }: { sku: string; value: number }) {
  useEffect(() => {
    const eventID = newEventId();
    const params = { content_ids: [sku], value, currency: "USD", contents: [{ id: sku, quantity: 1, item_price: value }] };
    trackBrowser("ViewContent", params, eventID);
    void trackServer({ event_name: "ViewContent", event_id: eventID, event_source_url: window.location.href, ...params, ...readAttrib() });
  }, [sku, value]);
  return null;
}
