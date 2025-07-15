import { useNavigate, useSearchParams } from "react-router";
import { useAdmin } from "../context/AdminContext";
import styles from "./investorlist.module.css";
import moment from "moment";

export default function InvestorList({ filterQuery }) {
  const { investors } = useAdmin();
  const navigate = useNavigate();

  const handleNavigate = (id) => {
    navigate(`profile/${id}`);
  };

  const filteredInvestors = filterQuery.trim() === "" ? 
  investors : investors.filter(({ tier }) => tier === filterQuery)

  return (
    <>
      {investors.length > 0 ? (
          filteredInvestors
          .sort((a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf())
          .map(({ first_name, tier, available_balance, currency, user_id }, index) => (
            <div key={index} className={styles.container} onClick={() => handleNavigate(user_id)}>
              <span className={styles.firstname}>{first_name}</span>
              <span className={styles.amount}>{`${available_balance.toLocaleString()} ${currency}`}</span>
              <span className={styles.tier}>{tier === "V.I.P" ? tier : `TIER ${tier}`}</span>
            </div>
          ))
      ) : (
        <div className={styles.empty}>You have no investors</div>
      )}
    </>
  );
}
