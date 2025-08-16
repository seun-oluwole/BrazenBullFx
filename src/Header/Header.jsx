import { HiBell, HiOutlineUser, HiUser } from "react-icons/hi2";
import { useNavigate } from "react-router";
import styles from "./header.module.css";
import { useWallet } from "../context/WalletContextProvider";

export default function Header({ isAdmin = false }) {
  const navigate = useNavigate();
  const { imageUrl } = useWallet()

  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContainer}>
        <>
          {isAdmin ? (
            <img className={styles.logo} src="/src/assets/bulladminfull.svg" alt="" />
          ) : (
            <img className={styles.logo} src="/src/assets/brazenbull.svg" alt=""/>
          )}
        </>
      </div>
      {isAdmin ? "" : (
        <div className={styles.iconContainer}>
          {/* <div className={styles.notificationContainer}>
            <HiBell className={styles.notificationIcon} />
            <div className={styles.notificationCount}>1</div>
          </div> */}
          <div className={styles.profileImgContainer} onClick={() => navigate("settings")}>
            {imageUrl 
            ? <img className={styles.profileImg} src={imageUrl} alt="" />
            : <HiUser className={styles.userIcon}/>}
          </div>
        </div>
      )}
    </header>
  );
}
