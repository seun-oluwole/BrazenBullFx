import { Outlet } from "react-router";
import Header from "../Header/Header";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import SidebarNav from "../SidebarNav/SidebarNav";
import DashboardContainer from "./DashboardContainer";
import styles from "./dashboard.module.css";
import LogoutModal from "../Components/LogoutModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserNavContent from "../MobileNavigation/UserNavContent";

const queryClient = new QueryClient();

export default function Dashboard({ isModalOpen, setIsModalOpen }) {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.container}>
        <SidebarNav setIsModalOpen={setIsModalOpen} />
        <QueryClientProvider client={queryClient}>
          <DashboardContainer>
            <Outlet />
            <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
          </DashboardContainer>
        </QueryClientProvider>
      </div>
      <MobileNavigation>
        <UserNavContent />
      </MobileNavigation>
    </div>
  );
}
