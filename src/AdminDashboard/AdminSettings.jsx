import ViewContainer from "../Components/ViewContainer";
import { HiArrowRightEndOnRectangle, HiChevronRight } from "react-icons/hi2";
import { userAuth } from "../context/AuthContext";
import { useModal } from "../context/modalContext";
import styles from "../AdminDashboard/adminsettings.module.css"

export default function AdminSettings() {
  const { userData } = userAuth();
  const { firstName, lastName, email, phoneNumber } = userData || "";
  const { setIsAdminLogoutModalOpen } = useModal()

  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h1 className={styles.title}>Admin Settings</h1>
        <div className={styles.container}>
          <div className={styles.profileDetails}>
            <div className={styles.profileTitle}>Admin Profile</div>
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
            <div className={styles.logout} onClick={() => setIsAdminLogoutModalOpen(true)}>
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
