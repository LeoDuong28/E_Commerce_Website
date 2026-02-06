import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Order from "@/models/Order";
import User from "@/models/User";
import connectDB from "@/config/db";

let stripeInstance = null;
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_API_SECRET);
  }
  return stripeInstance;
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ success: false, message: "Missing session ID" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, message: "Payment not completed" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findOne({ stripeSessionId: sessionId, userId });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (order.isPaid) {
      return NextResponse.json({ success: true, message: "Order already verified" });
    }

    order.isPaid = true;
    order.status = "Order Placed";
    await order.save();

    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Payment verified" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 });
  }
}
