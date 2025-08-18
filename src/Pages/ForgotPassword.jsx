import { useState } from "react"
import styles from "../Pages/forgotpassword.module.css"
import LoadingSpinner from "../Components/LoadingSpinner";
import { supabase } from "../Utils/supabaseClient";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!email) return 
    setIsLoading(true)
    try {
      const { data, error } = await supabase
      .auth.resetPasswordForEmail(email, { redirectTo: "https://brazenbullfx.vercel.app/new-password" })

      if (error) toast.error("Failed to send link");
      toast.success("Link sent successfully");
    } finally {
      setEmail("");
      setIsLoading(false);
    }

  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Forgot Password</h2>
      </div>
      <div className={styles.inputContainer}>
        <form onSubmit={handlePasswordReset}>
          <p>We will send a password reset link to your email</p>
          <input type="email" value={email} placeholder="Enter your email address" onChange={handleInput}/>
          <button className="button" disabled={isLoading}>
            {!isLoading 
            ? "Send Reset Link"
            : <LoadingSpinner width="30" height="30" />
            }
          </button>
        </form>
      </div>
    </div>
  )
}