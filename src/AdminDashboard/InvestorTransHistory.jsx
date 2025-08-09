import styles from "../AdminDashboard/investortranshistory.module.css";
import TransactionHistoryList from "./TransactionHistoryList";

export default function InvestorTransHistory() {
  return (
    <div className={styles.mainContainer}>
      <h2 className={styles.title}>Transaction History</h2>
      <div className={styles.container}>
        <TransactionHistoryList />
      </div>
    </div>
  );
}
