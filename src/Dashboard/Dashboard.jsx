import BalanceCard from '../Components/BalanceCard';
import { HiArrowDownTray, HiArrowUpTray } from 'react-icons/hi2'
import '../Dashboard/Dashboard.css';
import RecentActivity from './RecentActivity';
import QuickLinks from './QuickLinks';

const Dashboard = () => {
  return (
    <div className='dashboard_container'>
      <div className="dashboard_title-container">
        <div className="dashboard_greeting">
          Welcome <span className="dashboard_username"> Gideon 👋</span>
          <div className="dashboard_welcome-remark">
            How are you doing today?
          </div>
          <div className="dashboard_account-tier">
            Trading Account:
            Tier 1
          </div>
        </div>
      </div>
      <div className="dashboard_balance-container">
        <BalanceCard 
        cryptocurrency={"BTC"}
        balanceTitle={"Available Balance"}
        balanceAmount={"120,000"}
        balanceCurrency={" USD "}/>
        
        <BalanceCard
        cryptocurrency={"BTC"} 
        balanceTitle={"Total Deposit"} 
        balanceAmount={"52,000"}
        balanceCurrency={" USD "}/>
        
        <BalanceCard 
        cryptocurrency={"BTC"}
        balanceTitle={"Total Withdrawn"}
        balanceAmount={0}
        balanceCurrency={" USD "}/>
      </div>
      <QuickLinks />
      <RecentActivity cryptocurrency="BTC"/>
    </div>
  )
}

export default Dashboard;
