import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProducts.module.css";

import headphoneImg from "./featuredHeadphone.png";
import pcImg from "./featuredPc.png";
import consolesImg from "./featuredConsoles.jpg";
import appleImg from "./featuredApple.png";

const products = [
  {
    id: 1,
    image: headphoneImg,
    tag: "Audio",
    category: "Audio",
    title: "Unparalleled Sound",
    description: "Premium headphones with crystal-clear audio and deep bass.",
    accent: "#8b5cf6",
  },
  {
    id: 2,
    image: pcImg,
    tag: "PC Gaming",
    category: "Gaming",
    title: "Built for Power",
    description: "High-performance gear for gaming and creativity.",
    accent: "#06b6d4",
  },
  {
    id: 3,
    image: consolesImg,
    tag: "Consoles",
    category: "Consoles",
    title: "Level Up",
    description: "Console gear for immersive gameplay experiences.",
    accent: "#10b981",
  },
  {
    id: 4,
    image: appleImg,
    tag: "Apple",
    category: "Apple",
    title: "Pure Innovation",
    description: "Elegant devices for a seamless connected life.",
    accent: "#f43f5e",
  },
];

const FeaturedProducts = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>Curated Selection</span>
        <h2 className={styles.heading}>Featured Products</h2>
        <p className={styles.subheading}>
          Discover our handpicked collection of premium tech
        </p>
      </div>

      <div className={styles.showcase}>
        {products.map(({ id, image, tag, category, title, description, accent }, index) => (
          <Link
            key={id}
            href={`/all-products?category=${encodeURIComponent(category)}`}
            className={styles.card}
            style={{ "--accent": accent }}
          >
            <div className={styles.imageContainer}>
              <Image
                src={image}
                alt={title}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 85vw, (max-width: 1024px) 45vw, 280px"
                priority={index < 2}
              />
              <div className={styles.imageOverlay} />
            </div>

            <div className={styles.cardContent}>
              <span className={styles.tag}>{tag}</span>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>

              <span className={styles.button}>
                <span>Shop Now</span>
                <svg
                  className={styles.arrow}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            <div className={styles.accentBar} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
