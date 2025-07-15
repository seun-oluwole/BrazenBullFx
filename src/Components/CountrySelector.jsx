import countryList from "country-calling-code";
import styles from "./countryselector.module.css";

export default function CountrySelector({ value, countryDetails, handleSelectCountry }) {
  const { countryCodes, isoCode3 } = countryDetails || {};

  let countryCode;
  if (countryCodes) {
    countryCode = countryCodes[0];
  }

  return (
    <select value={value} onChange={handleSelectCountry} className={styles.selector} name={isoCode3} autoFocus>
      <option value={isoCode3 || "PHL"}>{`${isoCode3 || "PHL "} (+${countryCode || "63"})`}</option>
      {countryList.map(({ country, isoCode3, countryCodes }) => (
        <option key={isoCode3} value={isoCode3}>
          {`${country} (+${countryCodes[0]})`}
        </option>
      ))}
    </select>
  );
}
