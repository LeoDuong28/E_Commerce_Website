import React from "react";
import Image from "next/image";
import styles from "./FeaturedProducts.module.css";

import headphoneImg from "./featuredHeadphone.webp";
import pcImg from "./featuredPc.png";
import consolesImg from "./featuredConsoles.jpg";
import appleImg from "./featuredApple.png";

const products = [
  {
    id: 1,
    image: headphoneImg,
    title: "Unparalleled Sound",
    description:
      "Experience crystal-clear audio and deep bass with premium earphones and headphones.",
  },
  {
    id: 2,
    image: pcImg,
    title: "Built for Performance",
    description:
      "Upgrade your setup with high-performance PC gear designed for work, gaming, and creativity.",
  },
  {
    id: 3,
    image: consolesImg,
    title: "Level Up Your Gaming",
    description:
      "Discover console gear that enhances speed, comfort, and immersive gameplay.",
  },
  {
    id: 4,
    image: appleImg,
    title: "Seamless Innovation",
    description:
      "Explore Apple gear crafted for power, simplicity, and a perfectly connected experience.",
  },
];

const FeaturedProduct = () => {
  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <p className={styles.heading}>Featured Products</p>
        <div className={styles.underline} />
      </header>

      <div className={styles.grid}>
        {products.map(({ id, image, title, description }) => (
          <article key={id} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={image}
                alt={title}
                className={styles.image}
                priority={id === 1}
              />
              <div className={styles.overlay} />
            </div>

            <div className={styles.content}>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>

              <button className={styles.button} type="button">
                Buy now
                <Image
                  className={styles.redirectIcon}
                  src={assets.redirect_icon}
                  alt="Redirect Icon"
                />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProduct;
