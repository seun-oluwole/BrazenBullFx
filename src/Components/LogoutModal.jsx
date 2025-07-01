import { useState } from "react";
import { userAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";
import CustomModal from "./CustomModal";
import styles from "./logoutmodal.module.css";
import handleErrorMessages from "../Utils/errorMessages";

export default function LogoutModal({ isModalOpen, setIsModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signOut } = userAuth();

  const closeModal = () => {
    setIsModalOpen(false);
    if (error) setError(null);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { success, error } = await signOut();
      if (success) {
        setIsModalOpen(false);
        navigate("/login");
      } else {
        setError(handleErrorMessages(error.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isModalOpen} onClose={closeModal}>
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
              <button className={`${styles.button} ${styles.logoutButton}`} onClick={handleLogout}>
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
