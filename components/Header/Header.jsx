"use client";
import { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";
import headphoneImg from "./headphone.png";
import playstationImg from "./playstation.png";
import macbookImg from "./macbook.png";
import pcImg from "./pc.png";
import phoneImg from "./phone.png";

const Header = () => {
  const router = useRouter();

  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: headphoneImg,
      category: "Sale",
      productId: "6983cc17ce422f42ccd05bad",
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: playstationImg,
      category: "Sale",
      productId: "697bfd682f76095a39942689",
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      offer: "Exclusive Deal 40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: macbookImg,
      category: "Sale",
      productId: "698545bc29d137fabeba01b7",
    },
    {
      id: 4,
      title: "Unleash Ultimate Performance - Gaming Laptop Built for Winners!",
      offer: "Special Discount 30% Off",
      buttonText1: "Get Yours",
      buttonText2: "See Details",
      imgSrc: pcImg,
      category: "Sale",
      productId: "698549a829d137fabeba01c9",
    },
    {
      id: 5,
      title: "Stay Connected in Style - Samsung Galaxy S23 Awaits!",
      offer: "Amazing Deal 20% Off",
      buttonText1: "Buy Now",
      buttonText2: "View Features",
      imgSrc: phoneImg,
      category: "Sale",
      productId: "69854a7429d137fabeba01d2",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handlePrimaryClick = (slide) => {
    if (slide.productId) {
      router.push(`/product/${slide.productId}`);
    } else if (slide.category) {
      router.push(
        `/all-products?category=${encodeURIComponent(slide.category)}`,
      );
    } else {
      router.push("/all-products");
    }
  };

  const handleSecondaryClick = (slide) => {
    if (slide.category) {
      router.push(
        `/all-products?category=${encodeURIComponent(slide.category)}`,
      );
    } else {
      router.push("/all-products");
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.sliderWrapper}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}>
        {sliderData.map((slide, index) => (
          <div key={slide.id} className={styles.slide}>
            <div className={styles.textContent}>
              <p className={styles.offer}>{slide.offer}</p>
              <h1 className={styles.title}>{slide.title}</h1>
              <div className={styles.buttonGroup}>
                <button
                  onClick={() => handlePrimaryClick(slide)}
                  className={`${styles.primaryButton} focus:outline-none focus:ring-0`}>
                  {slide.buttonText1}
                </button>
                <button
                  onClick={() => handleSecondaryClick(slide)}
                  className={`${styles.secondaryButton} focus:outline-none focus:ring-0`}>
                  {slide.buttonText2}
                  <Image
                    className={styles.arrowIcon}
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>
            <div className={styles.imageContainer}>
              <Image
                className={styles.productImage}
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dotsContainer}>
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`${styles.dot} ${
              currentSlide === index ? styles.dotActive : styles.dotInactive
            }`}></div>
        ))}
      </div>
    </div>
  );
};

export default Header;
