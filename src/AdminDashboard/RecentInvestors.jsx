import SpiralSpinner from "../Components/SpiralSpinner";
import { useAdmin } from "../context/AdminContext";
import styles from "./recentinvestors.module.css";
import RecentInvestorsList from "./RecentInvestorsList";

export default function RecentInvestors() {
  const { isFetchingInvestors } = useAdmin();

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recent Investors</h3>
      <div className={styles.listContainer}>
        {isFetchingInvestors ? (
          <div className={styles.spiralContainer}>
            <SpiralSpinner width={30} height={30} />{" "}
          </div>
        ) : (
          <RecentInvestorsList />
        )}
      </div>
    </div>
  );
}
