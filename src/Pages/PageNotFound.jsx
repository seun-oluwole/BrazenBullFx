import { useNavigate } from "react-router";
import styles from "../Pages/pagenotfound.module.css";

export default function PageNotFound() {
  const navigate = useNavigate()
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>Oops!</h1>
      <p>This page doesn't exist</p>
      <button className="button" onClick={() => navigate("/")}>Go to homepage</button>
    </div>
  )
}