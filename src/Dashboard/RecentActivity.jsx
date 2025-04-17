export default function RecentActivity({ cryptocurrency }) {

  return (
    <div className="dashboard_recent-activity">
      <div className="dashboard_recent-activity-title">
        Recent activity
      </div>
      <div className="dashboard_recent-activity-cont">
        <div className="dashboard_recent-activity-name">
          <div className="recent_crypto-img-cont">
            <img src={`src/assets/${cryptocurrency.toLowerCase()}.png`} alt="" />
          </div>
          <span>Profit withdrawal</span>
          <span className="transaction-status">COMPLETE</span>
        </div>
        <div className="dashboard_recent-activity-time">12:34 AM</div>
      </div>
    </div>
  )
}