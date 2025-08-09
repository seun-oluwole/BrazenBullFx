import { useAdmin } from "../context/AdminContext";
import { SelectTransactionStatus } from "./Selectors";
import LoadingSvg from "./LoadingSvg";
import styles from "../Components/transactionhistorycontainer.module.css";
import DepositContentContainer from "./DepositContentContainer";
import { useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import WithdrawContentContainer from "./WithdrawContentContainer";

export default function TransactionHistoryContainer({ closeModal }) {
const [transactionStatus, setTransactionStatus] = useState("");
const [updatingStatus, setUpdatingStatus] = useState(false)
const {  investorTransDetail, fetchingInvestorTransDetail, transDetailError } = useAdmin();
const title = investorTransDetail?.transaction_title;
const status = investorTransDetail?.transaction_status;
const amount = investorTransDetail?.transaction_amount;
const method = investorTransDetail?.transaction_method;
const transactionId = investorTransDetail?.id

const updateTransactionStatus = async (id) => {
  if (!id) return
  setUpdatingStatus(true)
  try {
     const { error } = await supabase
    .from("transactions")
    .update({
      transaction_status: transactionStatus
    })
    .eq("id", id)

    if (error) throw new Error(error)
    toast.success("Updated successfully")
  } catch (error) {
    toast.error("Error: Failed to update status")
  } finally {
    setUpdatingStatus(false)
  }
}

const handleSelectStatus = (e) => {
  setTransactionStatus(e.target.value)
}

if (fetchingInvestorTransDetail) return <div className={styles.spinnerContainer}><LoadingSpinner width={55} height={55}/></div>
if (!investorTransDetail && transDetailError) return <div>Sorry, something went wrong!</div>

return (
  <div className={styles.mainContainer}>
    <div className={styles.inputContainer}>
      <SelectTransactionStatus value={transactionStatus} handleInput={handleSelectStatus}/>
      <button className={styles.button} onClick={() => updateTransactionStatus(transactionId)}>
       {!updatingStatus ? "Update" : <LoadingSvg width={25} height={25} color="000"/>}
      </button>
    </div>
    <div className={styles.detailContainer}>
      <table>
        <thead>
         <tr>
          <th>Type</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Method</th>
         </tr>
        </thead>
        <tbody>
          <tr>
            <td>{title}</td>
            <td>{status}</td>
            <td>{amount}</td>
            <td>{method}</td>
          </tr>
        </tbody>
      </table>
    </div>
  {title === "Deposit" ? <DepositContentContainer closeModal={closeModal}/> : null}
  {title === "Withdraw" ? <WithdrawContentContainer closeModal={closeModal}/> : null}
  </div>
)
  
}