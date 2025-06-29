import BalanceCard from "../Components/BalanceCard";
import QuickLinks from "../Components/QuickLinks";
import RecentActivity from "../Components/RecentActivity";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import styles from "./wallet.module.css";

export default function Wallet() {
  const { availableBalance, totalDeposit, totalWithdrawn, cryptocurrency } = useWallet();

  const { userData } = userAuth();
  const { firstName } = userData || "";

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div className={styles.greeting}>
          Welcome
          <div className="">{firstName}</div>
          <div className={styles.accountTier}>TIER 1</div>
        </div>
        <div className={styles.welcomeRemark}>How are you doing today? 👋</div>
      </div>
      <div className={styles.balanceContainer}>
        <BalanceCard balanceTitle={"Available Balance"} balanceAmount={availableBalance} />

        <BalanceCard balanceTitle={"Total Deposit"} balanceAmount={totalDeposit} />

        <BalanceCard balanceTitle={"Total Withdrawn"} balanceAmount={totalWithdrawn} />
      </div>
      <QuickLinks />
      <RecentActivity cryptocurrency={cryptocurrency} />
    </div>
  );
}
