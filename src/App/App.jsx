import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Wallet from "../Pages/Wallet";
import Dashboard from "../Dashboard/Dashboard";
import LandingPage from "../LandingPage/LandingPage";
import Transactions from "../Pages/Transactions";
import Investment from "../Pages/Investment";
import Support from "../Pages/Support";
import Settings from "../Pages/Settings";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import PrivateRoute from "../Pages/PrivateRoute";
import AdminContainer from "../AdminDashboard/AdminContainer";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import Investors from "../AdminDashboard/Investors";
import AdminSettings from "../AdminDashboard/AdminSettings";
import "../global.css";
import InvestorProfile from "../AdminDashboard/InvestorProfile";


export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
        <BrowserRouter>
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
              <Route path="/admin" element={<AdminContainer />}>
                <Route index element={<AdminDashboard />}/>
                <Route path="dashboard" element={<AdminDashboard />}/>
                <Route path="investors">
                  <Route index element={<Investors />}/>
                  <Route path="profile/:userId" element={<InvestorProfile />}/>
                </Route>
                <Route path="settings" element={<AdminSettings />} />
                <Route path="login" element={''} />
                <Route path="signup" element={''} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
  );
}
