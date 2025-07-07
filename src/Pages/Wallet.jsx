import BalanceCard from "../Components/BalanceCard";
import BalanceCardContainer from "../Components/BalanceCardContainer";
import CryptoDataContainer from "../Components/CryptoDataContainer";
import CryptoDataList from "../Components/CryptoDataList";
import QuickLinks from "../Components/QuickLinks";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "./wallet.module.css";

const queryClient = new QueryClient();

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

      <BalanceCardContainer>
        <BalanceCard balanceTitle={"Available Balance"} balanceAmount={availableBalance} />

        <BalanceCard balanceTitle={"Total Deposit"} balanceAmount={totalDeposit} />

        <BalanceCard balanceTitle={"Total Withdrawn"} balanceAmount={totalWithdrawn} />
      </BalanceCardContainer>
      <QuickLinks />
      <QueryClientProvider client={queryClient}>
        <CryptoDataContainer>
          <CryptoDataList />
        </CryptoDataContainer>
      </QueryClientProvider>
    </div>
  );
}
