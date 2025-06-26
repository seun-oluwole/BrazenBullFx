import { NavLink } from "react-router";
import styles from "./login.module.css";

export default function Login() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <div>Login</div>
        <p>Securely login to your BrazenBullFX💚</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.authDetails}>
            <div>Email Address</div>
            <input type="text" placeholder="Enter your email address..." />
          </div>
          <div className={styles.authDetails}>
            <div>Password</div>
            <input type="password" placeholder="Enter your password..." />
          </div>
          <button className={styles.button}>Login</button>
        </form>

        <div className={styles.resetDetails}>
          <NavLink to="/signup" className="link">
            <p className={styles.signupText}>Don't have an account? SignUp.</p>
          </NavLink>
          <p className={styles.resetText}>Forgot Password? Reset Now.</p>
        </div>
      </div>
    </div>
  );
}
