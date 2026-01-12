import React, { useState, useEffect } from "react";
import Image from "next/image";
import headphoneImg from "./headphone.png";
import playstationImg from "./playstation.png";
import macbookImg from "./macbook.png";
import pcImg from "./pc.png";
import phoneImg from "./phone.png";
import styles from "./Header.module.css";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      offer: "Limited Time Offer 30% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: headphoneImg,
      imgSize: "headphone",
    },
    {
      id: 2,
      title: "Experience Next-Gen Gaming - Your Ultimate Play Starts Here!",
      offer: "Hurry up only few lefts!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: playstationImg,
      imgSize: "playstation",
    },
    {
      id: 3,
      title: "Experience Pro-Level Performance - Power Your Best Work Yet!",
      offer: "Exclusive Deal 10% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: macbookImg,
      imgSize: "macbook",
    },
    {
      id: 4,
      title: "Experience Extreme Performance - Built for Victory and Speed!",
      offer: "Flash Sale 20% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: pcImg,
      imgSize: "pc",
    },
    {
      id: 5,
      title: "Experience Smart Innovation - The Future in Your Hands!",
      offer: "Quick, Limited Amounts!",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: phoneImg,
      imgSize: "phone",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {sliderData.map((slide, index) => (
          <div key={slide.id} className={styles.slide}>
            <div className={styles.text}>
              <p className={styles.offer}>{slide.offer}</p>
              <h1 className={styles.title}>{slide.title}</h1>

              <div className={styles.actions}>
                <button className={styles.primaryBtn}>
                  {slide.buttonText1}
                </button>

                <button className={styles.secondaryBtn}>
                  {slide.buttonText2}
                  <Image
                    className={styles.arrow}
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>

            <div className={styles.imageWrap}>
              <Image
                className={styles[slide.imgSize]}
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`${styles.dot} ${
              currentSlide === index ? styles.dotActive : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
