import {
  HiArrowRightEndOnRectangle,
  HiArrowsUpDown,
  HiChatBubbleLeftEllipsis,
  HiCog6Tooth,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineWallet,
  HiWallet,
} from "react-icons/hi2";
import { NavLink } from "react-router";
import styles from "./sidebarnav.module.css";

export default function SidebarNav() {
  return (
    <nav className={styles.sidebarMainContainer}>
      <div className={styles.sidebarContentContainer}>
        <NavLink to="/dashboard/wallet" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div
              className={`${styles.iconContainer} ${
                isActive ? `${styles.active}` : ""
              }`}
            >
              {isActive ? (
                <HiWallet className={styles.navIcon} />
              ) : (
                <HiOutlineWallet className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Wallet</span>
            </div>
          )}
        </NavLink>

        <NavLink
          to="/dashboard/transactions"
          className={styles.navLinkContainer}
        >
          {({ isActive }) => (
            <div
              className={`${styles.iconContainer} ${
                isActive ? `${styles.active}` : ""
              }`}
            >
              {isActive ? (
                <HiArrowsUpDown className={styles.navIcon} />
              ) : (
                <HiArrowsUpDown className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Transactions</span>
            </div>
          )}
        </NavLink>

        <NavLink to="/dashboard/investment" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div
              className={`${styles.iconContainer} ${
                isActive ? `${styles.active}` : ""
              }`}
            >
              {isActive ? (
                <HiOutlineCube className={styles.navIcon} />
              ) : (
                <HiOutlineCube className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Investment</span>
            </div>
          )}
          
        </NavLink>

        {/* <NavLink to="/dashboard/support" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div
              className={`${styles.iconContainer} ${
                isActive ? `${styles.active}` : ""
              }`}
            >
              {isActive ? (
                <HiChatBubbleLeftEllipsis className={styles.navIcon} />
              ) : (
                <HiOutlineChatBubbleLeftEllipsis className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Support</span>
            </div>
          )}
        </NavLink> */}

        <NavLink to="/dashboard/settings" className={styles.navLinkContainer}>
          {({ isActive }) => (
            <div
              className={`${styles.iconContainer} ${
                isActive ? `${styles.active}` : ""
              }`}
            >
              {isActive ? (
                <HiCog6Tooth className={styles.navIcon} />
              ) : (
                <HiOutlineCog6Tooth className={styles.navIcon} />
              )}
              <span className={styles.iconLabel}>Settings</span>
            </div>
          )}
        </NavLink>

        <div className={`${styles.iconContainer} ${styles.logout}`}>
            <HiArrowRightEndOnRectangle className={styles.navIcon} />
            <span className={styles.iconLabel}>Logout</span>
          </div>
      </div>
    </nav>
  );
}
