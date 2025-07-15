import { NavLink } from "react-router";
import SidebarContainer from "../SidebarNav/SidebarContainer";
import {
  HiArrowRightEndOnRectangle,
  HiCog6Tooth,
  HiHome,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineUserGroup,
  HiUserGroup,
} from "react-icons/hi2";
import styles from "../SidebarNav/sidebarnav.module.css";

export default function AdminSideBar() {
  return (
    <SidebarContainer>
      <div className={styles.sidebarContentContainer}>
        <NavLink to="/admin/dashboard" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? <HiHome className={styles.navIcon} /> : <HiOutlineHome className={styles.navIcon} />}
              <span className={styles.iconLabel}>Dashboard</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/investors" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? (
                <HiUserGroup className={styles.navIcon} />
              ) : (
                <HiOutlineUserGroup className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Investors</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/settings" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? (
                <HiCog6Tooth className={styles.navIcon} />
              ) : (
                <HiOutlineCog6Tooth className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Settings</span>
            </div>
          )}
        </NavLink>

        <div className={`${styles.iconContainer} ${styles.logout}`} onClick={() => setIsModalOpen(true)}>
          <HiArrowRightEndOnRectangle className={styles.navIcon} />
          <span className={styles.iconLabel}>Logout</span>
        </div>
      </div>
    </SidebarContainer>
  );
}
