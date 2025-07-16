import BalanceCard from "../Components/BalanceCard";
import BalanceCardContainer from "../Components/BalanceCardContainer";
import CryptoDataContainer from "../Components/CryptoDataContainer";
import CryptoDataList from "../Components/CryptoDataList";
import QuickLinks from "../Components/QuickLinks";
import SpiralSpinner from "../Components/SpiralSpinner";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import styles from "./wallet.module.css";

export default function Wallet() {
  const { availableBalance, totalDeposit, totalWithdrawn, tier, isWalletLoading } = useWallet();

  const { userData } = userAuth();
  const { firstName } = userData || "";

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.greeting}>
          Welcome
          <div className="">{firstName}</div>
          {!isWalletLoading ? (
            <div className={styles.accountTier}>{tier === "V.I.P" ? tier : `TIER ${tier}`}</div>
          ) : (
            <div className={styles.spinner}>
              <SpiralSpinner width={15} height={15} />
            </div>
          )}
        </div>
        <div className={styles.welcomeRemark}>How are you doing today? 👋</div>
      </div>

      <BalanceCardContainer>
        <BalanceCard balanceTitle={"Available Balance"} balanceAmount={availableBalance} />

        <BalanceCard balanceTitle={"Total Deposit"} balanceAmount={totalDeposit} />

        <BalanceCard balanceTitle={"Total Withdrawn"} balanceAmount={totalWithdrawn} />
      </BalanceCardContainer>
      <QuickLinks />
      <CryptoDataContainer>
        <CryptoDataList />
      </CryptoDataContainer>
    </div>
  );
}
