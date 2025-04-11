import { useState } from 'react';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import Navigation from '../Navigation/Navigation';
import MobileNavigation from '../MobileNavigation/MobileNavigation';
import '../App/App.css';
import '../global.css';

const App = () =>  {
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
    <div className='app'>
      <Header />
      <Navigation active={active} setActive={setActive} handleActiveState={handleActiveState}/>
      <Dashboard />
      <MobileNavigation active={active} handleActiveState={handleActiveState}/>
    </div>
  )
}

export default App;
