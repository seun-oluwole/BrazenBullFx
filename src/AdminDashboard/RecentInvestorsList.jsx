import moment from "moment";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router";
import { HiChevronRight } from "react-icons/hi2";
import styles from "./recentinvestors.module.css";
import SpiralSpinner from "../Components/SpiralSpinner";

export default function RecentInvestorsList() {
  const { investors, isFetchingInvestors, fetchingInvestorsError } = useAdmin();
  const navigate = useNavigate();

  if (isFetchingInvestors) return  <div className={styles.spiralContainer}><SpiralSpinner width={30} height={30} /></div>
  if (investors.length <= 0 && fetchingInvestorsError) return <div className={styles.error}>Check your connection and try again.</div>
  return (
    <>
      {investors.length > 0 ? (
        investors
          .sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())
          .map(({ first_name, last_name, created_at, user_id }, index) => (
            <div
              className={styles.recentInvestorList}
              key={index}
              onClick={() => navigate(`/admin/investors/${user_id}`, { replace: true })}
            >
              <span>{`${first_name} ${last_name}`}</span>
              <div className={styles.momentContainer}>
                <span>{`Joined ${moment(created_at).fromNow()}`}</span>
                <HiChevronRight className={styles.icon} />
              </div>
            </div>
          ))
      ) : (
        <div className={styles.empty}>No recent investors</div>
      )}
    </>
  );
}
