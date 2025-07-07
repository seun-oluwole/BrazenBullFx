import styles from "./balanceCard.module.css";

export default function BalanceCardContainer({ children }) {
  return <div className={styles.balanceCardContainer}>{children}</div>;
}
