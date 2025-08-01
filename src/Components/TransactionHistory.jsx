import styles from "./transactionhistory.module.css";
import TransactionList from "./TransactionList";

export default function TransactionHistory() {
  return (
    <div>
      <h3 className={styles.subtitle}>Transaction History</h3>
      <div className={styles.historyContainer}>
        <TransactionList />
      </div>
    </div>
  );
}
