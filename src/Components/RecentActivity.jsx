import styles from "./recentactivity.module.css";

export default function RecentActivity({ cryptocurrency }) {
  return (
    <div className={styles.recentActivityContainer}>
      <div className={styles.activityTitle}>Recent activity</div>
      <div className={styles.recentActivity}>
        <div className={styles.activityName}>
          <div className={styles.cryptoImgContainer}>
            <img
              src={`../src/assets/${cryptocurrency.toLowerCase()}.png`}
              alt=""
            />
          </div>
          <span>Profit withdrawal</span>
          <span className={styles.transactionStatus}>COMPLETE</span>
        </div>
        <div className="">12:34 AM</div>
      </div>
    </div>
  );
}
