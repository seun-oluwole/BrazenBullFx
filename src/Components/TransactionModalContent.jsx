import { useWallet } from "../context/WalletContextProvider";
import LoadingSvg from "./LoadingSvg";
import styles from "../Components/transactionmodal.module.css";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import Status from "./Status";
import moment from "moment";

export default function TransactionModalContent({ closeModal }) {
  const { fetchingTransaction, transactionDetail } = useWallet();
  const { transaction_title, transaction_amount, transaction_method, transaction_status, created_at } =
    transactionDetail || "";

  console.log(transactionDetail);
  if (fetchingTransaction)
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSvg width={55} height={55} />
      </div>
    );
  return (
    <>
      {transactionDetail ? (
        <div className={styles.mainContainer}>
          <div className={styles.contentContainer}>
            <div className={styles.iconContainer}>
              {transaction_title === "Deposit" ? <HiArrowDown className={styles.icon} /> : ""}
              {transaction_title === "Withdraw" ? <HiArrowUp className={styles.icon} /> : ""}
            </div>
            <h2 className={styles.methodTitle}>{transaction_title}</h2>
            <div className={styles.amount}>{`$${transaction_amount}`}</div>
            <div className={styles.status}>
              <Status status={transaction_status} />
            </div>
          </div>

          <div className={styles.transactionDetails}>
            <div className={styles.transactionMethod}><span>{transaction_title} Method: </span>{`${transaction_method}`}</div>
            <div className={styles.transactionTime}><span>Transaction Date: </span>{`${moment(created_at).format('MMM Do, h:mm:ss A')}`}</div>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={closeModal}>Close</button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
