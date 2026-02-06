import { getAuth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/User";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch user data" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let user = await User.findById(userId);

    if (!user) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      const userData = {
        _id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        imageUrl: clerkUser.imageUrl || "",
      };

      user = await User.create(userData);
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 });
  }
}
