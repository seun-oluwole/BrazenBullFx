import ViewContainer from "../Components/ViewContainer";
import WithdrawableBalance from "../Components/WithdrawableBalance";
import TransactionHistory from "../Components/TransactionHistory";
import styles from "./transactions.module.css";

export default function Transactions() {
  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Transactions</h1>
        <div className={styles.container}>
          <WithdrawableBalance />
        </div>
        <TransactionHistory />
      </div>
    </ViewContainer>
  );
}
