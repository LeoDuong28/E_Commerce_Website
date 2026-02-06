import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

export async function PUT(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    const ownerUserId = process.env.OWNER_USER_ID;
    if (ownerUserId && userId !== ownerUserId) {
      return NextResponse.json({ success: false, message: "Demo accounts cannot modify data" }, { status: 403 });
    }

    const body = await request.json();
    const { productId, name, description, category, price, offerPrice, showInPopular } = body;

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required",
      }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      }, { status: 404 });
    }

    if (product.userId !== userId) {
      return NextResponse.json({
        success: false,
        message: "Not authorized to edit this product",
      }, { status: 403 });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (price !== undefined) {
      const numPrice = Number(price);
      if (!Number.isFinite(numPrice) || numPrice <= 0) {
        return NextResponse.json({ success: false, message: "Invalid price" }, { status: 400 });
      }
      updateData.price = numPrice;
    }
    if (offerPrice !== undefined) {
      const numOfferPrice = Number(offerPrice);
      if (!Number.isFinite(numOfferPrice) || numOfferPrice < 0) {
        return NextResponse.json({ success: false, message: "Invalid offer price" }, { status: 400 });
      }
      updateData.offerPrice = numOfferPrice;
    }
    if (showInPopular !== undefined) updateData.showInPopular = showInPopular;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to update product",
    }, { status: 500 });
  }
}
