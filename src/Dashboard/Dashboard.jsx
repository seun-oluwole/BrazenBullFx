import { useState } from "react";
import { Outlet } from "react-router";
import Header from "../Header/Header";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import SidebarNav from "../SidebarNav/SidebarNav";
import DashboardContainer from "./DashboardContainer";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  return (
    <>
    <Header />
    <div className={styles.container}>
      <SidebarNav />
      <DashboardContainer>
        <Outlet />
      </DashboardContainer>
    </div>
    <MobileNavigation />
    </>
  );
}
