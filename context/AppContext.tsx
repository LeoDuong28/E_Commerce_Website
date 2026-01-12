"use client";

import type { Product, User } from "@/types/models";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { productsDummyData } from "@/assets/assets";

export type CartItems = Record<string, number>;

type AppContextValue = {
  currency: string;
  router: AppRouterInstance;

  // auth-aware data
  userData: User | null;
  isSeller: boolean;

  products: Product[];

  cartItems: CartItems;
  setCartItems: React.Dispatch<React.SetStateAction<CartItems>>;

  addToCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;

  getCartCount: () => number;
  getCartAmount: () => number;
};

export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
};

const cartKey = (userId: string) => `cart:${userId}`;

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "$";

  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItems>({});

  const userData: User | null = useMemo(() => {
    if (!user) return null;

    const primaryEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const name = user.fullName ?? user.username ?? "User";

    return {
      _id: user.id,
      name,
      email: primaryEmail,
      imageUrl: user.imageUrl,
      cartItems: cartItems,
    };
  }, [user, cartItems]);

  const isSeller = useMemo(() => {
    const role = user?.publicMetadata?.role;
    return role === "seller";
  }, [user]);

  // Products (still using dummy data for now)
  useEffect(() => {
    setProducts(productsDummyData);
  }, []);

  // Cart persistence per signed-in user
  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      setCartItems({});
      return;
    }

    try {
      const saved = localStorage.getItem(cartKey(user.id));
      setCartItems(saved ? (JSON.parse(saved) as CartItems) : {});
    } catch {
      setCartItems({});
    }
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    try {
      localStorage.setItem(cartKey(user.id), JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems, isSignedIn, user?.id]);

  const addToCart = (itemId: string) => {
    setCartItems((prev) => {
      const next = { ...prev };
      next[itemId] = (next[itemId] ?? 0) + 1;
      return next;
    });
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[itemId];
      else next[itemId] = quantity;
      return next;
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const id in cartItems) {
      const qty = cartItems[id] ?? 0;
      if (qty > 0) totalCount += qty;
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;

    for (const id in cartItems) {
      const qty = cartItems[id] ?? 0;
      if (qty <= 0) continue;

      const item = products.find((p) => p._id === id);
      if (!item) continue;

      totalAmount += item.offerPrice * qty;
    }

    return Math.floor(totalAmount * 100) / 100;
  };

  const value = useMemo(
    () => ({
      currency,
      router,

      userData,
      isSeller,

      products,

      cartItems,
      setCartItems,

      addToCart,
      updateCartQuantity,

      getCartCount,
      getCartAmount,
    }),
    [currency, router, userData, isSeller, products, cartItems]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
