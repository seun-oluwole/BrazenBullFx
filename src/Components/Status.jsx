import styles from "../Components/status.module.css";

export default function Status({ status, width, height, fontSize }) {
  const style = {
    height: `${height}px`,
    fontSize: `${fontSize}rem`,
  }

  if (status === "successful") return <div className={styles.success} style={style}>Successful</div>;
  if (status === "pending") return <div className={styles.pending} style={style}>Pending</div>;
  if (status === "failed") return <div className={styles.failed} style={style}>Failed</div>;
}
