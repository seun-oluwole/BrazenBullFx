import ViewContainer from "../Components/ViewContainer";
import styles from "./settings.module.css";
import {
  HiArrowRightEndOnRectangle,
  HiCamera,
  HiChevronRight,
  HiOutlineUser,
  HiPencilSquare,
  HiUser,
} from "react-icons/hi2";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { useModal } from "../context/ModalContext";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function Settings({ isAdmin = false }) {
  const { userData } = userAuth();
  const { tier, imageUrl, fetchingImage } = useWallet();
  const { firstName, lastName, email, phoneNumber } = userData || "";
  const { setIsLogoutModalOpen, setIsUploadModalOpen } = useModal();

  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Settings</h1>
        <div className={styles.container}>
          {!isAdmin && (
            <div className={styles.displayPicture} onClick={() => setIsUploadModalOpen(true)}>
              {imageUrl ? (
                <>{fetchingImage ? <LoadingSpinner /> : <img src={imageUrl} alt="" />}</>
              ) : (
                <HiUser className={styles.userIcon} />
              )}

              <div className={styles.tierBadge}>{tier === "V.I.P" ? tier : `TIER ${tier}`}</div>
              <div className={styles.uploadContainer}>
                <HiCamera className={styles.icon} />
              </div>
            </div>
          )}
          <div className={styles.profileDetails}>
            <div className={styles.profileTitle}>{isAdmin ? "Admin" : "My"} Profile</div>
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
            {/* <div className={`${styles.userDetail} ${styles.editProfile}`}>
              <div>
                <HiPencilSquare className={styles.icon} />
                Edit Profile
              </div>
              <HiChevronRight className={styles.icon} />
            </div> */}
            <div className={styles.logout} onClick={() => setIsLogoutModalOpen(true)}>
              <div>
                <HiArrowRightEndOnRectangle className={styles.icon} />
                Logout
              </div>
              <HiChevronRight className={styles.icon} />
            </div>
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}
