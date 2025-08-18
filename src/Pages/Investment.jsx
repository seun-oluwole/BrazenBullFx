import ViewContainer from "../Components/ViewContainer";
import { useModal } from "../context/ModalContext";
import { useWallet } from "../context/WalletContextProvider";
import styles from "./investment.module.css";

export default function Investment() {
  const { setIsDepositModalOpen } = useModal();
  const { tier } = useWallet();

  const handleCurrentPlan = (tier, plan) => {
    if (tier === plan) {
      return "Current Plan"
    } else return "Invest Now"
  }

  const openModal = () => {
    setIsDepositModalOpen(true)
  }

  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Investment Plans</h1>
        <div className={styles.container}>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>Tier 1 🚀</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 10% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button} onClick={openModal} disabled={tier === "1"}>{handleCurrentPlan(tier, "1")}</button>
              </div>
            </div>
          </div>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>Tier 2 🔥</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 25% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button} onClick={openModal} disabled={tier === "2"}>{handleCurrentPlan(tier, "2")}</button>
              </div>
            </div>
          </div>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>V.I.P 👑</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 75% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button} onClick={openModal} disabled={tier === "V.I.P"}>{handleCurrentPlan(tier, "V.I.P")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}
