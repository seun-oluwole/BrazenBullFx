import { useState } from "react";
import SpiralSpinner from "../Components/SpiralSpinner";
import ViewContainer from "../Components/ViewContainer";
import { useAdmin } from "../context/AdminContext";
import InvestorList from "./InvestorList";
import styles from "./investors.module.css";

export default function Investors() {
  const { isFetchingInvestors, fetchingInvestorsError } = useAdmin();
  const [filterQuery, setFilterQuery] = useState("")

  const handleSelect = (e) => {
    const { value } = e.target
    setFilterQuery(value)
  }

  return (
    <ViewContainer>
      <h2 className={styles.title}>Investors</h2>
      <SelectTier handleSelect={handleSelect} value={filterQuery}/>
      <div className={styles.mainContainer}>
        <div className={styles.titleContainer}>
          <span>NAME</span>
          <span>WALLET BALANCE</span>
          <span>TIER</span>
        </div>
        <div className={styles.investorContainer}>
          {isFetchingInvestors ? (
            <div className={styles.spiralContainer}>
              <SpiralSpinner width={30} height={30} />
            </div>
          ) : (
            <>{fetchingInvestorsError ? <div className={styles.error}>{fetchingInvestorsError ? "Something went wrong! Try again." : ""}</div> : <InvestorList filterQuery={filterQuery}/>}</>
          )}
        </div>
      </div>
    </ViewContainer>
  );
}

function SelectTier({ handleSelect, value }) {
  return (
    <select value={value} className={styles.selectTier} onChange={handleSelect}>
      <option value="">Filter By Tier</option>
      <option value="1">TIER 1</option>
      <option value="2">TIER 2</option>
      <option value="V.I.P">V.I.P</option>
    </select>
  );
}
