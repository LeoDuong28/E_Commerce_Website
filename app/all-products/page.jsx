"use client";
import { Suspense, useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import styles from "./AllProducts.module.css";
import { PRODUCTS_PER_PAGE, MAX_PRICE } from "@/lib/constants";

const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SkeletonCard = () => (
  <div className="flex flex-col gap-2 w-full animate-pulse">
    <div className="bg-gray-200 rounded-lg w-full h-48 sm:h-52" />
    <div className="bg-gray-200 rounded h-4 w-3/4 mt-2" />
    <div className="bg-gray-200 rounded h-3 w-1/2" />
    <div className="bg-gray-200 rounded h-3 w-1/4 mt-1" />
  </div>
);

const AllProductsContent = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const productsSectionRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: MAX_PRICE });
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlCategory = searchParams.get("category");

    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const getProductCategories = (product) => {
    if (Array.isArray(product.category)) return product.category;
    return [product.category];
  };

  const categories = useMemo(() => {
    const catCounts = {};
    products.forEach((p) => {
      getProductCategories(p).forEach((c) => {
        catCounts[c] = (catCounts[c] || 0) + 1;
      });
    });
    const saleCount = products.filter((p) => p.price > p.offerPrice).length;
    return [
      { name: "All", count: products.length },
      { name: "Sale", count: saleCount },
      ...Object.entries(catCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, count]) => ({ name, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    if (selectedCategory === "Sale") {
      result = result.filter((p) => p.price > p.offerPrice);
    } else if (selectedCategory !== "All") {
      result = result.filter((p) =>
        getProductCategories(p).includes(selectedCategory),
      );
    }

    result = result.filter(
      (p) => p.offerPrice >= priceRange.min && p.offerPrice <= priceRange.max,
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        result.sort((a, b) => b.date - a.date);
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceRange({ min: 0, max: MAX_PRICE });
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    priceRange.min > 0 ||
    priceRange.max < MAX_PRICE ||
    sortBy !== "default";

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14">
        <div className="flex flex-col items-start w-full sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex flex-col items-start">
            <p className="text-2xl font-medium">All Products</p>
            <div className="w-16 h-0.5 bg-[#1877f2] rounded-full"></div>
          </div>

          <div className={styles.searchWrapper}>
            <Image
              src={assets.search_icon}
              alt="Search"
              className={styles.searchIcon}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className={styles.clearSearch}
                aria-label="Clear search">
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div className={styles.controlsRow}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="20" y2="12" />
              <line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            Filters
          </button>

          <div className={styles.sortWrapper}>
            <label htmlFor="sort" className={styles.sortLabel}>
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}>
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <p className={styles.resultsCount}>
            Showing {Math.min(visibleCount, filteredProducts.length)} of{" "}
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className={styles.mainContent}>
          <div
            className={`${styles.filterBackdrop} ${showFilters ? styles.showBackdrop : ""}`}
            onClick={() => setShowFilters(false)}
          />
          <aside
            className={`${styles.filtersSidebar} ${showFilters ? styles.showFilters : ""}`}>
            <div className={styles.filtersHeader}>
              <h3 className={styles.filtersTitle}>Filters</h3>
              <div className={styles.filtersHeaderActions}>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className={styles.clearFilters}>
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className={styles.filterCloseBtn}
                  aria-label="Close filters">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Category</h4>
              <div className={styles.categoryList}>
                {categories.map(({ name, count }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name)}
                    className={`${styles.categoryBtn} ${selectedCategory === name ? styles.categoryBtnActive : ""}`}>
                    {name === "Sale" ? "Sale" : name}
                    <span className={styles.categoryCount}>{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4 className={styles.filterLabel}>Price Range</h4>
              <div className={styles.priceInputs}>
                <div className={styles.priceField}>
                  <label>Min</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        min: Number(e.target.value),
                      })
                    }
                    className={styles.priceInput}
                    min="0"
                  />
                </div>
                <span className={styles.priceSeparator}>-</span>
                <div className={styles.priceField}>
                  <label>Max</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: Number(e.target.value),
                      })
                    }
                    className={styles.priceInput}
                    min="0"
                  />
                </div>
              </div>
            </div>

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden mt-4 w-full py-2.5 bg-[#1877f2] text-white rounded-lg font-medium">
                Apply Filters
              </button>
            )}
          </aside>

          <div className={styles.productsSection} ref={productsSectionRef}>
            {hasActiveFilters && (
              <div className={styles.activeFilters}>
                {searchQuery && (
                  <span className={styles.filterChip}>
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} aria-label="Remove search filter">
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className={styles.filterChip}>
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} aria-label="Remove category filter">
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {(priceRange.min > 0 || priceRange.max < MAX_PRICE) && (
                  <span className={styles.filterChip}>
                    ${priceRange.min} - ${priceRange.max}
                    <button
                      onClick={() => setPriceRange({ min: 0, max: MAX_PRICE })}
                      aria-label="Remove price filter">
                      <CloseIcon />
                    </button>
                  </span>
                )}
              </div>
            )}

            {products.length === 0 ? (
              <div className={styles.productsGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className={styles.productsGrid}>
                  {visibleProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {hasMore && (
                  <div className={styles.loadMoreWrapper}>
                    <button
                      onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
                      className={styles.loadMoreBtn}>
                      Load More Products
                      <span className={styles.loadMoreCount}>
                        ({filteredProducts.length - visibleCount} remaining)
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noResults}>
                <p className={styles.noResultsText}>No products found</p>
                <p className={styles.noResultsSubtext}>
                  Try adjusting your search or filter criteria
                </p>
                <button onClick={clearFilters} className={styles.resetBtn}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const AllProducts = () => {
  return (
    <Suspense>
      <AllProductsContent />
    </Suspense>
  );
};

export default AllProducts;
