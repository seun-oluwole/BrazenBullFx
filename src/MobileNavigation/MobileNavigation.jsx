import styles from "./mobilenavigation.module.css";

export default function MobileNavigation({ children }) {
  return (
    <nav className={styles.mainContainer}>
      { children }
    </nav>
  );
}
