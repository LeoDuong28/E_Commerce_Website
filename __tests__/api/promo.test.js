describe("Promo Code Discount Calculations", () => {
  describe("percentage discount", () => {
    const calculatePercentageDiscount = (subtotal, discountValue) => {
      return Math.floor(subtotal * (discountValue / 100) * 100) / 100;
    };

    test("calculates 10% discount correctly", () => {
      expect(calculatePercentageDiscount(100, 10)).toBe(10);
    });

    test("calculates 15% discount on $99.99", () => {
      expect(calculatePercentageDiscount(99.99, 15)).toBe(14.99);
    });

    test("calculates 50% discount correctly", () => {
      expect(calculatePercentageDiscount(200, 50)).toBe(100);
    });

    test("handles small amounts correctly", () => {
      expect(calculatePercentageDiscount(1.5, 10)).toBe(0.15);
    });

    test("handles 100% discount", () => {
      expect(calculatePercentageDiscount(50, 100)).toBe(50);
    });

    test("rounds down to avoid giving extra discount", () => {
      // 33.33 * 0.1 = 3.333, should round to 3.33
      expect(calculatePercentageDiscount(33.33, 10)).toBe(3.33);
    });
  });

  describe("fixed discount", () => {
    const calculateFixedDiscount = (discountValue, subtotal) => {
      return Math.min(discountValue, subtotal);
    };

    test("applies full fixed discount when subtotal is higher", () => {
      expect(calculateFixedDiscount(20, 100)).toBe(20);
    });

    test("caps discount at subtotal when discount is higher", () => {
      expect(calculateFixedDiscount(50, 30)).toBe(30);
    });

    test("handles equal discount and subtotal", () => {
      expect(calculateFixedDiscount(25, 25)).toBe(25);
    });

    test("handles zero subtotal", () => {
      expect(calculateFixedDiscount(10, 0)).toBe(0);
    });
  });
});

describe("Promo Code Validation Rules", () => {
  describe("minimum purchase validation", () => {
    const isMinPurchaseMet = (subtotal, minPurchase) => {
      return subtotal >= minPurchase;
    };

    test("passes when subtotal equals minimum", () => {
      expect(isMinPurchaseMet(50, 50)).toBe(true);
    });

    test("passes when subtotal exceeds minimum", () => {
      expect(isMinPurchaseMet(100, 50)).toBe(true);
    });

    test("fails when subtotal is below minimum", () => {
      expect(isMinPurchaseMet(49.99, 50)).toBe(false);
    });

    test("passes when no minimum (zero)", () => {
      expect(isMinPurchaseMet(10, 0)).toBe(true);
    });
  });

  describe("expiration validation", () => {
    const isExpired = (expiresAt) => {
      if (!expiresAt) return false;
      return new Date() > new Date(expiresAt);
    };

    test("returns false when no expiration date", () => {
      expect(isExpired(null)).toBe(false);
      expect(isExpired(undefined)).toBe(false);
    });

    test("returns true for past date", () => {
      const pastDate = new Date("2020-01-01");
      expect(isExpired(pastDate)).toBe(true);
    });

    test("returns false for future date", () => {
      const futureDate = new Date("2030-01-01");
      expect(isExpired(futureDate)).toBe(false);
    });
  });

  describe("usage limit validation", () => {
    const hasReachedUsageLimit = (maxUses, usedCount) => {
      if (maxUses === null) return false;
      return usedCount >= maxUses;
    };

    test("returns false when no limit set", () => {
      expect(hasReachedUsageLimit(null, 1000)).toBe(false);
    });

    test("returns false when under limit", () => {
      expect(hasReachedUsageLimit(100, 50)).toBe(false);
    });

    test("returns true when at limit", () => {
      expect(hasReachedUsageLimit(100, 100)).toBe(true);
    });

    test("returns true when over limit", () => {
      expect(hasReachedUsageLimit(100, 150)).toBe(true);
    });

    test("handles zero limit", () => {
      expect(hasReachedUsageLimit(0, 0)).toBe(true);
    });
  });
});

describe("Promo Code Input Validation", () => {
  describe("code normalization", () => {
    test("codes should be compared case-insensitively", () => {
      const normalizeCode = (code) => code.toUpperCase();
      expect(normalizeCode("save10")).toBe("SAVE10");
      expect(normalizeCode("SAVE10")).toBe("SAVE10");
      expect(normalizeCode("SaVe10")).toBe("SAVE10");
    });
  });

  describe("required fields validation", () => {
    const validateInput = (code, subtotal) => {
      if (!code || subtotal == null) {
        return { valid: false, message: "Code and subtotal are required" };
      }
      return { valid: true };
    };

    test("fails when code is missing", () => {
      expect(validateInput(null, 100).valid).toBe(false);
      expect(validateInput("", 100).valid).toBe(false);
      expect(validateInput(undefined, 100).valid).toBe(false);
    });

    test("fails when subtotal is missing", () => {
      expect(validateInput("CODE", null).valid).toBe(false);
      expect(validateInput("CODE", undefined).valid).toBe(false);
    });

    test("passes with valid code and subtotal", () => {
      expect(validateInput("CODE", 100).valid).toBe(true);
      expect(validateInput("CODE", 0).valid).toBe(true);
    });
  });
});

describe("Final amount calculation", () => {
  const calculateFinalAmount = (subtotal, discount, taxRate) => {
    const afterDiscount = Math.max(0, subtotal - discount);
    const tax = Math.floor(afterDiscount * taxRate * 100) / 100;
    return {
      afterDiscount,
      tax,
      total: afterDiscount + tax,
    };
  };

  test("calculates correctly with discount", () => {
    const result = calculateFinalAmount(100, 20, 0.02);
    expect(result.afterDiscount).toBe(80);
    expect(result.tax).toBe(1.6);
    expect(result.total).toBe(81.6);
  });

  test("calculates correctly without discount", () => {
    const result = calculateFinalAmount(100, 0, 0.02);
    expect(result.afterDiscount).toBe(100);
    expect(result.tax).toBe(2);
    expect(result.total).toBe(102);
  });

  test("handles discount larger than subtotal", () => {
    const result = calculateFinalAmount(50, 100, 0.02);
    expect(result.afterDiscount).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
  });

  test("rounds tax correctly", () => {
    const result = calculateFinalAmount(33.33, 0, 0.02);
    expect(result.tax).toBe(0.66);
  });
});
