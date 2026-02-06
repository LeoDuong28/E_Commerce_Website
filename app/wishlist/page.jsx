"use client";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useAppContext } from "@/context/AppContext";

export default function WishlistPage() {
  const { products, currency, router, wishlistItems, toggleWishlist, addToCart } =
    useAppContext();

  const wishlistProducts = Object.keys(wishlistItems)
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-2xl md:text-3xl text-gray-500 mb-8">
            My <span className="font-medium text-[#1877f2]">Wishlist</span>
            {wishlistProducts.length > 0 && (
              <span className="text-lg text-gray-400 ml-2">
                ({wishlistProducts.length} item
                {wishlistProducts.length !== 1 ? "s" : ""})
              </span>
            )}
          </h1>

          {wishlistProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
              <FiHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Browse our products and save items you love for later.
              </p>
              <Link
                href="/all-products"
                className="inline-block px-6 py-3 bg-[#1877f2] hover:bg-[#0c63d4] text-white font-medium rounded-lg transition-colors"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden group"
                >
                  <div
                    onClick={() => {
                      router.push("/product/" + product._id);
                      scrollTo(0, 0);
                    }}
                    className="relative bg-gray-100 h-52 flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      className="group-hover:scale-105 transition-transform duration-300 object-contain w-4/5 h-4/5 mix-blend-multiply"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="p-4">
                    <p
                      onClick={() => {
                        router.push("/product/" + product._id);
                        scrollTo(0, 0);
                      }}
                      className="font-medium text-gray-800 truncate cursor-pointer hover:text-[#1877f2] transition"
                    >
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-lg font-medium text-[#1877f2]">
                        {currency}
                        {product.offerPrice}
                      </p>
                      {product.price > product.offerPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {currency}
                          {product.price}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          addToCart(product._id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1877f2] text-white text-sm rounded hover:bg-[#0c63d4] transition"
                      >
                        <FiShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="px-3 py-2 border border-gray-200 rounded text-red-500 hover:bg-red-50 transition"
                        title="Remove from Wishlist"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
