import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sanitizeWishlistData } from "@/lib/sanitize";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { wishlistData } = await request.json();
    const sanitized = sanitizeWishlistData(wishlistData);
    if (sanitized === null) {
      return NextResponse.json({ success: false, message: "Invalid wishlist data" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    user.wishlistItems = sanitized;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update wishlist" }, { status: 500 });
  }
}
