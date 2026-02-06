import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
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

    const product = await Product.findOne({ _id: productId, userId });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found or you don't have permission to delete it",
      }, { status: 404 });
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete product" }, { status: 500 });
  }
}
