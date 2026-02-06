export const TAX_RATE = 0.02;

export const MAX_PRICE = 10000;

export const PRODUCTS_PER_PAGE = 12;

export const BASE_CATEGORIES = [
  "Earphone",
  "Headphone",
  "Watch",
  "Smartphone",
  "Laptop",
  "Camera",
  "Accessories",
];

export const VALIDATION = {
  MAX_KEY_LENGTH: 50,
  MAX_CART_QUANTITY: 9999,
  MAX_FULLNAME_LENGTH: 100,
  MAX_AREA_LENGTH: 500,
  MAX_CITY_LENGTH: 100,
  MAX_STATE_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,
  MIN_PINCODE: 1000,
  MAX_PINCODE: 9999999999,
};

export const ORDER_THROTTLE_MS = 60000;

export const STORAGE_KEYS = {
  HIDDEN_CATEGORY_PRESETS: "hiddenCategoryPresets",
};

export const ORDER_STATUSES = [
  { value: "Order Placed", label: "Order Placed", color: "text-blue-500", bg: "bg-blue-50" },
  { value: "Packing", label: "Packing", color: "text-yellow-500", bg: "bg-yellow-50" },
  { value: "Out for Delivery", label: "Out for Delivery", color: "text-orange-500", bg: "bg-orange-50" },
  { value: "Delivered", label: "Delivered", color: "text-green-500", bg: "bg-green-50" },
];

export const VALID_ORDER_STATUSES = ORDER_STATUSES.map(s => s.value);
