import BalanceCard from '../Components/BalanceCard';
import { HiArrowDownTray, HiArrowUpTray } from 'react-icons/hi2'
import '../Dashboard/Dashboard.css';

const Dashboard = () => {
  return (
    <div className='dashboard_container'>
      <div className="dashboard_title-container">
        <div className="dashboard_greeting">
          Welcome <span className="dashboard_username"> Gideon 👋</span>
          <div className="dashboard_welcome-remark">
            How are you doing today?
          </div>
        </div>

        <div className="dashboard_button-cont">
          <div className="dashboard_btn">
            <HiArrowDownTray className='withdraw-btn'/>
            <span>Withdraw</span> 
          </div>
          <div className='dashboard_btn'>
            <HiArrowUpTray className='deposit-btn'/>
            <span>Deposit</span>
          </div>
        </div>
      </div>
      <div className="dashboard_balance-container">
        <BalanceCard 
        cryptocurrency={"USDT"}
        balanceTitle={"Available Balance"}
        balanceAmount={"120,000"}
        balanceCurrency={" USD "}/>
        
        <BalanceCard
        cryptocurrency={"USDT"} 
        balanceTitle={"Total Deposit"} 
        balanceAmount={"52,000"}
        balanceCurrency={" USD "}/>
        
        <BalanceCard 
        cryptocurrency={"USDT"}
        balanceTitle={"Total Withdrawn"}
        balanceAmount={0}
        balanceCurrency={" USD "}/>
      </div>
      <div className="dashboard_recent-activity">
        <div className="dashboard_recent-activity-title">
          Recent activity
        </div>
        <div className="dashboard_recent-activity-cont">
          <div className="dashboard_recent-activiy-name">Profit generated</div>
          <div className="dashboard_recent-activity-time">12:34 AM</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
