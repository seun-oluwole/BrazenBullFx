import formatCryptoPrice from "../Utils/formatCryptoPrice";
import styles from "./cryptodata.module.css";

export default function CryptoData({ name, symbol, price, icon, index }) {
  return (
    <div className={styles.container}>
      <span className={styles.index}>{`#${index + 1}`}</span>
      <div className={styles.imgContainer}>
        <img src={icon} alt={name} />
      </div>
      <div className={styles.dataContainer}>
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.symbol}>{symbol}</div>
        </div>
        <div className={styles.price}>
          {formatCryptoPrice(price)}
        </div>
      </div>
    </div>
  );
}
