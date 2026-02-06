"use client";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const OrderPlacedContent = () => {
  const { router, getToken, setCartItems } = useAppContext();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let redirectTimer;
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        router.push("/cart");
        return;
      }

      try {
        const token = await getToken();
        const { data } = await axios.post(
          "/api/order/verify",
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          setCartItems({});
          setVerifying(false);
          redirectTimer = setTimeout(() => router.push("/my-orders"), 3000);
        } else {
          setError(true);
          setVerifying(false);
        }
      } catch {
        setError(true);
        setVerifying(false);
      }
    };

    verifyPayment();
    return () => clearTimeout(redirectTimer);
  }, []);

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-5">
        <div className="text-center text-xl font-semibold text-red-500">
          Payment verification failed
        </div>
        <button
          onClick={() => router.push("/cart")}
          className="px-6 py-2 bg-[#1877f2] text-white rounded-lg"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex justify-center items-center relative">
        {verifying ? (
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-blue-400 border-gray-200" />
        ) : (
          <>
            <Image className="absolute p-5" src={assets.checkmark} alt="" />
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-green-300 border-gray-200" />
          </>
        )}
      </div>
      <div className="text-center text-2xl font-semibold">
        {verifying ? "Verifying Payment..." : "Order Placed Successfully"}
      </div>
      {!verifying && (
        <p className="text-gray-500">Redirecting to your orders...</p>
      )}
    </div>
  );
};

const OrderPlaced = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex flex-col justify-center items-center gap-5">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-blue-400 border-gray-200" />
          <div className="text-center text-2xl font-semibold">Loading...</div>
        </div>
      }
    >
      <OrderPlacedContent />
    </Suspense>
  );
};

export default OrderPlaced;
