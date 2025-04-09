const BalanceCard = ({ balanceTitle, balanceAmount, balanceCurrency, cryptocurrency }) => {
  return (
    <div className="dashboard_balance-card">
      <div className="dashboard_crypto-container">
        <div className="dashboard_balance-title">{balanceTitle}</div>
        <div className="dashboard_cryptocurrency">
          <img src="src/assets/usdt.png" alt="" className="crypto-img"/>
          {cryptocurrency}
        </div>
      </div>
      <div className="dashboard_balance-amount">{balanceAmount}
        <span className="dashboard_balance-currency">{balanceCurrency}</span>
      </div>  
    </div>
  )
}

export default BalanceCard;
