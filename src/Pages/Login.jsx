import { useEffect, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";
import { userAuth } from "../context/AuthContext";
import styles from "./login.module.css";
import handleErrorMessages from "../Utils/errorMessages";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const { session, signIn, isSessionLoading } = userAuth();
  const navigate = useNavigate();

  // Redirects to dashboard if user is already logged in or has an active session...
  useEffect(() => {
    if (!isSessionLoading && session) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSessionLoading, session, navigate]);

  const toggleShowPassword = () => {
    if (!isPasswordVisible) {
      setIsPasswordVisible(true);
    } else {
      setIsPasswordVisible(false);
    }
  };

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginDetails((details) => ({ ...details, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success, error } = await signIn(loginDetails.email.toLowerCase(), loginDetails.password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError(handleErrorMessages(error.message));
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
                type="text"
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
                type={`${isPasswordVisible ? "text" : "password"}`}
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
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className={styles.resetDetails}>
          <div className={styles.error}>{error ? `${error}` : ""}</div>
          <NavLink to="/signup" className="link">
            <p className={styles.signupText}>Don't have an account? SignUp.</p>
          </NavLink>
          <p className={styles.resetText}>Forgot Password? Reset Now.</p>
        </div>
      </div>
    </div>
  );
}
