import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useWallet } from "../context/WalletContextProvider";
import styles from "./balancecard.module.css";

export default function BalanceCard({ balanceTitle, balanceAmount }) {
  const { balanceCurrency, cryptocurrency, showBalance, toggleShowBalance } = useWallet();

  return (
    <div className={styles.balanceCard}>
      <div className={styles.cryptoContainer}>
        <div className={styles.balanceTitle}>{balanceTitle}</div>
        <div className={styles.cryptoImgContainer}>
          <img src={`../src/assets/${cryptocurrency.toLowerCase()}.png`} alt="" className={styles.cryptoImg} />
          {cryptocurrency}
        </div>
      </div>
      <div className={styles.balanceAmount}>
        {showBalance ? balanceAmount : "*****"}
        <div className={styles.balanceCurrency}>{balanceCurrency}</div>
        <div className="dashboard_show-balance" onClick={toggleShowBalance}>
          {showBalance ? <LuEye className={styles.balanceIcon} /> : <LuEyeClosed className={styles.balanceIcon} />}
        </div>
      </div>
    </div>
  );
}
