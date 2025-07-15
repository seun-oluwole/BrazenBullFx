import { HiArrowTrendingUp } from "react-icons/hi2";
import styles from "./cryptodatacontainer.module.css";

export default function CryptoDataContainer({ children }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Crypto Price
        <span>
          <HiArrowTrendingUp className={styles.icon}/>
        </span>
      </h2>
      <div className={styles.cryptoContainer}>
        <div className={styles.tag}>
          <span>Name</span>
          <span>Price</span>
        </div>
        {children}
      </div>
    </div>
  );
}
