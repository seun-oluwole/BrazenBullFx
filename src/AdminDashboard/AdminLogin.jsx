import { useEffect, useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router";
import { userAuth } from "../context/AuthContext";
import handleErrorMessages from "../Utils/errorMessages";
import LoadingSpinner from "../Components/LoadingSpinner";
import styles from "../Pages/login.module.css";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const { session, signInAdmin, isSessionLoading } = userAuth();
  const navigate = useNavigate();

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
      const { error: signInError } = await signInAdmin(
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
        <div>Login Admin</div>
        <p>Login into your admin account</p>
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
            {isLoading ? <LoadingSpinner width="30" height="30" /> : "Login"}
          </button>
        </form>
      </div>
      <div className={styles.resetDetails}>
        <div className={styles.error}>{error ? `${error}` : ""}</div>
        <NavLink to="/admin/signup" className="link">
          <p className={styles.signupText}>Don't have an account? SignUp.</p>
        </NavLink>
        <p className={styles.resetText}>Forgot Password? Reset Now.</p>
      </div>
    </div>
  );
}
