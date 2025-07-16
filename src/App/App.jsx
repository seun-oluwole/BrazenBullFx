import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Wallet from "../Pages/Wallet";
import Dashboard from "../Dashboard/Dashboard";
import LandingPage from "../LandingPage/LandingPage";
import Transactions from "../Pages/Transactions";
import Investment from "../Pages/Investment";
import Settings from "../Pages/Settings";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import PrivateRoute from "../Pages/PrivateRoute";
import AdminContainer from "../AdminDashboard/AdminContainer";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import Investors from "../AdminDashboard/Investors";
import AdminSettings from "../AdminDashboard/AdminSettings";
import InvestorProfile from "../AdminDashboard/InvestorProfile";
import AdminLogin from "../AdminDashboard/AdminLogin";
import AdminSignup from "../AdminDashboard/AdminSignup";
import ProtectAdminRoute from "../Pages/ProtectAdminRoute";
import PageNotFound from "../Pages/PageNotFound";
import "../global.css";


export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  return (
        <BrowserRouter>
            <Routes>
              {/* <Route path="/" element={<LandingPage />}/> */}
              <Route path="*" element={<PageNotFound />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/></PrivateRoute>}>
                <Route index element={<Wallet />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="investment" element={<Investment />} />
                <Route path="settings" element={<Settings setIsModalOpen={setIsModalOpen}/>} />
              </Route>

              <Route path="/admin" element={<ProtectAdminRoute><AdminContainer isModalOpen={isAdminModalOpen} setIsModalOpen={setIsAdminModalOpen}/></ProtectAdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />}/>
                <Route path="investors">
                  <Route index element={<Investors />}/>
                  <Route path="profile/:userId" element={<InvestorProfile />}/>
                </Route>
                <Route path="settings" element={<AdminSettings setIsModalOpen={setIsAdminModalOpen}/>} />
              </Route>
              
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
  );
}
