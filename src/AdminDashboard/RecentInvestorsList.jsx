import moment from "moment";
import { useAdmin } from "../context/AdminContext";
import styles from "./recentinvestors.module.css";
import { useNavigate } from "react-router";
import { HiChevronRight } from "react-icons/hi2";

export default function RecentInvestorsList() {
  const { investors } = useAdmin();
  const navigate = useNavigate();

  return (
    <>
      {investors.length > 0 ? (
        investors
          .sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())
          .map(({ first_name, last_name, created_at, user_id }, index) => (
            <div
              className={styles.recentInvestorList}
              key={index}
              onClick={() => navigate(`/admin/investors/profile/${user_id}`, { replace: true })}
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
