import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useWallet } from "../context/WalletContextProvider";
import styles from "./balancecard.module.css";
import SpiralSpinner from "./SpiralSpinner";

export default function BalanceCard({ balanceTitle, balanceAmount }) {
  const { balanceCurrency, cryptocurrency, showBalance, toggleShowBalance, isWalletLoading, fetchWalletError } =
    useWallet();

  return (
    <div className={styles.balanceCard}>
      <div className={styles.cryptoContainer}>
        <div className={styles.balanceTitle}>{balanceTitle}</div>
        <div>
          {!isWalletLoading ? (
            <div className={styles.cryptoImgContainer}>
              <img
                src={`../src/assets/${cryptocurrency?.toLowerCase()}.png`}
                alt={cryptocurrency}
                className={styles.cryptoImg}
              />
              {cryptocurrency}
            </div>
          ) : (
            <SpiralSpinner width={15} height={15} />
          )}
        </div>
      </div>
      <div className={styles.balanceAmount}>
        {fetchWalletError ? (
          <span className={styles.error}>Please check your internet connection and try again.</span>
        ) : (
          <>
            {isWalletLoading ? (
              <div className={styles.spinner}>
                <SpiralSpinner width={25} height={25} />
              </div>
            ) : (
              <>
                <div>{showBalance ? balanceAmount.toLocaleString() : "*****"}</div>
                <div className={styles.balanceCurrency}>{balanceCurrency}</div>
                <div className="dashboard_show-balance" onClick={toggleShowBalance}>
                  {showBalance ? (
                    <LuEye className={styles.balanceIcon} />
                  ) : (
                    <LuEyeClosed className={styles.balanceIcon} />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
