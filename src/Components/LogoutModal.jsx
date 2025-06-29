import { useState } from "react";
import { userAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import LoadingSpinner from "./LoadingSpinner";
import CustomModal from "./CustomModal";
import styles from "./logoutmodal.module.css";

export default function LogoutModal({ isModalOpen, setIsModalOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut, supabaseError, setSupabaseError } = userAuth();

  const closeModal = () => {
    setIsModalOpen(false);
    if (supabaseError) setSupabaseError(null);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { success } = await signOut();
      if (success) {
        setIsModalOpen(false);
        navigate("/login");
      }
    } catch (err) {
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
            <div className={styles.error}>{supabaseError ? "Sorry, something went wrong!" : ""}</div>
          </>
        )}
      </div>
    </CustomModal>
  );
}
