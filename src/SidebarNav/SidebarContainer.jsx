import styles from "./sidebarnav.module.css";
export default function SidebarContainer({ children }) {
  return <nav className={styles.sidebarMainContainer}>{children}</nav>;
}
