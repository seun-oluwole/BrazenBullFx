import { useState } from "react";
import { NavLink } from "react-router";
import CountrySelector from "../Components/CountrySelector";
import countryList from "country-calling-code";
import styles from "./signup.module.css";

export default function Signup() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [countryDetails, setCountryDetails] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSelectCountry = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryCode(countryCode);

    const filteredCountry = countryList.find(({ isoCode3 }) => isoCode3 === countryCode);
    setCountryDetails(filteredCountry);
    console.log(filteredCountry);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div>Let's get started 🎉</div>
        <p>Register to start trading and investing with BrazenBullFX💚</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={`${styles.nameContainer}`}>
            <div className={styles.authDetails}>
              <div>First Name</div>
              <input type="text" placeholder="Enter your first name." required />
            </div>
            <div className={styles.authDetails}>
              <div>Last Name</div>
              <input type="text" placeholder="Enter your last name." required />
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Email Address</div>
            <input type="email" placeholder="Enter your email address." required />
          </div>
          <div className={styles.authDetails}>
            <div>Phone Number</div>
            <div className={styles.selectorContainer}>
              <CountrySelector
                value={selectedCountryCode}
                countryDetails={countryDetails}
                handleSelectCountry={handleSelectCountry}
              />
              <input
                type="text"
                value={phoneNumber}
                placeholder="Enter your phone number."
                required
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Password</div>
            <input type="password" placeholder="Enter your password." required />
          </div>
          <div className={styles.authDetails}>
            <div>Confirm Password</div>
            <input type="password" placeholder="Enter your password again." required />
          </div>
          <button className={styles.button}>Create Account</button>
        </form>
        <div className={styles.resetDetails}>
          <NavLink to="/login" className="link">
            <p className={styles.signupText}>Already have an account? Login.</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
