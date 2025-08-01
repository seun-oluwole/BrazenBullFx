import moment from "moment";
import styles from "../Components/transactionlist.module.css";
import { useWallet } from "../context/WalletContextProvider";
import LoadingSpinner from "./LoadingSpinner";
import LoadingSvg from "./LoadingSvg";
import { HiArrowDown, HiArrowUp, HiChevronRight } from "react-icons/hi2";
import { useModal } from "../context/modalContext";

export default function TransactionList() {
  const { allTransactions, fetchingAllTransactions, fetchingTransError, fetchTransaction } = useWallet();
  const { setIsTransactionModal } = useModal()

  const handleTransactionDetail = async (id) => {
    setIsTransactionModal(true)
    await fetchTransaction(id)
  }

  if (fetchingAllTransactions)
    return (
      <div className={styles.loading}>
        <LoadingSpinner width={45} height={45} />
      </div>
    );
  if (fetchingTransError)
    return <div className={styles.error}>{fetchingTransError ? "Something went wrong! Try again." : ""}</div>;

  
  return (
    <div className={styles.mainContainer}>
      {!fetchingTransError ? (
         <>
        {allTransactions.length > 0 ? (
          <table className={styles.table}>
            <tbody>
              {allTransactions.map(({transaction_title, transaction_amount, transaction_method, transaction_status, created_at, id}, index) => (
                <tr className={styles.bodyRow} key={index} onClick={() => handleTransactionDetail(id)}>
                  <td className={styles.bodyTitle}>
                    <div className={styles.iconContainer}>
                      {transaction_title === "Deposit" ? (<HiArrowDown className={styles.icon}/>) : ""}
                      {transaction_title === "Withdraw" ? (<HiArrowUp className={styles.icon}/>) : ""}
                    </div>
                    <div className={styles.titleContainer}>
                      <div className={styles.transactionTitle}>{transaction_title}</div>
                      <div className={styles.time}>{moment(created_at).format('MMM Do, h:mm:ss A')}</div>
                    </div>
                  </td>
                  <td className={styles.bodyCell}>
                    <div className={styles.amountContainer}>
                      <div className={styles.amount}>{`$${transaction_amount.toLocaleString()}`}</div>
                      <div className={styles.status}>{transaction_status}</div>
                    </div>
                  </td>
                  <td className={styles.bodyMethod}>{transaction_method}
                    <HiChevronRight />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>No transaction yet.</div>
        )}
      </>
      ) : "Something went wrong! Try again."
      }
    </div>
  );
}
