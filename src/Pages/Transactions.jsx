import ViewContainer from "../Components/ViewContainer";
import WithdrawableBalance from "../Components/WithdrawableBalance";
import styles from "./transactions.module.css";
import TransactionHistory from "../Components/TransactionHistory";
import toast from "react-hot-toast";

export default function Transactions({ setIsDepositModalOpen, setIsWithdrawModalOpen }) {
  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Transactions</h1>
        <div className={styles.container}>
          <WithdrawableBalance
            setIsDepositModalOpen={setIsDepositModalOpen}
            setIsWithdrawModalOpen={setIsWithdrawModalOpen}
          />
        </div>
        <TransactionHistory />
      </div>
    </ViewContainer>
  );
}
