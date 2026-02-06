import Image from "next/image";
import Link from "next/link";
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
            Your trusted destination for premium gaming gear, audio equipment,
            and tech accessories. Quality products, competitive prices, and
            exceptional service.
          </p>
        </div>

        <div className={styles.column}>
          <h2>Company</h2>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Support</h2>
          <ul>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/all-products">Shop</Link>
            </li>
            <li>
              <Link href="/my-orders">Track Order</Link>
            </li>
            <li>
              <Link href="/contact">Help Center</Link>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h2>Contact</h2>
          <p>+1 (424) 397-4074</p>
          <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
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
            href="https://www.linkedin.com/in/leo-duong-la/"
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
