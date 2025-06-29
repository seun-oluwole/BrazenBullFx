import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../Header/Header";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import SidebarNav from "../SidebarNav/SidebarNav";
import DashboardContainer from "./DashboardContainer";
import styles from "./dashboard.module.css";
import LogoutModal from "../Components/LogoutModal";

export default function Dashboard({ isModalOpen, setIsModalOpen }) {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <SidebarNav setIsModalOpen={setIsModalOpen}/>
        <DashboardContainer>
          <Outlet />
          <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        </DashboardContainer>
      </div>
      <MobileNavigation />
    </>
  );
}
