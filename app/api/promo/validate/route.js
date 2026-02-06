import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import PromoCode from "@/models/PromoCode";
import connectDB from "@/config/db";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Not authenticated",
      }, { status: 401 });
    }

    const { code, subtotal } = await request.json();

    if (!code || subtotal == null) {
      return NextResponse.json({
        success: false,
        message: "Code and subtotal are required",
      }, { status: 400 });
    }

    await connectDB();

    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return NextResponse.json({
        success: false,
        message: "Invalid promo code",
      }, { status: 404 });
    }

    if (promo.expiresAt && new Date() > promo.expiresAt) {
      return NextResponse.json({
        success: false,
        message: "This promo code has expired",
      }, { status: 400 });
    }

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({
        success: false,
        message: "This promo code has reached its usage limit",
      }, { status: 400 });
    }

    if (subtotal < promo.minPurchase) {
      return NextResponse.json({
        success: false,
        message: `Minimum purchase of $${promo.minPurchase} required`,
      }, { status: 400 });
    }

    let discount = 0;
    if (promo.discountType === "percentage") {
      discount = Math.floor(subtotal * (promo.discountValue / 100) * 100) / 100;
    } else {
      discount = Math.min(promo.discountValue, subtotal);
    }

    return NextResponse.json({
      success: true,
      discount,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      code: promo.code,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to validate promo code" }, { status: 500 });
  }
}
