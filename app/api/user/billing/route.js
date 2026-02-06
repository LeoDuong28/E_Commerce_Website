import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
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
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({
        success: false,
        message: "No saved payment methods found",
      }, { status: 404 });
    }

    const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXT_PUBLIC_DEV_URL].filter(Boolean);
    if (allowedOrigins.length === 0) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }
    const requestOrigin = request.headers.get("origin");
    const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

    const session = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/my-orders`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to open billing portal" }, { status: 500 });
  }
}
