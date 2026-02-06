import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { VALID_ORDER_STATUSES } from "@/lib/constants";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);
    const { orderId, status } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({
        success: false,
        message: "Order ID and status are required",
      }, { status: 400 });
    }

    if (!VALID_ORDER_STATUSES.includes(status)) {
      return NextResponse.json({
        success: false,
        message: "Invalid status value",
      }, { status: 400 });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const ownerUserId = process.env.OWNER_USER_ID;
    if (ownerUserId && userId !== ownerUserId) {
      return NextResponse.json({ success: false, message: "Demo accounts cannot modify data" }, { status: 403 });
    }

    await connectDB();

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      }, { status: 404 });
    }

    const ownsAllProducts = order.items.every(
      (item) => item.product && item.product.userId === userId
    );
    if (!ownsAllProducts) {
      return NextResponse.json({
        success: false,
        message: "Not authorized to update this order",
      }, { status: 403 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update order status" }, { status: 500 });
  }
}
