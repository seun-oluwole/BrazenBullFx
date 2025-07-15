import { HiArrowRightEndOnRectangle, HiChevronRight, HiPencilSquare } from "react-icons/hi2";
import { userAuth } from "../context/AuthContext";
import ViewContainer from "../Components/ViewContainer";
import styles from "./settings.module.css";
import { useWallet } from "../context/WalletContextProvider";

export default function Settings({ setIsModalOpen }) {
  const { userData } = userAuth();
  const { tier } = useWallet();
  const { firstName, lastName, email, phoneNumber } = userData || "";

  return (
    <ViewContainer>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.container}>
        <div className={styles.displayPicture}>
          <img src={`../src/assets/profile-pic.JPG`} alt="" />
          <div className={styles.tierBadge}>{tier === "V.I.P" ? tier : `TIER ${tier}`}</div>
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.profileTitle}>My Profile</div>
          <div className={styles.userDetail}>
            <span>Name</span>
            {`${firstName} ${lastName}`}
          </div>
          <div className={styles.userDetail}>
            <span>Email</span>
            {`${email}`}
          </div>
          <div className={styles.userDetail}>
            <span>Phone Number</span>
            {`${phoneNumber}`}
          </div>
          <div className={`${styles.userDetail} ${styles.editProfile}`}>
            <div>
              <HiPencilSquare className={styles.icon} />
              Edit Profile
            </div>
            <HiChevronRight className={styles.icon} />
          </div>
          <div className={styles.logout} onClick={() => setIsModalOpen(true)}>
            <div>
              <HiArrowRightEndOnRectangle className={styles.icon} />
              Logout
            </div>
            <HiChevronRight className={styles.icon} />
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}
