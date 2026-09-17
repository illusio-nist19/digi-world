"use client";

import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  checkoutOpen: boolean;
  upsellOpen: boolean;
  orderSentOpen: boolean;
  orderSentEmail: string;
  mobileNav: boolean;
  setCartOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  setUpsellOpen: (v: boolean) => void;
  setOrderSent: (open: boolean, email?: string) => void;
  setMobileNav: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  checkoutOpen: false,
  upsellOpen: false,
  orderSentOpen: false,
  orderSentEmail: "",
  mobileNav: false,
  setCartOpen: (v) => set({ cartOpen: v, mobileNav: false }),
  setCheckoutOpen: (v) => set({ checkoutOpen: v, cartOpen: false }),
  setUpsellOpen: (v) => set({ upsellOpen: v, checkoutOpen: false }),
  setOrderSent: (open, email) =>
    set({
      orderSentOpen: open,
      orderSentEmail: email ?? "",
      checkoutOpen: false,
      cartOpen: false,
      upsellOpen: false,
    }),
  setMobileNav: (v) => set({ mobileNav: v }),
}));
