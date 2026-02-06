"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";

const Product = () => {
  const { id } = useParams();

  const { products, router, addToCart, wishlistItems, toggleWishlist } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products]);

  return productData ? (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="px-5 lg:px-16 xl:px-20">
            <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
              <Image
                src={mainImage || productData.image[0]}
                alt={productData.name}
                className="w-full h-auto object-cover mix-blend-multiply"
                width={800}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10">
                  <Image
                    src={image}
                    alt={`${productData.name} - image ${index + 1}`}
                    className="w-full h-auto object-cover mix-blend-multiply"
                    width={200}
                    height={200}
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
              {productData.name}
            </h1>
            <p className="text-gray-600 mt-3">{productData.description}</p>
            <p className="text-3xl font-medium mt-6">
              ${productData.offerPrice}
              {productData.price > productData.offerPrice && (
                <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                  ${productData.price}
                </span>
              )}
            </p>
            <hr className="bg-gray-600 my-6" />
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse w-full max-w-72">
                <tbody>
                  <tr>
                    <td className="text-gray-600 font-medium">Category</td>
                    <td className="text-gray-800/50">
                      {Array.isArray(productData.category)
                        ? productData.category.join(", ")
                        : productData.category}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center mt-10 gap-4">
              <button
                onClick={() => addToCart(productData._id)}
                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 rounded-lg transition">
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(productData._id);
                  router.push("/cart");
                }}
                className="w-full py-3.5 bg-[#1877f2] text-white hover:bg-[#0c63d4] rounded-lg transition">
                Buy now
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(productData._id)}
              className={`flex items-center justify-center gap-2 mt-3 w-full py-3 border rounded-lg transition ${
                wishlistItems[productData._id]
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill={wishlistItems[productData._id] ? "#ef4444" : "none"}
                stroke={wishlistItems[productData._id] ? "#ef4444" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
              {wishlistItems[productData._id] ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-4 mt-16">
            <p className="text-3xl font-medium">
              Featured{" "}
              <span className="font-medium text-[#1877f2]">Products</span>
            </p>
            <div className="w-28 h-0.5 bg-[#1877f2] mt-2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
            {products.slice(0, 5).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <button className="px-8 py-2 mb-16 border rounded-lg text-gray-500/70 hover:bg-slate-50/90 transition">
            See more
          </button>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
