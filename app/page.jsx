"use client";
import Header from "@/components/Header/Header";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner/Banner";
import Subscribe from "@/components/Subscribe/Subscribe";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <Header />
        <HomeProducts />
        <FeaturedProducts />
        <Banner />
        <Subscribe />
      </div>
      <Footer />
    </>
  );
};

export default Home;
