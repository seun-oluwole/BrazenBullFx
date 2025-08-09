import { Outlet } from "react-router";
import DashboardContainer from "../Dashboard/DashboardContainer";
import Header from "../Header/Header";
import styles from "./admincontainer.module.css";
import AdminSideBar from "./AdminSideBar";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import TransactionHisoryModal from "../Components/TransactionHistoryModal";
import AdminLogoutModal from "../Components/AdminLogoutModal";
import AdminMobileNavContent from "./AdminMobileNavContent";

export default function AdminContainer() {
  return (
    <div className={styles.adminContainer}>
      <Header isAdmin={true} />
      <div>
        <div className={styles.container}>
          <AdminSideBar />
          <DashboardContainer>
            <Outlet />
            <AdminLogoutModal />
            <TransactionHisoryModal />
          </DashboardContainer>
        </div>
        <MobileNavigation>
          <AdminMobileNavContent />
        </MobileNavigation>
      </div>
    </div>
  );
}
