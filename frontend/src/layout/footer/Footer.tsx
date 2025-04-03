import React from "react";
import styles from "./Footer.module.scss"; // Import CSS module

const Footer = () => (
  <footer className={styles.footer}>
    {/* Displays the current year dynamically */}
    &copy; {new Date().getFullYear()} Post Management System
  </footer>
);

export default Footer;
