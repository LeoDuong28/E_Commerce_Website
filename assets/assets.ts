import type { Address, Product } from "@/types/models";

// Minimal asset map for icons/images used across the app.
// These are served from /public. Swap these out with real icons anytime.
export const assets = {
  logo: "/logo_black2.png",
  star_icon: "/file.svg",
  star_dull_icon: "/file.svg",
  decrease_arrow: "/file.svg",
  increase_arrow: "/file.svg",
  arrow_right_icon_colored: "/file.svg",

  add_icon: "/file.svg",
  box_icon: "/file.svg",
  order_icon: "/file.svg",
  product_list_icon: "/file.svg",
  redirect_icon: "/file.svg",

  checkmark: "/file.svg",
  upload_area: "/file.svg",
  my_location_image: "/file.svg",

  facebook_icon: "/file.svg",
  instagram_icon: "/file.svg",
  twitter_icon: "/file.svg",
};

// Demo products so the UI renders without a backend.
// Replace with MongoDB/Node API when you wire your real data layer.
export const productsDummyData: Product[] = [
  {
    _id: "p1",
    userId: "seed",
    name: "Wireless Headphones",
    description: "Clear sound, comfy fit, and long battery life.",
    price: 129.99,
    offerPrice: 99.99,
    image: ["/logo_black2.png"],
    category: "Audio",
    date: Date.now(),
  },
  {
    _id: "p2",
    userId: "seed",
    name: "Gaming Laptop",
    description: "Smooth performance for work and play.",
    price: 1299.0,
    offerPrice: 1099.0,
    image: ["/logo_black2.png"],
    category: "Computers",
    date: Date.now(),
  },
  {
    _id: "p3",
    userId: "seed",
    name: "Smart Watch",
    description: "Track your day, workouts, and notifications.",
    price: 199.0,
    offerPrice: 159.0,
    image: ["/logo_black2.png"],
    category: "Wearables",
    date: Date.now(),
  },
  {
    _id: "p4",
    userId: "seed",
    name: "Bluetooth Speaker",
    description: "Big sound in a small package.",
    price: 79.99,
    offerPrice: 59.99,
    image: ["/logo_black2.png"],
    category: "Audio",
    date: Date.now(),
  },
];

export const addressDummyData: Address[] = [
  {
    _id: "a1",
    userId: "seed",
    fullName: "Leo Duong",
    phoneNumber: "424-000-0000",
    pincode: 90502,
    area: "Torrance",
    city: "Los Angeles",
    state: "CA",
  },
];
