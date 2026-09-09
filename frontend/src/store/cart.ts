"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/offers";

type CartState = {
  lines: CartLine[];
  lastOrderId: string | null;
  lastEmail: string | null;
  addLines: (lines: CartLine[]) => void;
  remove: (key: string) => void;
  clear: () => void;
  setLastOrder: (id: string, email: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastOrderId: null,
      lastEmail: null,
      addLines: (incoming) =>
        set((s) => {
          const next = [...s.lines];
          for (const line of incoming) {
            const i = next.findIndex((l) => l.sku === line.sku && l.offerId === line.offerId);
            if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + line.qty };
            else next.push(line);
          }
          return { lines: next };
        }),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      setLastOrder: (id, email) => set({ lastOrderId: id, lastEmail: email }),
    }),
    { name: "dw_cart" },
  ),
);

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.unitPriceCents * l.qty, 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
