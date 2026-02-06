'use client'
import { assets } from "@/assets/assets";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import { useAppContext } from "@/context/AppContext";
import { TAX_RATE } from "@/lib/constants";

const Cart = () => {

  const { products, router, currency, cartItems, addToCart, updateCartQuantity, getCartCount, getCartAmount } = useAppContext();

  const subtotal = getCartAmount();
  const tax = Math.floor(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + tax;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
          <p className="text-2xl md:text-3xl text-gray-500">
            Your <span className="font-medium text-[#1877f2]">Cart</span>
          </p>
          <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
        </div>

        {getCartCount() === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/all-products')}
              className="bg-[#1877f2] text-white px-8 py-3 hover:bg-[#0c63d4] rounded-lg transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="text-left">
                    <tr>
                      <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 font-medium">
                        Product Details
                      </th>
                      <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                        Price
                      </th>
                      <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                        Quantity
                      </th>
                      <th className="pb-6 md:px-4 px-1 text-gray-600 font-medium">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(cartItems).map((itemId) => {
                      const product = products.find(product => product._id === itemId);

                      if (!product || cartItems[itemId] <= 0) return null;

                      return (
                        <tr key={itemId}>
                          <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                            <div>
                              <div className="rounded-lg overflow-hidden bg-gray-500/10 p-2">
                                <Image
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="w-16 h-auto object-cover mix-blend-multiply"
                                  width={128}
                                  height={128}
                                  sizes="64px"
                                />
                              </div>
                              <button
                                className="md:hidden text-xs text-[#1877f2] mt-1"
                                onClick={() => updateCartQuantity(product._id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-sm hidden md:block">
                              <p className="text-gray-800">{product.name}</p>
                              <button
                                className="text-xs text-[#1877f2] mt-1"
                                onClick={() => updateCartQuantity(product._id, 0)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                          <td className="py-4 md:px-4 px-1 text-gray-600">${product.offerPrice}</td>
                          <td className="py-4 md:px-4 px-1">
                            <div className="flex items-center md:gap-2 gap-1">
                              <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)}>
                                <Image
                                  src={assets.decrease_arrow}
                                  alt="decrease_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                              <input onChange={e => updateCartQuantity(product._id, Number(e.target.value))} type="number" value={cartItems[itemId]} className="w-10 border rounded text-center appearance-none"></input>
                              <button onClick={() => addToCart(product._id)}>
                                <Image
                                  src={assets.increase_arrow}
                                  alt="increase_arrow"
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 md:px-4 px-1 text-gray-600">${(product.offerPrice * cartItems[itemId]).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-6 gap-2 text-[#1877f2]">
                <Image
                  className="group-hover:-translate-x-1 transition"
                  src={assets.arrow_right_icon_colored}
                  alt="arrow_right_icon_colored"
                />
                Continue Shopping
              </button>
            </div>

            <div className="w-full lg:w-80 bg-gray-50 p-5 rounded-lg h-fit">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Cart Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                  <span className="text-gray-800">{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Tax ({TAX_RATE * 100}%)</span>
                  <span className="text-gray-800">{currency}{tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base font-medium">
                  <span>Estimated Total</span>
                  <span>{currency}{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-[#1877f2] text-white py-3 mt-5 rounded-lg hover:bg-[#0c63d4] font-medium transition"
              >
                Proceed to Checkout
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                Promo codes can be applied at checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
