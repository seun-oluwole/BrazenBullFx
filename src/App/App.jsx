import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import '../App/App.css';
import '../global.css';

const App = () =>  {

  return (
    <div className='app'>
      <Header />
      <Navigation />
      <Dashboard />
    </div>
  )
}

export default App;
