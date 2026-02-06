"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import styles from "./Subscribe.module.css";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing!");
    setEmail("");
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Subscribe Now and Get 15% Off</h1>

      <p className={styles.subtitle}>
        Enter your email to get discount for every items in your first order.
      </p>

      <form className={styles.form} onSubmit={handleSubscribe}>
        <input
          className={styles.input}
          type="email"
          placeholder="Enter Your Email Here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className={styles.button}>Subscribe</button>
      </form>
    </div>
  );
}
