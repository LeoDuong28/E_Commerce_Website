"use client";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Loading from "@/components/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";
import { FiCreditCard } from "react-icons/fi";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openingBilling, setOpeningBilling] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-lg font-medium">My Orders</h2>
            <button
              onClick={async () => {
                setOpeningBilling(true);
                try {
                  const token = await getToken();
                  const { data } = await axios.post(
                    "/api/user/billing",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  if (data.success && data.url) {
                    window.location.href = data.url;
                  } else {
                    toast.error(data.message || "No saved payment methods yet");
                  }
                } catch {
                  toast.error("No saved payment methods yet");
                } finally {
                  setOpeningBilling(false);
                }
              }}
              disabled={openingBilling}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiCreditCard className="w-4 h-4" />
              {openingBilling ? "Opening..." : "Manage Payment Methods"}
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No orders yet</p>
              <p className="text-sm mt-1">Your orders will appear here once you make a purchase.</p>
            </div>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
                  <div className="flex-1 flex gap-5 max-w-80">
                    <Image
                      className="max-w-16 max-h-16 object-cover"
                      src={assets.box_icon}
                      alt="box_icon"
                    />
                    <p className="flex flex-col gap-3">
                      <span className="font-medium text-base">
                        {order.items
                          .map(
                            (item) => item.product.name + ` x ${item.quantity}`
                          )
                          .join(", ")}
                      </span>
                      <span>Items : {order.items.length}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">
                        {order.address.fullname}
                      </span>
                      <br />
                      <span>{order.address.area}</span>
                      <br />
                      <span>{`${order.address.city}, ${order.address.state}`}</span>
                      <br />
                      <span>{order.address.phoneNumber}</span>
                    </p>
                  </div>
                  <p className="font-medium my-auto">
                    {currency}
                    {order.amount}
                  </p>
                  <div>
                    <p className="flex flex-col">
                      <span>Method : {order.paymentMethod || "Stripe"}</span>
                      <span>
                        Date : {new Date(order.date).toLocaleDateString()}
                      </span>
                      <span>
                        Payment :{" "}
                        <span className={order.isPaid ? "text-green-600" : "text-yellow-600"}>
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </span>
                      <span>
                        Status :{" "}
                        <span className="text-[#1877f2]">{order.status}</span>
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
