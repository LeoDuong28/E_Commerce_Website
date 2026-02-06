import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: {
    type: String,
    required: true,
    enum: ["percentage", "fixed"],
  },
  discountValue: { type: Number, required: true, min: 0 },
  minPurchase: { type: Number, default: 0 },
  maxUses: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
});

const PromoCode = mongoose.models.promocode || mongoose.model("promocode", promoCodeSchema);

export default PromoCode;
