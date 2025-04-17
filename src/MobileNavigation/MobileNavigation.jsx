import '../MobileNavigation/MobileNavigation.css'
import { HiArrowsUpDown, HiArrowUpTray, HiChatBubbleLeftEllipsis, HiCog6Tooth, HiOutlineChatBubbleLeftEllipsis, HiOutlineCog6Tooth, HiOutlineWallet, HiWallet } from 'react-icons/hi2';
import { PiPaperPlaneTilt, PiPaperPlaneTiltFill } from 'react-icons/pi';

export default function MobileNavigation({ active, handleActiveState }) {
  return (
    <nav className='mobile_nav'>
      <div className="mobile_nav-container">
        <div className={`mobile_icon-container ${active[0] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("wallet")}}>
          {active[0] ? <HiWallet className='mobile_nav-icon'/> : <HiOutlineWallet className='mobile_nav-icon'/>}
        </div>
        <div>
          <HiArrowsUpDown className='mobile_nav-icon'/>
        </div>

        {/* <div className={`mobile_icon-container ${active[1] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("transactions")}}>
          <HiArrowUpTray className='mobile_nav-icon'/>
        </div>

        <div className={`mobile_icon-container ${active[2] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("withdrawal")}}>
          {active[2] ? <PiPaperPlaneTiltFill className='mobile_nav-icon' /> : <PiPaperPlaneTilt className='mobile_nav-icon' />}
        </div> */}

        <div className={`mobile_icon-container ${active[3] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("support")}}>
          {active[3] ? <HiChatBubbleLeftEllipsis className='mobile_nav-icon'/> : <HiOutlineChatBubbleLeftEllipsis className='mobile_nav-icon'/>}
        </div>

        {/* <div className={`mobile_icon-container ${active[4] ? 'active-mobile' : ''}`} onClick={() => {handleActiveState("settings")}}>
          {active[4] ? <HiCog6Tooth className='mobile_nav-icon'/> : <HiOutlineCog6Tooth className='mobile_nav-icon' />}
        </div> */}
      </div>
    </nav>
  )
}