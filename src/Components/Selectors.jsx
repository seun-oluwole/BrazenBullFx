import country from 'country-list-js';
import styles from "../Components/selectors.module.css";

const countryNames = country.names().sort();
const allCountries = countryNames.map(name => country.findByName(name))

export function SelectCountry({ value, handleInput }) {
  return (
  <select value={value} name="countryCurrency" id="" className={styles.countryInput} onChange={handleInput} required>
    <option value="">Select Country</option>
    {allCountries.map(({ code: { iso2 }, name }) => (
      <option key={iso2} value={iso2}>{`${name}`}</option>
    ))}
  </select>
);
}

export function SelectCurrency({ value, handleInput }) {
  return (
    <select value={value} name="currency" id="" className={styles.input} onChange={handleInput}>
      <option value="">Select Currency</option>
      {allCountries.map(({ name, currency: { code, symbol }, code: { iso2 } }) => (
        <option key={iso2} value={code}>{`${name} (${code}) ${symbol}`}</option>
      ))}
    </select>
  );
}

export function SelectDepositCurrency({ value, handleInput }) {
  return (
    <select value={value} name="depositCurrency" id="" className={styles.input} onChange={handleInput}>
      <option value="">Select Currency</option>
      {allCountries.map(({ name, currency: { code, symbol }, code: { iso2 } }) => (
        <option key={iso2} value={code}>{`${name} (${code}) ${symbol}`}</option>
      ))}
    </select>
  );
}

export function CallingCodeSelector({ value, handleInput }) {
   const callingCode = country.findByIso3(value).dialing_code
   return (
    <select value={value} name="callingCode" onChange={handleInput} className={styles.selector} autoFocus>
      <option value={value}>{`${value} (+${callingCode})`}</option>
      {allCountries.map(({ name, dialing_code, code: { iso3 }}) => (
        <option key={iso3} value={iso3}>
          {`${name} (+${dialing_code})`}
        </option>
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

export function SelectFilterTier({ handleSelect, value }) {
  return (
    <select value={value} className={styles.input} onChange={handleSelect}>
      <option value="">Filter By Tier</option>
      <option value="1">TIER 1</option>
      <option value="2">TIER 2</option>
      <option value="V.I.P">V.I.P</option>
    </select>
  );
}

export function SelectCryptoCurrency({ value, handleInput }) {
  return (
    <select value={value} name="cryptocurrency" className={styles.input} onChange={handleInput}>
      <option value="">Select CryptoCurrency</option>
      <option value="BTC">BTC</option>
      <option value="USDT">USDT (ERC-20)</option>
    </select>
  );
}

export function SelectDepositMethod({ value, handleInput }) {
  return (
    <select defaultValue={value} onChange={handleInput} className={styles.input}>
      <option value="Gcash">Gcash</option>
      <option value="Bank">Bank Account</option>
      <option value="Crypto">Crypto (USDT ERC-20)</option>
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

export function SelectTransactionStatus({ value, handleInput }) {
  return (
    <select value={value} onChange={handleInput} className={styles.input}>
      <option value="">Transaction Status</option>
      <option value="successful">Successful</option>
      <option value="pending">Pending</option>
      <option value="failed">Failed</option>
    </select>
  )
}
