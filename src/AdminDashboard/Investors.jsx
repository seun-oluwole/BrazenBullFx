import { SelectFilterTier } from "../Components/Selectors";
import { useState } from "react";
import ViewContainer from "../Components/ViewContainer";
import InvestorList from "./InvestorList";
import styles from "./investors.module.css";

export default function Investors() {
  const [filterQuery, setFilterQuery] = useState("")

  const handleSelect = (e) => {
    const { value } = e.target
    setFilterQuery(value)
  }

  return (
    <ViewContainer>
      <div className={styles.mainContainer}>
        <h2 className={styles.title}>Investors</h2>
        <SelectFilterTier handleSelect={handleSelect} value={filterQuery}/>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <span>NAME</span>
            <span>WALLET BALANCE</span>
            <span>TIER</span>
          </div>
          <div className={styles.investorContainer}>
            <InvestorList filterQuery={filterQuery}/>
          </div>
        </div>
      </div>
    </ViewContainer>
  );
}


