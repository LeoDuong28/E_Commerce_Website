import { getAuth } from "@clerk/nextjs/server";
import User from "../../../../models/User";
import connectDB from "../../../../config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to get cart" }, { status: 500 });
  }
}
