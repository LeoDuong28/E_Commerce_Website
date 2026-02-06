import { getAuth } from "@clerk/nextjs/server";
import connectDB from "../../../../config/db";
import Address from "../../../../models/Address";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { address } = await request.json();

    if (!address || typeof address !== "object") {
      return NextResponse.json({ success: false, message: "Invalid address data" }, { status: 400 });
    }

    const { fullname, phoneNumber, pincode, area, city, state } = address;

    if (!fullname?.trim() || !phoneNumber?.trim() || !pincode || !area?.trim() || !city?.trim() || !state?.trim()) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    if (String(fullname).length > 100 || String(area).length > 500 || String(city).length > 100 || String(state).length > 100) {
      return NextResponse.json({ success: false, message: "Field length exceeded" }, { status: 400 });
    }

    const phoneStr = String(phoneNumber).trim();
    if (!/^\+?\d{10,15}$/.test(phoneStr)) {
      return NextResponse.json({ success: false, message: "Invalid phone number format" }, { status: 400 });
    }

    const pincodeNum = Number(pincode);
    if (!Number.isInteger(pincodeNum) || pincodeNum < 1000 || pincodeNum > 9999999999) {
      return NextResponse.json({ success: false, message: "Invalid pincode" }, { status: 400 });
    }

    await connectDB();

    const newAddress = await Address.create({
      userId,
      fullname: String(fullname).trim(),
      phoneNumber: String(phoneNumber).trim(),
      pincode: Number(pincode),
      area: String(area).trim(),
      city: String(city).trim(),
      state: String(state).trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add address" }, { status: 500 });
  }
}
