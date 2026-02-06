import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HeartIcon = ({ filled }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "#ef4444" : "none"}
    stroke={filled ? "#ef4444" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transition: "all 0.2s ease" }}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ProductCard = ({ product }) => {
  const { currency, router, addToCart, wishlistItems, toggleWishlist } = useAppContext();
  const isWishlisted = !!wishlistItems[product._id];

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product._id);
    router.push("/cart");
  };

  const discountPercent =
    product.price > product.offerPrice
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : 0;

  const hasDiscount = discountPercent > 0;

  return (
    <div
      onClick={() => {
        router.push("/product/" + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-0.5 w-full cursor-pointer">
      <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-48 sm:h-52 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-105 transition-transform duration-300 object-cover w-4/5 h-4/5 md:w-full md:h-full"
          width={800}
          height={800}
        />

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}

        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-200 ${
            isWishlisted
              ? "bg-red-50 scale-110"
              : "bg-white hover:bg-gray-50 hover:scale-110"
          }`}
          style={{
            transform: isWishlisted ? "scale(1.1)" : undefined,
          }}>
          <HeartIcon filled={isWishlisted} />
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {product.description}
      </p>
      <div className="flex items-end justify-between w-full mt-1 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-base font-medium text-[#1877f2]">
            {currency}
            {product.offerPrice}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-400 line-through">
              {currency}
              {product.price}
            </p>
          )}
        </div>
        <button
          onClick={handleBuyNow}
          className="hidden sm:block flex-shrink-0 px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-200">
          Buy now
        </button>
        <button
          onClick={handleAddToCart}
          aria-label="Add to cart"
          className="sm:hidden flex-shrink-0 p-1.5 text-gray-500 border border-gray-500/20 rounded-full hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all duration-200">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
