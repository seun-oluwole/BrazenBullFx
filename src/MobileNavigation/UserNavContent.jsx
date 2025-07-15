import {
  HiArrowsUpDown,
  HiCog6Tooth,
  HiOutlineCog6Tooth,
  HiOutlineWallet,
  HiWallet,
} from "react-icons/hi2";
import { NavLink } from "react-router";
import styles from "./mobilenavigation.module.css";

export default function UserNavContent() {
  return (
    <div className={styles.contentContainer}>
      <NavLink to="/dashboard/wallet" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiWallet className={styles.navIcon} /> : <HiOutlineWallet className={styles.navIcon} />}
          </div>
        )}
      </NavLink>

      <NavLink to="/dashboard/transactions" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiArrowsUpDown className={styles.navIcon} /> : <HiArrowsUpDown className={styles.navIcon} />}
          </div>
        )}
      </NavLink>

      <NavLink to="/dashboard/settings" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiCog6Tooth className={styles.navIcon} /> : <HiOutlineCog6Tooth className={styles.navIcon} />}
          </div>
        )}
      </NavLink>
    </div>
  );
}
