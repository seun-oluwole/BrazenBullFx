import { BrowserRouter, Route, Routes } from "react-router";
import Wallet from "../Pages/Wallet";
import Dashboard from "../Dashboard/Dashboard";
import LandingPage from "../LandingPage/LandingPage";
import Transactions from "../Pages/Transactions";
import Investment from "../Pages/Investment";
import Support from "../Pages/Support";
import Settings from "../Pages/Settings";
import WalletContextProvider from "../context/WalletContextProvider";
import "../global.css";

export default function App() {
  return (
      <BrowserRouter>
      <WalletContextProvider>
      <Routes>
        {/* <Route path="/" element={<LandingPage />}/> */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Wallet />}/>
          <Route path="wallet" element={<Wallet />}/>
          <Route path="transactions" element={<Transactions />}/>
          <Route path="investment" element={<Investment />} />
          {/* <Route path="support" element={<Support />} /> */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      </WalletContextProvider>
      </BrowserRouter>
  );
};


