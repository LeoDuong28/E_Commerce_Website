import Image from "next/image";
import Link from "next/link";
import { assets } from "@/assets/assets";

import headsetImg from "./headset.png";
import controllerImg1 from "./xbox_controller.png";
import controllerImg2 from "./playstation_controller.png";

import styles from "./Banner.module.css";

const Banner = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.floatConsole} aria-hidden="true">
        <Image
          src={controllerImg2}
          alt=""
          className={styles.floatImg}
          priority
        />
      </div>

      <div className={styles.left}>
        <Image
          src={headsetImg}
          alt="Headset"
          className={styles.leftImg}
          priority
        />
      </div>

      <div className={styles.center}>
        <h2 className={styles.title}>
          Level Up
          <br />
          Your Gaming
          <br />
          Experience
        </h2>

        <p className={styles.subtitle}>
          From immersive sound to precise controls - everything you need to win
          is here!!!
        </p>

        <Link href="/all-products?category=Gaming" className={styles.button}>
          Buy now
          <Image
            src={assets.arrow_icon_white}
            alt=""
            className={styles.arrow}
          />
        </Link>
      </div>

      <div className={styles.right}>
        <Image
          src={controllerImg1}
          alt="Game controller"
          className={styles.rightImg}
          priority
        />
      </div>
    </section>
  );
};

export default Banner;
