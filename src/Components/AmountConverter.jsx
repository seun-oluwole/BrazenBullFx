import { HiArrowsRightLeft } from "react-icons/hi2";
import { getCurrencySymbol } from "../Utils/getCurrencySymbol";
import LoadingSvg from "./LoadingSvg";
import styles from "../Components/amountconverter.module.css"
import { useWallet } from "../context/WalletContextProvider";
import formatAmount from "../Utils/formatAmount";

export default function AmountConverter({ formattedAmount, convertingCurrency, convertedAmount }) {
  const { balanceCurrency } = useWallet()
  return (
    <div className={styles.currencyContainer}>
      <span>{`${formattedAmount}`}</span>
      <HiArrowsRightLeft className={styles.icon} />
      <span>
        {convertingCurrency ? (
          <LoadingSvg width={20} height={20} color="#000" />
        ) : (
          <>{`${getCurrencySymbol(balanceCurrency)}${formatAmount(convertedAmount?.toFixed(2))}`}</>
        )}
      </span>
    </div>
  );
}
