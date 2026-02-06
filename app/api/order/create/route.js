import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import Product from "@/models/Product";
import Order from "@/models/Order";
import User from "@/models/User";
import PromoCode from "@/models/PromoCode";
import connectDB from "@/config/db";
import { TAX_RATE, ORDER_THROTTLE_MS } from "@/lib/constants";

let stripeInstance = null;
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_API_SECRET);
  }
  return stripeInstance;
}

async function getOrCreateStripeCustomer(user) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await getStripe().customers.create({
    email: user.email,
    name: user.name,
    metadata: { userId: user._id },
  });

  user.stripeCustomerId = customer.id;
  await user.save();

  return customer.id;
}

async function validatePromoCode(code, subtotal) {
  if (!code) return null;

  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!promo) return null;
  if (promo.expiresAt && new Date() > promo.expiresAt) return null;
  if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) return null;
  if (subtotal < promo.minPurchase) return null;

  let discount = 0;
  if (promo.discountType === "percentage") {
    discount = Math.floor(subtotal * (promo.discountValue / 100) * 100) / 100;
  } else {
    discount = Math.min(promo.discountValue, subtotal);
  }

  return { promo, discount };
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { address, items, promoCode } = await request.json();

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    await connectDB();

    const recentOrder = await Order.findOne({
      userId,
      isPaid: false,
      date: { $gt: Date.now() - ORDER_THROTTLE_MS },
    });
    if (recentOrder) {
      return NextResponse.json({
        success: false,
        message: "Please wait before placing another order",
      }, { status: 429 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const stripeCustomerId = await getOrCreateStripeCustomer(user);

    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const missingIds = productIds.filter((id) => !productMap.has(id));
    if (missingIds.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Some products are no longer available",
      }, { status: 400 });
    }

    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product);
      subtotal += product.offerPrice * item.quantity;

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image.slice(0, 1),
          },
          unit_amount: Math.round(product.offerPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    let discount = 0;
    let appliedCode = null;

    const promoValidation = await validatePromoCode(promoCode, subtotal);
    if (promoValidation) {
      const claimed = await PromoCode.findOneAndUpdate(
        {
          _id: promoValidation.promo._id,
          $or: [
            { maxUses: null },
            { $expr: { $lt: ["$usedCount", "$maxUses"] } },
          ],
        },
        { $inc: { usedCount: 1 } },
        { new: true }
      );

      if (claimed) {
        discount = promoValidation.discount;
        appliedCode = promoValidation.promo.code;
      }
    }

    const afterDiscount = Math.max(0, subtotal - discount);
    const tax = Math.floor(afterDiscount * TAX_RATE * 100) / 100;
    const totalAmount = afterDiscount + tax;

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Tax (${TAX_RATE * 100}%)` },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });

    const order = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      date: Date.now(),
      paymentMethod: "Stripe",
      isPaid: false,
      promoCode: appliedCode,
      discount,
    });

    const allowedOrigins = [process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXT_PUBLIC_DEV_URL].filter(Boolean);
    if (allowedOrigins.length === 0) {
      return NextResponse.json({ success: false, message: "Server configuration error" }, { status: 500 });
    }
    const requestOrigin = request.headers.get("origin");
    const origin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];

    let discounts = [];
    if (discount > 0) {
      const coupon = await getStripe().coupons.create({
        amount_off: Math.round(discount * 100),
        currency: "usd",
        duration: "once",
        name: `Promo: ${appliedCode}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      payment_intent_data: {
        setup_future_usage: "on_session",
      },
      ...(discounts.length > 0 && { discounts }),
      success_url: `${origin}/order-placed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
  }
}
