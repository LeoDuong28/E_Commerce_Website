"use client";
import React from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router } = useAppContext();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-20 md:w-20"
        onClick={() => router.push("/")}
        src="/logo_black2.png"
        alt="logo"
        width={80}
        height={80}
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <Image
          className="w-4 h-4"
          src="/logo_black2.png"
          width={80}
          height={80}
          alt="search icon"
        />
        <SignedOut>
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image
                src="/logo_black2.png"
                width={20}
                height={20}
                alt="user icon"
              />
              Sign in
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm">Account</span>
          </div>
        </SignedIn>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full">
            Seller Dashboard
          </button>
        )}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image
                src="/logo_black2.png"
                width={20}
                height={20}
                alt="user icon"
              />
              Sign in
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm">Account</span>
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
