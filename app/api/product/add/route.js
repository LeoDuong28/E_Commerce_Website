import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "../../../../models/Product";
import connectDB from "../../../../config/db";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
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

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    let category;
    try {
      category = JSON.parse(formData.get("category"));
    } catch {
      return NextResponse.json({ success: false, message: "Invalid category format" }, { status: 400 });
    }
    const price = Number(formData.get("price"));
    const offerPrice = Number(formData.get("offerPrice"));

    if (!name || !description || !category) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(offerPrice) || offerPrice < 0) {
      return NextResponse.json({ success: false, message: "Invalid price values" }, { status: 400 });
    }
    const showInPopular = formData.get("showInPopular") === "true";

    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files uploaded",
      }, { status: 400 });
    }

    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          stream.end(buffer);
        });
      }),
    );

    const image = result.map((result) => result.secure_url);

    await connectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price,
      offerPrice,
      showInPopular,
      image,
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      newProduct,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to add product",
    }, { status: 500 });
  }
}
