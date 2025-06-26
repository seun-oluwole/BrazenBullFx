import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import CountrySelector from "../Components/CountrySelector";
import countryList from "country-calling-code";
import styles from "./signup.module.css";
import { LuEye, LuEyeClosed } from "react-icons/lu";

export default function Signup() {
  const [selectedCountryCode, setSelectedCountryCode] = useState("PHP");
  const [callingCode, setCallingCode] = useState("63");
  const [countryDetails, setCountryDetails] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  // Using Effect to track current state of confirmPassword so that it can be validated.
  useEffect(() => {
    handleConfirmPassword();
    validateEmail();
  }, [userDetails.password, userDetails.confirmPassword, userDetails.email]);

  const handleSelectCountry = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryCode(countryCode);

    const filteredCountry = countryList.find(({ isoCode3 }) => isoCode3 === countryCode);
    setCountryDetails(filteredCountry);
    setCallingCode(filteredCountry?.countryCodes[0]);
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setUserDetails((details) => ({ ...details, [name]: value }));
  };

  const handleConfirmPassword = () => {
    if (userDetails.password === userDetails.confirmPassword) {
      setMatchingPassword(true);
    } else {
      setMatchingPassword(false);
    }
  };

  const toggleShowPassword = () => {
    if (!isPasswordVisible) {
      setIsPasswordVisible(true);
    } else {
      setIsPasswordVisible(false);
    }
  };

  const validateEmail = () => {
    if (userDetails.email) {
      setIsEmailValid(userDetails.email.includes("@"));
    }
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
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="firstname"
                  value={userDetails.firstname}
                  placeholder="Enter your first name."
                  onChange={handleUserInput}
                  required
                />
              </div>
            </div>
            <div className={styles.authDetails}>
              <div>Last Name</div>
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="lastname"
                  value={userDetails.lastname}
                  placeholder="Enter your last name."
                  onChange={handleUserInput}
                  required
                />
              </div>
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Email Address</div>
            <div className={styles.inputContainer}>
              <input
                type="email"
                name="email"
                value={userDetails.email}
                placeholder="Enter your email address."
                onChange={handleUserInput}
                required
              />
            </div>
            {!isEmailValid && <div className={styles.error}>Your email is not valid. Enter a valid email.</div>}
          </div>
          <div className={styles.authDetails}>
            <div>Phone Number</div>
            <div className={styles.selectorContainer}>
              <CountrySelector
                value={selectedCountryCode}
                countryDetails={countryDetails}
                handleSelectCountry={handleSelectCountry}
              />
              <div className={styles.inputContainer}>
                <input
                  type="text"
                  name="phonenumber"
                  value={userDetails.phonenumber}
                  placeholder="Enter your phone number."
                  onChange={handleUserInput}
                  required
                />
              </div>
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Password</div>
            <div className={styles.inputContainer}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={userDetails.password}
                placeholder="Enter your password."
                onChange={handleUserInput}
                required
              />
              <span className={styles.iconContainer}>
                {isPasswordVisible ? (
                  <LuEye className={styles.icon} onClick={toggleShowPassword} />
                ) : (
                  <LuEyeClosed className={styles.icon} onClick={toggleShowPassword} />
                )}
              </span>
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Confirm Password</div>
            <div className={styles.inputContainer}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={userDetails.confirmPassword}
                placeholder="Enter your password again."
                onChange={handleUserInput}
                required
              />
              <span className={styles.iconContainer}>
                {isPasswordVisible ? (
                  <LuEye className={styles.icon} onClick={toggleShowPassword} />
                ) : (
                  <LuEyeClosed className={styles.icon} onClick={toggleShowPassword} />
                )}
              </span>
            </div>
            {!matchingPassword && <div className={styles.error}>Password doesn't match.</div>}
          </div>
          <button className={styles.button} disabled={!matchingPassword}>
            Create Account
          </button>
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
