import { NavLink } from "react-router";
import {
  HiArrowRightEndOnRectangle,
  HiArrowsUpDown,
  HiCog6Tooth,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineWallet,
  HiWallet,
} from "react-icons/hi2";
import styles from "./sidebarnav.module.css";
import SidebarContainer from "./SidebarContainer";
import { useModal } from "../context/ModalContext";

export default function SidebarNav() {
  const { setIsLogoutModalOpen } = useModal();
  return (
    <SidebarContainer>
      <div className={styles.sidebarContentContainer}>
        <NavLink to="/dashboard/wallet" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? <HiWallet className={styles.navIcon} /> : <HiOutlineWallet className={styles.navIcon} />}
              <span className={styles.iconLabel}>Wallet</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/dashboard/transactions" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? <HiArrowsUpDown className={styles.navIcon} /> : <HiArrowsUpDown className={styles.navIcon} />}
              <span className={styles.iconLabel}>Transactions</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/dashboard/investment" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div className={`${styles.iconContainer} ${isActive ? `${styles.active}` : ""}`}>
              {isActive ? <HiOutlineCube className={styles.navIcon} /> : <HiOutlineCube className={styles.navIcon} />}
              <span className={styles.iconLabel}>Investment</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/dashboard/settings" className={styles.navLinkContainer}>
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

        <div className={`${styles.iconContainer} ${styles.logout}`} onClick={() => setIsLogoutModalOpen(true)}>
          <HiArrowRightEndOnRectangle className={styles.navIcon} />
          <span className={styles.iconLabel}>Logout</span>
        </div>
      </div>
    </SidebarContainer>
  );
}
