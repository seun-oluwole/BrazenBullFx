import ViewContainer from "../Components/ViewContainer";
import WithdrawableBalance from "../Components/WithdrawableBalance";
import styles from "./transactions.module.css";

export default function Transactions() {
  return (
    <ViewContainer>
      <h1 className={styles.title}>Transactions</h1>
      <div className={styles.container}>
        <WithdrawableBalance />
      </div>
      <div>
        <h3 className={styles.subtitle}>Transaction History</h3>
        <div className={styles.historyContainer}></div>
      </div>
    </ViewContainer>
  );
}
