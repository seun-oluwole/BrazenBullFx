import { NavLink } from "react-router";
import {
  HiCog6Tooth,
  HiHome,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiUserGroup,
} from "react-icons/hi2";
import styles from "../MobileNavigation/mobilenavigation.module.css";

export default function AdminNavContent() {
  return (
    <div className={styles.contentContainer}>
      <NavLink to="/admin/dashboard" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiHome className={styles.navIcon} /> : <HiOutlineHome className={styles.navIcon} />}
          </div>
        )}
      </NavLink>

      <NavLink to="/admin/investors" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiUserGroup className={styles.navIcon} /> : <HiOutlineUserGroup className={styles.navIcon} />}
          </div>
        )}
      </NavLink>

      <NavLink to="/admin/settings" className={styles.navLinkContainer}>
        {({ isActive }) => (
          <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
            {isActive ? <HiCog6Tooth className={styles.navIcon} /> : <HiOutlineCog6Tooth className={styles.navIcon} />}
          </div>
        )}
      </NavLink>
    </div>
  );
}
