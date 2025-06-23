import { HiBell } from "react-icons/hi2";
import { useNavigate } from "react-router";
import styles from "./header.module.css";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <img
          className={styles.logo}
          src="../src/assets/brazenbull.svg"
          alt=""
        />
      </div>
      <div className={styles.iconContainer}>
        <div className={styles.notificationContainer}>
          <HiBell className={styles.notificationIcon} />
          <div className={styles.notificationCount}>1</div>
        </div>
        <div className={styles.profileImgContainer}  onClick={() => navigate("settings")}>
          <img
            className={styles.profileImg}
            src="../src/assets/profile-pic.JPG"
            alt=""
          />
        </div>
      </div>
    </header>
  );
}
