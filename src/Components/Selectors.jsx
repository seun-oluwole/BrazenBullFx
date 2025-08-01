import CurrencyList from "currency-list";
import styles from "../Components/selectors.module.css";

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
      <option value="USDT">USDT (ERC 20)</option>
    </select>
  );
}

export function SelectDepositMethod({ value, handleInput }) {
  return (
    <select defaultValue={value} onChange={handleInput} className={styles.input}>
      <option value="Gcash">Gcash</option>
      <option value="Bank">Bank Account</option>
      <option value="Crypto">Crypto (USDT ERC20)</option>
    </select>
  );
}

export function SelectWithdrawalMethod({ value, handleInput }) {
  return (
    <select value={value || "Gcash"} onChange={handleInput} className={styles.input}>
      <option value="Gcash">Withdraw to Gcash</option>
      <option value="Bank">Withdraw to Bank Account</option>
      <option value="Crypto">Withdraw via Crypto</option>
    </select>
  );
}
