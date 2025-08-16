import { useState } from "react";
import { userAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";
import CustomModal from "./CustomModal";
import styles from "./logoutmodal.module.css";
import handleErrorMessages from "../Utils/errorMessages";
import { useModal } from "../context/ModalContext";

export default function LogoutModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signOut } = userAuth();
  const { isLogoutModalOpen, setIsLogoutModalOpen } = useModal();

  const closeModal = () => {
    setIsLogoutModalOpen(false);
    if (error) setError(null);
  };

  const navigate = useNavigate();

  const handleUserLogout = async () => {
    setIsLoading(true);
    try {
      const { success, error: signOutError } = await signOut();

      if (signOutError) {
        setError(handleErrorMessages(signOutError.message));
        throw new Error(signOutError.message);
      }

      if (success) {
        setIsLogoutModalOpen(false);
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isLogoutModalOpen} onClose={closeModal} width={450} height={225}>
      <div className={styles.container}>
        <h2 className={styles.title}>Confirm Logout</h2>
        <p className={styles.subtitle}>Are you sure you want to logout?</p>
        {isLoading ? (
          <>
            <div className={styles.spinnerContainer}>
              <LoadingSpinner />
            </div>
          </>
        ) : (
          <>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={closeModal}>
                Cancel
              </button>
              <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleUserLogout}>
                Logout
              </button>
            </div>
            <div className={styles.error}>{error ? `${error}` : ""}</div>
          </>
        )}
      </div>
    </CustomModal>
  );
}
