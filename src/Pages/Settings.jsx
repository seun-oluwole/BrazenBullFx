import {
  HiArrowRightEndOnRectangle,
  HiChevronRight,
  HiPencilSquare,
} from "react-icons/hi2";
import ViewContainer from "../Components/ViewContainer";
import styles from "./settings.module.css";

export default function Settings() {
  return (
    <ViewContainer>
      <h1 className={styles.title}>Settings</h1>
      <div className={styles.container}>
        <div className={styles.displayPicture}>
          <img src={`../src/assets/profile-pic.JPG`} alt="" />
          <div className={styles.tierBadge}>TIER 1</div>
        </div>
        <div className={styles.profileDetails}>
          <div className={styles.profileTitle}>My Profile</div>
          <div className={styles.userDetail}>
            <span>Name</span>
            Chukwuemeka Gideon Oluwole
          </div>
          <div className={styles.userDetail}>
            <span>Email</span>
            oluwolegideon00@gmail.com
          </div>
          <div className={styles.userDetail}>
            <span>Phone Number</span>
            +2349033952740
          </div>
          <div className={`${styles.userDetail} ${styles.editProfile}`}>
            <div>
              <HiPencilSquare className={styles.icon} />
              Edit Profile
            </div>
            <HiChevronRight className={styles.icon} />
          </div>
          <div className={styles.logout}>
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
