import LoadingSpinner from "./LoadingSpinner";
import Status from "./Status";
import { useWallet } from "../context/WalletContextProvider";
import { HiArrowDown, HiArrowUp, HiChevronRight } from "react-icons/hi2";
import { useModal } from "../context/modalContext";
import { useEffect } from "react";
import { supabase } from "../Utils/supabaseClient";
import moment from "moment";
import styles from "../Components/transactionlist.module.css";

export default function TransactionList() {
  const { allTransactions, setAllTransactions, fetchingAllTransactions, fetchingTransError, fetchTransaction, setTransactionDetail, handleNextStep } = useWallet();
  const { setIsTransactionModal, setIsDepositModalOpen } = useModal()

  // Listening for updates from supabase in realtime and updating the states...
  let payloadUpdate;
  useEffect(() => {
    supabase
    .channel('generating-details')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'transactions' }, 
      payload => {
      payloadUpdate = payload
      setTransactionDetail(payload.new)
      if (payload.eventType === "INSERT") {
        setAllTransactions((prev) => ([
        ...prev,
        payload.new
        ]))
      } else if (payload.eventType === "UPDATE"){
        setAllTransactions((prev) => prev
          .map((item) => item.id === payload.new.id 
          ? { ...item, ...payload.new }
          : item));
      }
      else if (payload.eventType === "DELETE") {
        setAllTransactions((prev) => prev
        .filter((item) => item.id !== payload.old.id));
      }
    }).subscribe()

    return () => supabase
    .removeChannel('generating-details')
    .then()
  }, [payloadUpdate]);


  const handleTransactionDetail = async (id, status, title) => {
    if (status === "pending" && title === "Deposit") {
      setIsDepositModalOpen(true)
      handleNextStep()
      setTransactionDetail(async () => await fetchTransaction(id))
    } else {
      setIsTransactionModal(true)
      await fetchTransaction(id)
    }
  }

  if (fetchingAllTransactions) return ( <div className={styles.spinnerContainer}><LoadingSpinner width={45} height={45} /></div>);
  if (allTransactions.length <= 0 && fetchingTransError)return <div className={styles.error}>{fetchingTransError ? "Check your connection and try again." : ""}</div>; 
  return (
    <div className={styles.mainContainer}>
      <>
        {allTransactions.length > 0 ? (
          <table className={styles.table}>
            <tbody>
              {allTransactions
              .sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())
              .map(({transaction_title, transaction_amount, transaction_method, transaction_status, created_at, id}, index) => (
                <tr className={styles.bodyRow} key={index} onClick={() => handleTransactionDetail(id, transaction_status, transaction_title)}>
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
                      <Status status={transaction_status} height={19} fontSize={0.7}/>
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
    </div>
  );
}
