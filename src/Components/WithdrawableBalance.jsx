import { HiArrowDownTray, HiArrowUpTray } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useWallet } from "../context/WalletContextProvider";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import SpiralSpinner from "./SpiralSpinner";
import styles from "./withdrawablebalance.module.css";

export default function WithdrawableBalance() {
  const { withdrawableBalance, showBalance, toggleShowBalance, balanceCurrency, isWalletLoading } = useWallet();

  return (
    <div className={styles.container}>
      <div className={styles.title}>Withdrawable Balance</div>
      <div className={styles.balanceContainer}>
        {!isWalletLoading ? (
          <>
            <div className={styles.amount}>{showBalance ? withdrawableBalance : "*****"}</div>
            <span>{balanceCurrency}</span>
            <div className="" onClick={toggleShowBalance}>
              {showBalance ? <LuEye className={styles.icon} /> : <LuEyeClosed className={styles.icon} />}
            </div>
          </>
        ) : (
          <div className={styles.spinner}>
            <SpiralSpinner width={25} height={25} />
          </div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button}>
          <HiArrowDownTray className={styles.icon} />
          Deposit
        </button>
        <button className={styles.button}>
          <PiPaperPlaneTiltFill className={styles.icon} />
          Withdraw
        </button>
      </div>
    </div>
  );
}
