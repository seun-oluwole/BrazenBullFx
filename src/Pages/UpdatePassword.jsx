import { useEffect, useState } from "react";
import styles from "../Pages/updatepassword.module.css";
import { supabase } from "../Utils/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login", { replace: true }); // Redirect if not authenticated
      }
    };
    checkSession();
  }, [navigate]);

  const handleInput = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) toast.error("Failed to reset password");

      toast.success("Password reset successful");
      navigate("/dashboard/wallet", { replace: true });
    } finally {
      setNewPassword("");
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Change Password</h2>
      </div>
      <div className={styles.inputContainer}>
        <form onSubmit={handlePasswordUpdate}>
          <input type="text" value={newPassword} placeholder="Enter your new password" onChange={handleInput} />
          <button className="button" disabled={isLoading}>
            {!isLoading ? "Change Password" : <LoadingSpinner width="30" height="30" />}
          </button>
        </form>
      </div>
    </div>
  );
}
