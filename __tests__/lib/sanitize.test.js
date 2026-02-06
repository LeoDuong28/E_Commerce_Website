const VALIDATION = {
  MAX_KEY_LENGTH: 50,
  MAX_CART_QUANTITY: 9999,
};

function sanitizeCartData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      typeof key === "string" &&
      key.length <= VALIDATION.MAX_KEY_LENGTH &&
      !key.startsWith("$")
    ) {
      const qty = Number(value);
      if (
        Number.isInteger(qty) &&
        qty >= 0 &&
        qty <= VALIDATION.MAX_CART_QUANTITY
      ) {
        clean[key] = qty;
      }
    }
  }
  return clean;
}

function sanitizeWishlistData(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (
      typeof key === "string" &&
      key.length <= VALIDATION.MAX_KEY_LENGTH &&
      !key.startsWith("$")
    ) {
      if (value === true) {
        clean[key] = true;
      }
    }
  }
  return clean;
}

describe("sanitizeCartData", () => {
  describe("valid input handling", () => {
    test("returns empty object for empty cart", () => {
      const result = sanitizeCartData({});
      expect(result).toEqual({});
    });

    test("accepts valid product IDs with integer quantities", () => {
      const input = {
        "507f1f77bcf86cd799439011": 2,
        "507f1f77bcf86cd799439012": 5,
      };
      const result = sanitizeCartData(input);
      expect(result).toEqual(input);
    });

    test("rejects float quantities", () => {
      const input = { productId: 3.7 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });

    test("accepts zero quantity (for removal)", () => {
      const input = { productId: 0 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ productId: 0 });
    });

    test("accepts maximum valid quantity", () => {
      const input = { productId: VALIDATION.MAX_CART_QUANTITY };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ productId: VALIDATION.MAX_CART_QUANTITY });
    });
  });

  describe("invalid input rejection", () => {
    test("returns null for null input", () => {
      expect(sanitizeCartData(null)).toBeNull();
    });

    test("returns null for undefined input", () => {
      expect(sanitizeCartData(undefined)).toBeNull();
    });

    test("returns null for array input", () => {
      expect(sanitizeCartData([])).toBeNull();
    });

    test("returns null for string input", () => {
      expect(sanitizeCartData("invalid")).toBeNull();
    });

    test("returns null for number input", () => {
      expect(sanitizeCartData(123)).toBeNull();
    });
  });

  describe("NoSQL injection prevention", () => {
    test("rejects keys starting with $", () => {
      const input = {
        $gt: 1,
        $where: "malicious",
        validKey: 5,
      };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ validKey: 5 });
    });

    test("rejects nested injection attempts", () => {
      const input = {
        "$or[0]": 1,
        $ne: 1,
      };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });
  });

  describe("key length validation", () => {
    test("accepts keys within max length", () => {
      const validKey = "a".repeat(VALIDATION.MAX_KEY_LENGTH);
      const input = { [validKey]: 1 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ [validKey]: 1 });
    });

    test("rejects keys exceeding max length", () => {
      const longKey = "a".repeat(VALIDATION.MAX_KEY_LENGTH + 1);
      const input = { [longKey]: 1, validKey: 2 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ validKey: 2 });
    });
  });

  describe("quantity validation", () => {
    test("rejects negative quantities", () => {
      const input = { productId: -1 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });

    test("rejects quantities exceeding maximum", () => {
      const input = { productId: VALIDATION.MAX_CART_QUANTITY + 1 };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });

    test("rejects NaN quantities", () => {
      const input = { productId: NaN };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });

    test("rejects Infinity quantities", () => {
      const input = { productId: Infinity };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });

    test("converts numeric string quantities to integers", () => {
      const input = { productId: "5" };
      const result = sanitizeCartData(input);
      expect(result).toEqual({ productId: 5 });
    });

    test("rejects non-numeric string quantities", () => {
      const input = { productId: "five" };
      const result = sanitizeCartData(input);
      expect(result).toEqual({});
    });
  });
});

describe("sanitizeWishlistData", () => {
  describe("valid input handling", () => {
    test("returns empty object for empty wishlist", () => {
      const result = sanitizeWishlistData({});
      expect(result).toEqual({});
    });

    test("accepts valid product IDs with true values", () => {
      const input = {
        "507f1f77bcf86cd799439011": true,
        "507f1f77bcf86cd799439012": true,
      };
      const result = sanitizeWishlistData(input);
      expect(result).toEqual(input);
    });
  });

  describe("invalid input rejection", () => {
    test("returns null for null input", () => {
      expect(sanitizeWishlistData(null)).toBeNull();
    });

    test("returns null for undefined input", () => {
      expect(sanitizeWishlistData(undefined)).toBeNull();
    });

    test("returns null for array input", () => {
      expect(sanitizeWishlistData([])).toBeNull();
    });

    test("returns null for string input", () => {
      expect(sanitizeWishlistData("invalid")).toBeNull();
    });
  });

  describe("value validation", () => {
    test("only accepts true boolean values", () => {
      const input = {
        item1: true,
        item2: false,
        item3: 1,
        item4: "true",
        item5: null,
      };
      const result = sanitizeWishlistData(input);
      expect(result).toEqual({ item1: true });
    });
  });

  describe("NoSQL injection prevention", () => {
    test("rejects keys starting with $", () => {
      const input = {
        $gt: true,
        validKey: true,
      };
      const result = sanitizeWishlistData(input);
      expect(result).toEqual({ validKey: true });
    });
  });

  describe("key length validation", () => {
    test("rejects keys exceeding max length", () => {
      const longKey = "a".repeat(VALIDATION.MAX_KEY_LENGTH + 1);
      const input = { [longKey]: true, validKey: true };
      const result = sanitizeWishlistData(input);
      expect(result).toEqual({ validKey: true });
    });
  });
});
