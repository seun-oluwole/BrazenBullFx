import { HiArrowUpTray, HiOutlineCube } from "react-icons/hi2";
import { PiPaperPlaneTilt } from "react-icons/pi";
import { NavLink } from "react-router";
import styles from "./quicklinks.module.css";

export default function QuickLinks() {
  return (
    <div className={styles.quicklinkContainer}>
      <NavLink to="/dashboard/transactions" className={styles.quicklink}>
        <div className={styles.iconContainer}>
          <HiArrowUpTray className={styles.quicklinkIcon} />
          <span className={styles.iconLabel}>Deposit</span>
        </div>
      </NavLink>
      <NavLink to="/dashboard/investment" className={styles.quicklink}>
        <div className={styles.iconContainer}>
          <HiOutlineCube className={styles.quicklinkIcon} />
          <span className={styles.iconLabel}>Investment</span>
        </div>
      </NavLink>
      <NavLink to="/dashboard/transactions" className={styles.quicklink}>
        <div className={styles.iconContainer}>
          <PiPaperPlaneTilt className={styles.quicklinkIcon} />
          <span className={styles.iconLabel}>Withdrawal</span>
        </div>
      </NavLink>
    </div>
  );
}
