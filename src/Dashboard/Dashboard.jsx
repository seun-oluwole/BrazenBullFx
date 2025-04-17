import { useState } from 'react';
import { HiArrowDownTray, HiArrowUpTray } from 'react-icons/hi2'
import BalanceCard from '../Components/BalanceCard';
import RecentActivity from './RecentActivity';
import QuickLinks from './QuickLinks';
import '../Dashboard/Dashboard.css';

const Dashboard = () => {
  const [availableBalance, setAvailableBalance] = useState('120,000')
  const [totalDeposit, setTotalDeposit] = useState('52,000')
  const [totalWithdrawn, setTotalWithdrawn] = useState('0')
  const [balanceCurrency, setBalanceCurrency] = useState('PHP')
  const [cryptocurrency, setCryptocurrency] = useState('USDT')
  const [showBalance, setShowBalance] = useState(true)

  const toggleShowBalance = () => {
    if (showBalance) {
      setShowBalance(!showBalance)
      setAvailableBalance('*****')
      setTotalDeposit('*****')
      setTotalWithdrawn('*****')

    } else {
      setShowBalance(true)
      setAvailableBalance('120,000')
      setTotalDeposit('52,000')
      setTotalWithdrawn('0')
    }
  }

  return (
    <div className='dashboard_container'>
      <div className="dashboard_title-container">
        <div className="dashboard_greeting">
          Welcome 
          <div className="dashboard_username"> Gideon </div>
          <div className="dashboard_account-tier">
            TIER 1
          </div>
        </div>
          <div className="dashboard_welcome-remark">
            How are you doing today? 👋
          </div>
      </div>
      <div className="dashboard_balance-container">
        <BalanceCard 
        cryptocurrency={cryptocurrency}
        balanceTitle={"Available Balance"}
        balanceAmount={availableBalance}
        balanceCurrency={balanceCurrency}
        showBalance={showBalance}
        toggleShowBalance={toggleShowBalance}/>
        
        <BalanceCard
        cryptocurrency={cryptocurrency} 
        balanceTitle={"Total Deposit"} 
        balanceAmount={totalDeposit}
        balanceCurrency={balanceCurrency}
        showBalance={showBalance}
        toggleShowBalance={toggleShowBalance}/>
        
        <BalanceCard 
        cryptocurrency={cryptocurrency}
        balanceTitle={"Total Withdrawn"}
        balanceAmount={totalWithdrawn}
        balanceCurrency={balanceCurrency}
        showBalance={showBalance}
        toggleShowBalance={toggleShowBalance}/>
      </div>
      <QuickLinks />
      <RecentActivity cryptocurrency={cryptocurrency}/>
    </div>
  )
}

export default Dashboard;
