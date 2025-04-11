import { HiBell } from 'react-icons/hi2';
import '../Header/Header.css';

const Header = () => {
  return (
    <header>
      <div className='logo-container'>
        <img className='logo' src="../src/assets/brazenbull.svg" alt="" />
      </div>
      <div className="header-icon-container">
        <div className='notification-container'>
          <HiBell className='notification-icon'/>
          <div className="notification-count">1</div>
        </div>
        <div className="profile-img-container">
          <img className='profile-img' src="src/assets/profile-pic.JPG" alt="" />
        </div> 
      </div>
    </header>
  )
}

export default Header
