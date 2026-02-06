"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState({});
  const [isDemoSeller, setIsDemoSeller] = useState(false);

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user.publicMetadata.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      let { data } = await axios.get("/api/user/data", { headers });

      if (!data.success) {
        const res = await axios.post("/api/user/data", {}, { headers });
        data = res.data;
      }

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems);
        setWishlistItems(data.user.wishlistItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToCart = async (itemId) => {
    const prevCart = structuredClone(cartItems);
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();

        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Item added to cart");
      } catch (error) {
        setCartItems(prevCart);
        toast.error(error.message);
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const prevCart = structuredClone(cartItems);
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);
    if (user) {
      try {
        const token = await getToken();

        await axios.post(
          "/api/cart/update",
          { cartData },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success("Cart Updated");
      } catch (error) {
        setCartItems(prevCart);
        toast.error(error.message);
      }
    }
  };

  const toggleWishlist = async (itemId) => {
    let wishlistData = structuredClone(wishlistItems);
    if (wishlistData[itemId]) {
      delete wishlistData[itemId];
    } else {
      wishlistData[itemId] = true;
    }
    setWishlistItems(wishlistData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/wishlist/update",
          { wishlistData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getWishlistCount = () => {
    return Object.keys(wishlistItems).length;
  };

  const enterDemoMode = () => {
    setIsDemoSeller(true);
    setIsSeller(true);
    sessionStorage.setItem("isDemoSeller", "true");
  };

  const exitDemoMode = () => {
    setIsDemoSeller(false);
    sessionStorage.removeItem("isDemoSeller");
    if (!user || user.publicMetadata?.role !== "seller") {
      setIsSeller(false);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
    const demo = sessionStorage.getItem("isDemoSeller");
    if (demo === "true") {
      setIsDemoSeller(true);
      setIsSeller(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setIsSeller(isDemoSeller);
      setUserData(false);
      setCartItems({});
      setWishlistItems({});
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    getToken,
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
    wishlistItems,
    setWishlistItems,
    toggleWishlist,
    getWishlistCount,
    isDemoSeller,
    enterDemoMode,
    exitDemoMode,
  }), [user, currency, router, isSeller, userData, products, cartItems, wishlistItems, isDemoSeller]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
