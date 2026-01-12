import React from "react";
import styles from "./NewsLetter.module.css";

export default function NewsLetter() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Subscribe Now and Get 15% Off</h1>

      <p className={styles.subtitle}>
        Enter your email to get discount for every items in your first order.
      </p>

      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter Your Email Here"
        />
        <button className={styles.button}>Subscribe</button>
      </div>
    </div>
  );
}
