import '../MobileNavigation/MobileNavigation.css'
import { HiArrowUpTray, HiChatBubbleLeftEllipsis, HiCog6Tooth, HiOutlineChatBubbleLeftEllipsis, HiOutlineCog6Tooth, HiOutlineWallet, HiWallet } from 'react-icons/hi2';
import { PiPaperPlaneTilt, PiPaperPlaneTiltFill } from 'react-icons/pi';

export default function MobileNavigation({ active, handleActiveState }) {
  return (
    <nav className='mobile-nav'>
      <div className="mobile_nav-container">
        <div className={`mobile_icon-container ${active[0] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("wallet")}}>
          {active[0] ? <HiWallet className='nav-icon'/> : <HiOutlineWallet className='nav-icon'/>}
        </div>

        <div className={`mobile_icon-container ${active[1] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("transactions")}}>
          <HiArrowUpTray className='nav-icon'/>
        </div>

        <div className={`mobile_icon-container ${active[2] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("withdrawal")}}>
          {active[2] ? <PiPaperPlaneTiltFill className='nav-icon' /> : <PiPaperPlaneTilt className='nav-icon' />}
        </div>

        <div className={`mobile_icon-container ${active[3] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("support")}}>
          {active[3] ? <HiChatBubbleLeftEllipsis className='nav-icon'/> : <HiOutlineChatBubbleLeftEllipsis className='nav-icon'/>}
        </div>

        <div className={`mobile_icon-container ${active[4] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("settings")}}>
          {active[4] ? <HiCog6Tooth className='nav-icon'/> : <HiOutlineCog6Tooth className='nav-icon' />}
        </div>
      </div>
    </nav>
  )
}