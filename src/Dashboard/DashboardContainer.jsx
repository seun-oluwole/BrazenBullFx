import styles from "./dashboardcontainer.module.css";

export default function DashboardContainer({ children }) {
  return (
    <div className={styles.dashboardContainer}>
    {children}
    </div>
  )
};
