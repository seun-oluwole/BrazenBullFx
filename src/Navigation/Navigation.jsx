import { useState } from 'react';
import { HiArrowDownTray, HiArrowUpTray, HiChatBubbleLeftEllipsis, HiCog6Tooth, HiOutlineChatBubbleLeftEllipsis, HiOutlineCog6Tooth, HiOutlineWallet, HiWallet } from 'react-icons/hi2';
import { PiPaperPlaneTilt, PiPaperPlaneTiltFill } from 'react-icons/pi';
import '../Navigation/Navigation.css';

const Navigation = () => {
  const [active, setActive] = useState(Array(5).fill(false));

  const handleActiveState = (activeState) => {
    // Creates copy of array...
    const newActive = active.slice();

    if (activeState === 'wallet') {
      // Updates new array based on index...
      newActive[0] = true;
    } else {
      newActive[0] = false;
    }

    if (activeState === 'transactions') {
      newActive[1] = true;
    } else {
      newActive[1] = false;
    }

    if (activeState === 'withdrawal') {
      newActive[2] = true;
    } else {
      newActive[2] = false;
    }

    if (activeState === 'support') {
      newActive[3] = true;
    } else {
      newActive[3] = false;
    }

    if (activeState === 'settings') {
      newActive[4] = true;
    } else {
      newActive[4] = false;
    }
    
    //Merges new updated array with initial array...
    setActive(newActive);
  };

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
