import { useAdmin } from "../context/AdminContext";
import styles from "../Components/withdrawcontentcontainer.module.css";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import handleCopyToClipboard from "../Utils/copyToClipboard";

export default function WithdrawContentContainer({ closeModal }) {
  const { investorTransDetail } = useAdmin();
  const isCrypto = investorTransDetail?.transaction_method === "Crypto";
  const isGcash = investorTransDetail?.transaction_method === "Gcash";
  const isBank = investorTransDetail?.transaction_method === "Bank";

  const accountName = investorTransDetail?.withdrawal_account_name;
  const accountNumber = investorTransDetail?.withdrawal_account_number;
  const bankName = investorTransDetail?.withdrawal_bank_name;
  const cryptoAddress = investorTransDetail?.withdrawal_crypto_address;
  const cryptoCurrency = investorTransDetail?.withdrawal_cryptocurrency;

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.title}>Withdawal Details</h3>
      {isGcash && (
        <div className={styles.container}>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(accountName)}>
            {accountName}
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(accountNumber)}>
            {accountNumber}
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
        </div>
      )}
      {isBank && (
        <div className={styles.container}>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(accountName)}>
            {accountName}
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(accountNumber)}>
            {accountNumber}
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(bankName)}>
            {bankName}
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
        </div>
      )}
      {isCrypto && (
        <div className={styles.container}>
          <div className={styles.withdrawDetails}>{`${cryptoCurrency} (ERC-20)`}</div>
          <div className={styles.withdrawDetails} onClick={() => handleCopyToClipboard(cryptoAddress)}>
            <div className={styles.cryptoAddress}> {cryptoAddress}</div>
            <span className={styles.iconContainer}>
              <HiOutlineClipboardDocument className={styles.icon} />
            </span>
          </div>
        </div>
      )}

      <button className={styles.button} onClick={closeModal}>
        Close
      </button>
    </div>
  );
}
