import { HiArrowDownTray, HiArrowUpTray } from "react-icons/hi2";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useWallet } from "../context/WalletContextProvider";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import SpiralSpinner from "./SpiralSpinner";
import styles from "./withdrawablebalance.module.css";

export default function WithdrawableBalance({ setIsDepositModalOpen, setIsWithdrawModalOpen }) {
  const { withdrawableBalance, showBalance, toggleShowBalance, balanceCurrency, isWalletLoading, fetchWalletError } =
    useWallet();

  return (
    <div className={styles.container}>
      <div className={styles.title}>Withdrawable Balance</div>
      <div className={styles.balanceContainer}>
        {!fetchWalletError ? (
          <>
            {!isWalletLoading ? (
              <>
                <div className={styles.amount}>{showBalance ? withdrawableBalance.toLocaleString() : "*****"}</div>
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
          </>
        ) : (
          <div className={styles.error}>{fetchWalletError ? "Something went wrong! Try again." : ""}</div>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={() => setIsDepositModalOpen(true)}>
          <>
            <HiArrowDownTray className={styles.icon} />
            Deposit
          </>
        </button>
        <button className={styles.button} onClick={() => setIsWithdrawModalOpen(true)}>
          <>
            <PiPaperPlaneTiltFill className={styles.icon} />
            Withdraw
          </>
        </button>
      </div>
    </div>
  );
}
