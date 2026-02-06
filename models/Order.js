import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  items: [
    {
      product: { type: String, required: true, ref: "product" },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: { type: String, ref: "address", required: true },
  status: { type: String, required: true, default: "Order Placed", enum: ["Order Placed", "Packing", "Out for Delivery", "Delivered"] },
  date: { type: Number, required: true },
  paymentMethod: { type: String, default: "Stripe" },
  isPaid: { type: Boolean, default: false },
  stripeSessionId: { type: String },
  promoCode: { type: String, default: null },
  discount: { type: Number, default: 0 },
});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
