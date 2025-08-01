import styles from "../Components/status.module.css";

export default function Status({ status }) {
  if (status === "success") return <div className={styles.success}>Sucessful</div>;
  if (status === "pending") return <div className={styles.pending}>Pending</div>;
  if (status === "failed") return <div className={styles.failed}>Failed</div>;
}
