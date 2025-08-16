import ViewContainer from "../Components/ViewContainer";
import styles from "./investment.module.css";

export default function Investment() {
  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Investment Plans</h1>
        <div className={styles.container}>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>Tier 1 🚀</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ Investment plan: 2000PHP - 10,000PHP</p>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 10% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button}>Invest now</button>
              </div>
            </div>
          </div>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>Tier 2 🔥</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ Investment plan: 10,000PHP - 500,000PHP</p>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 25% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button}>Invest now</button>
              </div>
            </div>
          </div>
          <div className={styles.investmentCard}>
            <div className={styles.tierTitle}>V.I.P 👑</div>
            <div className={styles.innerCard}>
              <div className={styles.investmentPlan}>
                <p>✅ Investment plan: 500,000PHP and above</p>
                <p>✅ 24 Hours profit generation window</p>
                <p>✅ 10X ROI yield within 24 Hours</p>
                <p>✅ 75% Profit generation margin</p>
                <p>✅ 100% Safe and secure investment 🔐</p>
              </div>
              <div>
                <button className={styles.button}>Invest now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}
