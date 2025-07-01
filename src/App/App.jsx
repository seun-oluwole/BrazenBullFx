import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthContextProvider } from "../context/AuthContext";
import Wallet from "../Pages/Wallet";
import Dashboard from "../Dashboard/Dashboard";
import LandingPage from "../LandingPage/LandingPage";
import Transactions from "../Pages/Transactions";
import Investment from "../Pages/Investment";
import Support from "../Pages/Support";
import Settings from "../Pages/Settings";
import WalletContextProvider from "../context/WalletContextProvider";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import PrivateRoute from "../Pages/PrivateRoute";
import "../global.css";


export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <WalletContextProvider>
          <Routes>
            {/* <Route path="/" element={<LandingPage />}/> */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/></PrivateRoute>}>
              <Route index element={<Wallet />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="investment" element={<Investment />} />
              {/* <Route path="support" element={<Support />} /> */}
              <Route path="settings" element={<Settings setIsModalOpen={setIsModalOpen}/>} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Routes>
        </WalletContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
