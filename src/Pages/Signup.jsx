import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { userAuth } from "../context/AuthContext";
import { toCapitalize } from "../Utils/toCapitalize";
import { SelectCountry, CallingCodeSelector } from "../Components/Selectors";
import { getCurrencySymbol } from "../Utils/getCurrencySymbol";
import country from "country-list-js";
import handleErrorMessages from "../Utils/errorMessages";
import LoadingSpinner from "../Components/LoadingSpinner";
import styles from "./signup.module.css";

export default function Signup() {
  const [steps, setSteps] = useState(1);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    countryCurrency: "PHP",
    countryISO2: "PH",
    countryISO3: "PHL",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    callingCode: "63",
  });

  const { session, signUpNewUser, signUpError, isSessionLoading } = userAuth();
  const navigate = useNavigate();
  const isDisabled = !userDetails.firstname || !userDetails.lastname || !userDetails.email

  useEffect(() => {
    if (
      !isSessionLoading &&
      session &&
      session.user?.user_metadata?.role === "user" &&
      window.location.pathname !== "/dashboard"
    ) {
      navigate("/dashboard/wallet", { replace: true });
    }
  }, [isSessionLoading, session, navigate]);

  // Using Effect to track current state of confirmPassword so that it can be validated.
  useEffect(() => {
    handleConfirmPassword();
    validateEmail();
  }, [userDetails.password, userDetails.confirmPassword, userDetails.email]);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    if (name === "countryCurrency") {
      const filteredCountry = country.findByIso2(value);
      const currencyCode = filteredCountry.currency.code;
      const countryISO3 = filteredCountry.code.iso3;
      const callingCode = filteredCountry.dialing_code;

      setUserDetails((details) => ({
        ...details,
        [name]: currencyCode,
        countryISO2: value,
        countryISO3: countryISO3,
        callingCode: callingCode,
      }));
    } else if (name === "callingCode") {
      const filteredCountry = country.findByIso3(value);
      const currencyCode = filteredCountry.currency.code;
      const countryISO2 = filteredCountry.code.iso2;
      const callingCode = filteredCountry.dialing_code;

      setUserDetails((details) => ({
        ...details,
        countryCurrency: currencyCode,
        countryISO2: countryISO2,
        countryISO3: value,
        callingCode: callingCode,
      }));
    } else {
      setUserDetails((details) => ({ ...details, [name]: value }));
    }
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

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const completePhoneNumber = `+${userDetails.callingCode}${userDetails.phonenumber}`;
    try {
      await signUpNewUser(
        userDetails.email.toLowerCase(),
        userDetails.confirmPassword,
        toCapitalize(userDetails.firstname),
        toCapitalize(userDetails.lastname),
        completePhoneNumber,
        userDetails.countryCurrency,
        "user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div>Let's get started 🎉</div>
        <p>Register to start trading and investing with BrazenBullFX💚</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSignUp}>
          {steps === 1 && (
            <>
              <div className={styles.nameContainer}>
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
              <button className={styles.button} disabled={isDisabled} onClick={() => setSteps(prev => prev + 1)}>
                Next
              </button>
            </>
          )}
          {steps === 2 && (
            <>
              <div className={styles.authDetails}>
                <div className={styles.selectorContainer}>
                  <div className={styles.displayCurrency}>{getCurrencySymbol(userDetails.countryCurrency)}</div>
                  <SelectCountry value={userDetails.countryISO2} handleInput={handleUserInput} />
                </div>
              </div>
              <div className={styles.authDetails}>
                <div>Phone Number</div>
                <div className={styles.selectorContainer}>
                  <CallingCodeSelector value={userDetails.countryISO3} handleInput={handleUserInput} />
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
                    minLength={6}
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
                    minLength={6}
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
              <div className={styles.buttonContainer}>
                <button className={styles.backButton} onClick={() => setSteps(1)}>
                 Go Back
                </button>
                <button className={styles.button} disabled={!matchingPassword || isLoading}>
                  {isLoading ? <LoadingSpinner width="30" height="30" /> : "Create Account"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      <div className={styles.resetDetails}>
        <div className={styles.error}>{signUpError ? `${signUpError}` : ""}</div>
        <NavLink to="/login" className="link">
          <p className={styles.loginText}>Already have an account? Login.</p>
        </NavLink>
      </div>
    </div>
  );
}
