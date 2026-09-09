"use client";

import { create } from "zustand";

type UIState = {
  cartOpen: boolean;
  checkoutOpen: boolean;
  upsellOpen: boolean;
  mobileNav: boolean;
  setCartOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  setUpsellOpen: (v: boolean) => void;
  setMobileNav: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  checkoutOpen: false,
  upsellOpen: false,
  mobileNav: false,
  setCartOpen: (v) => set({ cartOpen: v, mobileNav: false }),
  setCheckoutOpen: (v) => set({ checkoutOpen: v, cartOpen: false }),
  setUpsellOpen: (v) => set({ upsellOpen: v, checkoutOpen: false }),
  setMobileNav: (v) => set({ mobileNav: v }),
}));
