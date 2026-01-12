export type Product = {
  _id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  offerPrice: number;
  image: string[];
  category: string;
  date: number;
  __v?: number;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  cartItems: Record<string, number>;
  __v?: number;
};

export type Address = {
  _id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  pincode: number;
  area: string;
  city: string;
  state: string;
  __v?: number;
};

export type OrderItem = {
  product: Product;
  quantity: number;
  _id: string;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: string;
  date: number;
  __v?: number;
};
