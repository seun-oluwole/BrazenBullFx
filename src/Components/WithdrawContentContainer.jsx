import { useAdmin } from "../context/AdminContext";
import styles from "../Components/withdrawcontentcontainer.module.css";

export default function WithdrawContentContainer({ closeModal }) {
  const { investorTransDetail } = useAdmin();
  const isCrypto = investorTransDetail?.transaction_method === "Crypto"
  const isGcash = investorTransDetail?.transaction_method === "Gcash"
  const isBank = investorTransDetail?.transaction_method === "Bank"
  
  const accountName = investorTransDetail?.withdrawal_account_name
  const accountNumber = investorTransDetail?.withdrawal_account_number
  const bankName = investorTransDetail?.withdrawal_bank_name
  const cryptoAddress = investorTransDetail?.withdrawal_crypto_address
  const cryptoCurrency = investorTransDetail?.withdrawal_cryptocurrency

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.title}>Withdawal Details</h3>
      {isGcash && (
        <>
          <div>{accountName}</div>
          <div>{accountNumber}</div>
        </>
      )}
      {isBank && (
        <>
          <div>{accountName}</div>
          <div>{accountNumber}</div>
          <div>{bankName}</div>
        </>
      )}
      {isCrypto && (
        <>
          <div>{cryptoCurrency}</div>
          <div>{cryptoAddress}</div>
        </>
      )}

      <button className={styles.button} onClick={closeModal}>Close</button>
    </div>
  )
}