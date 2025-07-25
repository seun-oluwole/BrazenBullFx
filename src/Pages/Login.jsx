import { useEffect, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";
import { userAuth } from "../context/AuthContext";
import handleErrorMessages from "../Utils/errorMessages";
import LoadingSpinner from "../Components/LoadingSpinner";
import styles from "./login.module.css";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const { session, signInUser, isSessionLoading } = userAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !isSessionLoading &&
      session &&
      session.user?.user_metadata?.role === "user" &&
      window.location.pathname !== "/dashboard"
    ) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSessionLoading, session, navigate]);

  const toggleShowPassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginDetails((details) => ({ ...details, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await signInUser(
        loginDetails.email.toLowerCase(),
        loginDetails.password
      );

      if (signInError) {
        setError(handleErrorMessages(signInError.message));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div>Login</div>
        <p>Securely login to your BrazenBullFX💚</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSignIn}>
          <div className={styles.authDetails}>
            <div>Email Address</div>
            <div className={styles.inputContainer}>
              <input
                type="email"
                value={loginDetails.email}
                name="email"
                placeholder="Enter your email address."
                onChange={handleUserInput}
                required
              />
            </div>
          </div>
          <div className={styles.authDetails}>
            <div>Password</div>
            <div className={styles.inputContainer}>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={loginDetails.password}
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
          <button className={styles.button} disabled={isLoading}>
            {isLoading ? <LoadingSpinner width="30" height="30" /> : "Login"}
          </button>
        </form>
      </div>
      <div className={styles.resetDetails}>
        <div className={styles.error}>{error}</div>
        <NavLink to="/signup" className="link">
          <p className={styles.signupText}>Don't have an account? SignUp.</p>
        </NavLink>
        <NavLink to="/reset-password" className={styles.resetText}>
          Forgot Password? Reset Now.
        </NavLink>
      </div>
    </div>
  );
}