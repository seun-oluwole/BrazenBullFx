import Card from "../Components/Card";
import ViewContainer from "../Components/ViewContainer";
import styles from "./admindashboard.module.css";
import RecentInvestors from "./RecentInvestors";
import SpiralSpinner from "../Components/SpiralSpinner";
import { useAdmin } from "../context/AdminContext";

export default function AdminDashboard() {
  const { totalInvestors, totalWallets, walletsBalance, currency, isFetchingAllWallet, fetchAllWalletError } =
    useAdmin();

  console.log(fetchAllWalletError);
  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h2 className={styles.title}>Dashboard</h2>
        <div className={styles.cardContainer}>
          <Card>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Total Investors</div>
              <div className={styles.count}>
                {isFetchingAllWallet ? <SpiralSpinner width={25} height={25} /> : totalInvestors}
              </div>
            </div>
          </Card>
          <Card>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Total Wallets</div>
              <div className={styles.count}>
                {isFetchingAllWallet ? <SpiralSpinner width={25} height={25} /> : totalWallets}
              </div>
            </div>
          </Card>
          <Card>
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>Wallets Balance</div>
              <div className={styles.count}>
                {isFetchingAllWallet ? (
                  <SpiralSpinner width={25} height={25} />
                ) : (
                  <div className={styles.walletBalance}>
                    <div>{walletsBalance.toLocaleString()}</div>
                    <span>{currency}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <RecentInvestors />
      </div>
    </ViewContainer>
  );
}
