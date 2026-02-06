"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ORDER_STATUSES } from "@/lib/constants";

const statusColors = {
  "Order Placed": "bg-blue-100 text-blue-700",
  "Packing": "bg-yellow-100 text-yellow-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
};

const statusOptions = ORDER_STATUSES.map((s) => ({
  ...s,
  color: statusColors[s.value] || "bg-gray-100 text-gray-700",
}));

const Orders = () => {
  const { currency, getToken, user, isDemoSeller } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);

    try {
      const token = await getToken();

      const { data } = await axios.put(
        "/api/order/update-status",
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success("Order status updated");
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    } else if (isDemoSeller) {
      setLoading(false);
    }
  }, [user, isDemoSeller]);

  const getStatusStyle = (status) => {
    const option = statusOptions.find((s) => s.value === status);
    return option?.color || "bg-gray-100 text-gray-700";
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(
      (o) => o.status === "Order Placed" || o.status === "Packing",
    ).length,
    shipped: orders.filter((o) => o.status === "Out for Delivery").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50/50 overflow-auto">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
            <p className="text-gray-500 mt-1">
              Manage and track your customer orders
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {orderStats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orderStats.pending}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">
                {orderStats.shipped}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {orderStats.delivered}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#1877f2] focus:ring-2 focus:ring-[#1877f2]/20 outline-none bg-white">
              <option value="all">All Orders</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                No orders found
              </h3>
              <p className="text-gray-500">
                {filterStatus !== "all"
                  ? "Try selecting a different filter"
                  : "Orders will appear here when customers make purchases"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono text-sm font-medium">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="hidden sm:block h-8 w-px bg-gray-200" />
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-sm">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(order.status || "Order Placed")}`}>
                        {order.status || "Order Placed"}
                      </span>
                      <select
                        value={order.status || "Order Placed"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updatingId === order._id || isDemoSeller}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:border-[#1877f2] outline-none disabled:opacity-50 bg-white">
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-gray-700 mb-3">
                          Items
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.product._id}
                              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-gray-800">
                                    {item.product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium text-sm">
                                {currency}
                                {item.product.offerPrice * item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Shipping Address
                          </p>
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-800">
                              {order.address.fullname}
                            </p>
                            <p>{order.address.area}</p>
                            <p>
                              {order.address.city}, {order.address.state}
                            </p>
                            <p>{order.address.pincode}</p>
                            <p className="mt-1 text-[#1877f2]">
                              {order.address.phoneNumber}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">
                              Payment Method
                            </span>
                            <span className="font-medium">{order.paymentMethod || "Stripe"}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Payment Status
                            </span>
                            <span className={`font-medium ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-lg">
                              {currency}
                              {order.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
