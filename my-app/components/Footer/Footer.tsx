import Image from "next/image";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiIndeed } from "react-icons/si";
import { assets } from "@/assets/assets";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Image
            src={assets.logo}
            alt="Leo Duong logo"
            className={styles.logo}
            priority
          />
          <p>
            Boosted user conversions by 20% by developing a full-stack shopping
            platform with React, Node.js, MongoDB, and Stripe. Implemented
            secure authentication and checkout flows, improving reliability and
            usability.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Company</h2>
          <ul>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Contact Information</h2>
          <p>+1-424-397-4074</p>
          <a href="mailto:duongtrongnghia287@gmail.com">
            duongtrongnghia287@gmail.com
          </a>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p>
          Developed and Designed by{" "}
          <span className={styles.name}>Leo Duong</span>
        </p>

        <p className={styles.copy}>© {year} LD</p>

        <div className={styles.socials}>
          <a
            href="https://github.com/LeoDuong28"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/leo-duong-836334280"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin />
          </a>

          <a
            href="https://profile.indeed.com/p/leod-wp087hl"
            aria-label="Indeed"
            target="_blank"
            rel="noopener noreferrer">
            <SiIndeed />
          </a>
        </div>
      </div>
    </footer>
  );
}
