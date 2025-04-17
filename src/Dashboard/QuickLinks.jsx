import { HiArrowUpTray, HiOutlineCube } from "react-icons/hi2";
import { PiPaperPlaneTilt } from "react-icons/pi";

export default function QuickLinks() {
  return (
      <div className="quicklink">
          <div className="quicklink-icon-cont">
            <HiArrowUpTray className="quicklink-icon"/>
            <span className="quicklink-icon-label">Deposit</span>
          </div>
        
          <div className="quicklink-icon-cont">
            <HiOutlineCube className="quicklink-icon"/>
            <span className="quicklink-icon-label">Investment</span>
          </div>
  
          <div className="quicklink-icon-cont">
            <PiPaperPlaneTilt className="quicklink-icon"/>
            <span className="quicklink-icon-label">Withdraw</span>
          </div>
      </div>
  )
}