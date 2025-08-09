import LoadingSvg from "../Components/LoadingSvg";
import { useEffect } from "react";
import { HiArrowDown, HiArrowUp, HiChevronRight } from "react-icons/hi2";
import { useAdmin } from "../context/AdminContext";
import { useModal } from "../context/modalContext";
import { supabase } from "../Utils/supabaseClient";
import moment from "moment";
import Status from "../Components/Status";
import styles from "../AdminDashboard/transactionhistorylist.module.css";


export default function TransactionHistoryList() {
  const { allTransactions, setAllTransactions, fetchingInvestorTrans, fetchingTransError, fetchInvestorTransDetail } = useAdmin();
  const { setIsTransHistoryModal } = useModal();

  //Listening for updates from supabase in realtime and updating the states...
  let payloadUpdate;
  useEffect(() => {
    supabase
    .channel('generating-details')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'transactions' }, 
      payload => {
      payloadUpdate = payload
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

    return () => supabase.removeChannel('generating-details').then()
  }, [payloadUpdate]);

  const handleTransactionDetail = async (id) => {
    setIsTransHistoryModal(true);
    await fetchInvestorTransDetail(id);
  };

  if (fetchingInvestorTrans) return (<div className={styles.spinnerContainer}><LoadingSvg width={30} height={30} /></div>);
  if (allTransactions.length <= 0 && fetchingTransError) return <div className={styles.error}>Check your connection and try again.</div>;
  return (
    <>
      {allTransactions.length > 0 ? (
        <table className={styles.table}>
          <tbody>
            {allTransactions
            .sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())
            .map(
              (
                { transaction_title, transaction_amount, transaction_method, transaction_status, created_at, id },
                index
              ) => (
                <tr className={styles.bodyRow} key={index} onClick={() => handleTransactionDetail(id)}>
                  <td className={styles.bodyTitle}>
                    <div className={styles.iconContainer}>
                      {transaction_title === "Deposit" ? <HiArrowDown className={styles.icon} /> : ""}
                      {transaction_title === "Withdraw" ? <HiArrowUp className={styles.icon} /> : ""}
                    </div>
                    <div className={styles.titleContainer}>
                      <div className={styles.transactionTitle}>{transaction_title}</div>
                      <div className={styles.time}>{moment(created_at).format("MMM Do, h:mm:ss A")}</div>
                    </div>
                  </td>
                  <td className={styles.bodyCell}>
                    <div className={styles.amountContainer}>
                      <div className={styles.amount}>{`$${transaction_amount.toLocaleString()}`}</div>
                      <Status status={transaction_status} height={19} fontSize={0.7} />
                    </div>
                  </td>
                  <td className={styles.bodyMethod}>
                    {transaction_method}
                    <HiChevronRight />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <div className={styles.empty}>No transaction yet.</div>
      )}
    </>
  );
}
