import { Navigate } from "react-router"; 
import { userAuth } from "../context/AuthContext";
import LoadingSpinner from "../Components/LoadingSpinner";
import styles from "./privateroute.module.css";

export default function PrivateRoute({ children }) {
  const { session, isSessionLoading } = userAuth();
  const role = session?.user?.user_metadata?.role;

  if (isSessionLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
}