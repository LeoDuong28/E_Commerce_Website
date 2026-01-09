'use client';

import type { Product, User } from '@/types/models';
import { productsDummyData, userDummyData } from '@/assets/assets';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItems = Record<string, number>;

export type AppContextValue = {
  currency: string;
  router: AppRouterInstance;

  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;

  userData: User | null;
  fetchUserData: () => Promise<void>;

  products: Product[];
  fetchProductData: () => Promise<void>;

  cartItems: CartItems;
  setCartItems: React.Dispatch<React.SetStateAction<CartItems>>;

  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;

  getCartCount: () => number;
  getCartAmount: () => number;
};

export const AppContext = createContext<AppContextValue | null>(null);

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
};

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY ?? '$';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItems>({});

  const fetchProductData = async () => {
    setProducts(productsDummyData);
  };

  const fetchUserData = async () => {
    setUserData(userDummyData);
    setCartItems(userDummyData.cartItems ?? {});
  };

  const addToCart = async (itemId: string) => {
    const cartData = structuredClone(cartItems) as CartItems;

    if (cartData[itemId]) cartData[itemId] += 1;
    else cartData[itemId] = 1;

    setCartItems(cartData);
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    const cartData = structuredClone(cartItems) as CartItems;

    if (quantity === 0) delete cartData[itemId];
    else cartData[itemId] = quantity;

    setCartItems(cartData);
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

  useEffect(() => {
    void fetchProductData();
  }, []);

  useEffect(() => {
    void fetchUserData();
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      currency,
      router,

      isSeller,
      setIsSeller,

      userData,
      fetchUserData,

      products,
      fetchProductData,

      cartItems,
      setCartItems,

      addToCart,
      updateCartQuantity,

      getCartCount,
      getCartAmount,
    }),
    [currency, router, isSeller, userData, products, cartItems]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
