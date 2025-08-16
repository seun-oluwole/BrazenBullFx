import { Outlet } from "react-router";
import Header from "../Header/Header";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import SidebarNav from "../SidebarNav/SidebarNav";
import DashboardContainer from "./DashboardContainer";
import styles from "./dashboard.module.css";
import LogoutModal from "../Components/LogoutModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserNavContent from "../MobileNavigation/UserNavContent";
import DepositModal from "../Components/DepositModal";
import WithdrawModal from "../Components/WithdrawModal";
import TransactionModal from "../Components/TransactionModal";
import UploadModal from "../Components/UploadModal";

const queryClient = new QueryClient();

export default function Dashboard() {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.container}>
        <SidebarNav />
        <QueryClientProvider client={queryClient}>
          <DashboardContainer>
            <Outlet />
            <LogoutModal />
            <DepositModal />
            <WithdrawModal />
            <UploadModal />
            <TransactionModal />
          </DashboardContainer>
        </QueryClientProvider>
      </div>
      <MobileNavigation>
        <UserNavContent />
      </MobileNavigation>
    </div>
  );
}
