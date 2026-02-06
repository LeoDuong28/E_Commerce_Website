import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();

    const products = await Product.find({ userId });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}
