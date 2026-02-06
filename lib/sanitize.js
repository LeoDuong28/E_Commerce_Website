import { VALIDATION } from "./constants";

export function sanitizeCartData(data) {
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
      if (Number.isInteger(qty) && qty >= 0 && qty <= VALIDATION.MAX_CART_QUANTITY) {
        clean[key] = qty;
      }
    }
  }
  return clean;
}

export function sanitizeWishlistData(data) {
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
