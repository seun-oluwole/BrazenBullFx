import { HiArrowUpTray, HiChatBubbleLeftEllipsis, HiCog6Tooth, HiOutlineChatBubbleLeftEllipsis, HiOutlineCog6Tooth, HiOutlineWallet, HiWallet } from 'react-icons/hi2';
import { PiPaperPlaneTilt, PiPaperPlaneTiltFill } from 'react-icons/pi';
import '../Navigation/Navigation.css';

const Navigation = ({ active, handleActiveState }) => {

  return (
    <nav className='navigation'>
      <div className="nav-container">
        <div className={`nav-icon-container ${active[0] ? 'active' : ''}`} onClick={() => {handleActiveState("wallet")}}>
          {active[0] ? <HiWallet className='nav-icon'/> : <HiOutlineWallet className='nav-icon'/>}
          <span className='nav-icon-label'>Wallet</span>
        </div>

        <div className={`nav-icon-container ${active[1] ? 'active' : ''}`} onClick={() => {handleActiveState("transactions")}}>
          <HiArrowUpTray className='nav-icon'/>
          <span className="nav-icon-label">Deposit</span>
        </div>

        <div className={`nav-icon-container ${active[2] ? 'active' : ''}`} onClick={() => {handleActiveState("withdrawal")}}>
          {active[2] ? <PiPaperPlaneTiltFill className='nav-icon' /> : <PiPaperPlaneTilt className='nav-icon' />}
          <span className="nav-icon-label">Withdrawal</span>
        </div>

        <div className={`nav-icon-container ${active[3] ? 'active' : ''}`} onClick={() => {handleActiveState("support")}}>
          {active[3] ? <HiChatBubbleLeftEllipsis className='nav-icon'/> : <HiOutlineChatBubbleLeftEllipsis className='nav-icon'/>}
          <span className="nav-icon-label">Support</span>
        </div>

        <div className={`nav-icon-container ${active[4] ? 'active' : ''}`} onClick={() => {handleActiveState("settings")}}>
          {active[4] ? <HiCog6Tooth className='nav-icon'/> : <HiOutlineCog6Tooth className='nav-icon' />}
          <span className="nav-icon-label">Settings</span>
        </div>
      </div>
    </nav>
  )
}

export default Navigation;
