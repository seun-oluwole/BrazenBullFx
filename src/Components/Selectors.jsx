import CurrencyList from "currency-list";
import styles from "../AdminDashboard/investorprofile.module.css";

export function SelectCurrency({ value, handleInput }) {
  const currencyValues = Object.values(CurrencyList.getAll("en_US"));

  return (
    <select value={value} name="currency" id="" className={styles.input} onChange={handleInput}>
      <option value="">Select Currency</option>
      {currencyValues.map(({ code, name }, index) => (
        <option key={index} value={code}>{`${name} (${code})`}</option>
      ))}
    </select>
  );
}

export function SelectTier({ value, handleInput }) {
  return (
    <select value={value} className={styles.input} name="tier" id="" onChange={handleInput}>
      <option value="">Select Tier</option>
      <option value="1">Tier 1</option>
      <option value="2">Tier 2</option>
      <option value="V.I.P">V.I.P</option>
    </select>
  );
}

export function SelectCryptoCurrency({ value, handleInput }) {
  return (
    <select value={value} name="cryptocurrency" className={styles.input} onChange={handleInput}>
      <option value="">Select CryptoCurrency</option>
      <option value="BTC">BTC</option>
      <option value="USDT">USDT</option>
    </select>
  );
}
