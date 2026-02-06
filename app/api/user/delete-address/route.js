import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../../config/db";
import Address from "../../../../models/Address";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { addressId } = await request.json();

    if (!addressId) {
      return NextResponse.json({
        success: false,
        message: "Address ID is required",
      }, { status: 400 });
    }

    await connectDB();

    const result = await Address.deleteOne({ _id: addressId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Address not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to delete address" }, { status: 500 });
  }
}
