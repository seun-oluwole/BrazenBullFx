import { useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

const BalanceCard = ({ 
  balanceTitle, 
  balanceAmount, 
  balanceCurrency, 
  cryptocurrency,
  showBalance,
  toggleShowBalance}) => {

  return (
    <div className="dashboard_balance-card">
      {/* <img className="dashboard_balance-background" src="src/assets/balancebackground.svg" alt="" /> */}
      <div className="dashboard_crypto-container">
        <div className="dashboard_balance-title">{balanceTitle}</div>
        <div className="dashboard_cryptocurrency">
          <img src={`src/assets/${cryptocurrency.toLowerCase()}.png`} alt="" className="crypto-img"/>
          {cryptocurrency}
        </div>
      </div>
      <div className="dashboard_balance-amount">
        {balanceAmount}
        <div className="dashboard_balance-currency">{balanceCurrency}</div>
        <div className="dashboard_show-balance" onClick={toggleShowBalance}>
        {showBalance ? <HiEye className="balance-icon"/> : <HiEyeSlash className="balance-icon"/> }
        </div>
      </div>  
    </div>
  )
}

export default BalanceCard;
