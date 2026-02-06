"use client";
import { useState, useEffect, useRef } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { UserButton, useClerk } from "@clerk/nextjs";
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { isSeller, router, user, getCartCount, getWishlistCount, enterDemoMode } = useAppContext();
  const { openSignIn } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      if (trimmed.toLowerCase() === "seller@demo.com") {
        enterDemoMode();
        router.push("/seller");
        setSearchOpen(false);
        setSearchQuery("");
        return;
      }
      router.push(`/all-products?search=${encodeURIComponent(trimmed)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartCount = mounted ? getCartCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoLink}>
        <Image
          src={assets.logo}
          alt="Logo"
          className={styles.logo}
          priority
        />
      </Link>

      <div className={styles.navLinks}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/all-products" className={styles.navLink}>
          Shop
        </Link>
        <Link href="/about" className={styles.navLink}>
          About Us
        </Link>
        <Link href="/contact" className={styles.navLink}>
          Contact
        </Link>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className={styles.sellerBtn}
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.searchWrapper}>
          {searchOpen ? (
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchSubmit}>
                <FiSearch size={22} className={styles.iconSvg} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className={styles.searchClose}
              >
                <FiX size={20} className={styles.closeIconSvg} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className={styles.iconBtn}
              aria-label="Search"
            >
              <FiSearch size={22} className={styles.iconSvg} />
            </button>
          )}
        </div>

        <button
          onClick={() => router.push("/wishlist")}
          className={styles.cartBtn}
          aria-label="Wishlist"
        >
          <FiHeart size={22} className={styles.iconSvg} />
          {wishlistCount > 0 && (
            <span className={styles.cartBadge}>{wishlistCount}</span>
          )}
        </button>

        <button
          onClick={() => router.push("/cart")}
          className={styles.cartBtn}
          aria-label="Cart"
        >
          <FiShoppingCart size={22} className={styles.iconSvg} />
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </button>

        {mounted && user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button onClick={openSignIn} className={styles.iconBtn} aria-label="Account">
            <FiUser size={22} className={styles.iconSvg} />
          </button>
        )}
      </div>

      <div className={styles.mobileActions}>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={styles.iconBtn}
          aria-label="Search"
        >
          <FiSearch size={22} className={styles.iconSvg} />
        </button>

        <button
          onClick={() => router.push("/cart")}
          className={styles.cartBtn}
          aria-label="Cart"
        >
          <FiShoppingCart size={22} className={styles.iconSvg} />
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </button>

        {mounted && user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button onClick={openSignIn} className={styles.iconBtn} aria-label="Account">
            <FiUser size={22} className={styles.iconSvg} />
          </button>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={styles.menuBtn}
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <FiX size={22} className={styles.iconSvg} />
          ) : (
            <FiMenu size={24} className={styles.iconSvg} />
          )}
        </button>
      </div>

      {searchOpen && (
        <div className={styles.mobileSearchBar}>
          <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
            <FiSearch size={22} className={styles.mobileSearchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mobileSearchInput}
            />
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              className={styles.mobileSearchClose}
            >
              <FiX size={20} />
            </button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            href="/"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/all-products"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/my-orders"
            className={styles.mobileNavLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            My Orders
          </Link>
          {isSeller && (
            <button
              onClick={() => {
                router.push("/seller");
                setMobileMenuOpen(false);
              }}
              className={styles.mobileSellerBtn}
            >
              Seller Dashboard
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
