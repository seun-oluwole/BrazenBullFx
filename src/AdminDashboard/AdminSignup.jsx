import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { userAuth } from "../context/AuthContext";
import { toCapitalize } from "../Utils/toCapitalize";
import { CallingCodeSelector } from "../Components/Selectors";
import handleErrorMessages from "../Utils/errorMessages";
import LoadingSpinner from "../Components/LoadingSpinner";
import styles from "../Pages/signup.module.css";
import country from 'country-list-js';

export default function AdminSignup() {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    callingCode: "",
    countryISO3: "NGA"
  });

  const { session, isSessionLoading, signUpNewUser, signUpError } = userAuth();
  const navigate = useNavigate()

   useEffect(() => {
    if (
      !isSessionLoading &&
      session &&
      session.user?.user_metadata?.role === "admin" &&
      window.location.pathname !== "/admin"
    ) {
      navigate("/admin", { replace: true });
    }
  }, [isSessionLoading, session, navigate]);

  // Using Effect to track current state of confirmPassword so that it can be validated.
  useEffect(() => {
    handleConfirmPassword();
    validateEmail();
  }, [userDetails.password, userDetails.confirmPassword, userDetails.email]);

  const handleSelectCallingCode = (e) => {
    const countryISO3 = e.target.value;
    const filteredCountry = country.findByIso3(countryISO3)
    const callingCode = filteredCountry.dialing_code

    setUserDetails((details) => ({ 
      ...details, 
      countryISO3: countryISO3,
      callingCode: callingCode
    }));
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
        "",
        "admin"
      );
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div>Create Admin Account</div>
        <p>Create an admin account on BrazenBullFX💚</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSignUp}>
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
              <CallingCodeSelector
                value={userDetails.countryISO3}
                handleInput={handleSelectCallingCode}
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
          <button className={styles.button} disabled={!matchingPassword || isLoading}>
            {isLoading ? <LoadingSpinner width="30" height="30" /> : "Create Account"}
          </button>
        </form>
      </div>
      <div className={styles.resetDetails}>
        <div className={styles.error}>{signUpError ? `${signUpError}` : ""}</div>
        <NavLink to="/admin/login" className="link">
          <p className={styles.signupText}>Already have an account? Login.</p>
        </NavLink>
      </div>
    </div>
  );
}
