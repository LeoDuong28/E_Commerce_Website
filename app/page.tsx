"use client";
import React from "react";
import Header from "@/components/Header/Header";
import HomeProducts from "@/components/Products/HomeProducts";
import Banner from "@/components/Banner/Banner";
import NewsLetter from "@/components/Subscribe/NewsLetter";
import Featured from "@/components/Products/FeaturedProducts";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <Header />
        <HomeProducts />
        <Featured />
        <Banner />
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
