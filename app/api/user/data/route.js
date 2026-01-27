import { getAuth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/User";
import connectDB from "@/config/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await connectDB();

    let user = await User.findById(userId);

    // If user doesn't exist in MongoDB, create them from Clerk data
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
    return NextResponse.json({ success: false, message: error.message });
  }
}
