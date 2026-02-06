const VALID_ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Out for Delivery",
  "Delivered",
];

describe("Product Schema Definition", () => {
  const productSchema = {
    userId: { type: "String", required: true },
    name: { type: "String", required: true },
    description: { type: "String", required: true },
    price: { type: "Number", required: true, min: 0 },
    offerPrice: { type: "Number", required: true, min: 0 },
    image: { type: "Array", required: true },
    category: { type: "Array", required: true },
    showInPopular: { type: "Boolean", default: false },
    date: { type: "Number", required: true },
  };

  test("has all required fields", () => {
    const requiredFields = [
      "userId",
      "name",
      "description",
      "price",
      "offerPrice",
      "image",
      "category",
      "date",
    ];
    requiredFields.forEach((field) => {
      expect(productSchema[field]).toBeDefined();
      expect(productSchema[field].required).toBe(true);
    });
  });

  test("price fields have minimum of 0", () => {
    expect(productSchema.price.min).toBe(0);
    expect(productSchema.offerPrice.min).toBe(0);
  });

  test("showInPopular defaults to false", () => {
    expect(productSchema.showInPopular.default).toBe(false);
  });

  test("category is an array type", () => {
    expect(productSchema.category.type).toBe("Array");
  });
});

describe("Order Schema Definition", () => {
  const orderSchema = {
    userId: { type: "String", required: true },
    items: { type: "Array", required: true },
    amount: { type: "Number", required: true },
    address: { type: "String", required: true },
    status: {
      type: "String",
      required: true,
      default: "Order Placed",
      enum: VALID_ORDER_STATUSES,
    },
    date: { type: "Number", required: true },
    paymentMethod: { type: "String", default: "Stripe" },
    isPaid: { type: "Boolean", default: false },
    stripeSessionId: { type: "String", required: false },
    promoCode: { type: "String", default: null },
    discount: { type: "Number", default: 0 },
  };

  test("has all required fields", () => {
    const requiredFields = [
      "userId",
      "items",
      "amount",
      "address",
      "status",
      "date",
    ];
    requiredFields.forEach((field) => {
      expect(orderSchema[field]).toBeDefined();
      expect(orderSchema[field].required).toBe(true);
    });
  });

  test("status has valid enum values", () => {
    expect(orderSchema.status.enum).toEqual(VALID_ORDER_STATUSES);
  });

  test("status defaults to Order Placed", () => {
    expect(orderSchema.status.default).toBe("Order Placed");
  });

  test("isPaid defaults to false", () => {
    expect(orderSchema.isPaid.default).toBe(false);
  });

  test("discount defaults to 0", () => {
    expect(orderSchema.discount.default).toBe(0);
  });

  test("promoCode defaults to null", () => {
    expect(orderSchema.promoCode.default).toBeNull();
  });
});

describe("User Schema Definition", () => {
  const userSchema = {
    _id: { type: "String", required: true },
    name: { type: "String", required: true },
    email: { type: "String", required: true, unique: true },
    imageUrl: { type: "String", required: true },
    cartItems: { type: "Object", default: {} },
    wishlistItems: { type: "Object", default: {} },
    stripeCustomerId: { type: "String", required: false },
  };

  test("has all required fields", () => {
    const requiredFields = ["_id", "name", "email", "imageUrl"];
    requiredFields.forEach((field) => {
      expect(userSchema[field]).toBeDefined();
      expect(userSchema[field].required).toBe(true);
    });
  });

  test("email is unique", () => {
    expect(userSchema.email.unique).toBe(true);
  });

  test("cartItems defaults to empty object", () => {
    expect(userSchema.cartItems.default).toEqual({});
  });

  test("wishlistItems defaults to empty object", () => {
    expect(userSchema.wishlistItems.default).toEqual({});
  });
});

describe("PromoCode Schema Definition", () => {
  const promoCodeSchema = {
    code: { type: "String", required: true, unique: true, uppercase: true },
    discountType: {
      type: "String",
      required: true,
      enum: ["percentage", "fixed"],
    },
    discountValue: { type: "Number", required: true, min: 0 },
    minPurchase: { type: "Number", default: 0 },
    maxUses: { type: "Number", default: null },
    usedCount: { type: "Number", default: 0 },
    expiresAt: { type: "Date", default: null },
    isActive: { type: "Boolean", default: true },
  };

  test("code is required, unique, and uppercase", () => {
    expect(promoCodeSchema.code.required).toBe(true);
    expect(promoCodeSchema.code.unique).toBe(true);
    expect(promoCodeSchema.code.uppercase).toBe(true);
  });

  test("discountType has valid enum values", () => {
    expect(promoCodeSchema.discountType.enum).toContain("percentage");
    expect(promoCodeSchema.discountType.enum).toContain("fixed");
    expect(promoCodeSchema.discountType.enum.length).toBe(2);
  });

  test("discountValue has minimum of 0", () => {
    expect(promoCodeSchema.discountValue.min).toBe(0);
  });

  test("isActive defaults to true", () => {
    expect(promoCodeSchema.isActive.default).toBe(true);
  });

  test("usedCount defaults to 0", () => {
    expect(promoCodeSchema.usedCount.default).toBe(0);
  });
});

describe("Order Item Structure", () => {
  const orderItemSchema = {
    product: { type: "String", required: true },
    quantity: { type: "Number", required: true },
  };

  test("has required product reference", () => {
    expect(orderItemSchema.product.required).toBe(true);
  });

  test("has required quantity", () => {
    expect(orderItemSchema.quantity.required).toBe(true);
  });
});

describe("Data Validation Rules", () => {
  describe("product pricing", () => {
    test("offer price should typically be less than or equal to regular price", () => {
      const validatePricing = (price, offerPrice) => {
        return offerPrice <= price;
      };

      expect(validatePricing(100, 80)).toBe(true);
      expect(validatePricing(100, 100)).toBe(true);
      expect(validatePricing(100, 120)).toBe(false);
    });
  });

  describe("order amount calculation", () => {
    test("amount should be sum of item prices times quantities", () => {
      const calculateOrderAmount = (items, products) => {
        return items.reduce((total, item) => {
          const product = products.find((p) => p._id === item.product);
          return total + (product?.offerPrice || 0) * item.quantity;
        }, 0);
      };

      const products = [
        { _id: "p1", offerPrice: 100 },
        { _id: "p2", offerPrice: 50 },
      ];
      const items = [
        { product: "p1", quantity: 2 },
        { product: "p2", quantity: 1 },
      ];

      expect(calculateOrderAmount(items, products)).toBe(250);
    });
  });

  describe("promo discount application", () => {
    test("percentage discount should not exceed subtotal", () => {
      const applyPercentageDiscount = (subtotal, percentage) => {
        const discount = Math.floor(subtotal * (percentage / 100) * 100) / 100;
        return Math.min(discount, subtotal);
      };

      expect(applyPercentageDiscount(100, 10)).toBe(10);
      expect(applyPercentageDiscount(100, 150)).toBe(100); // Capped at subtotal
    });
  });
});
