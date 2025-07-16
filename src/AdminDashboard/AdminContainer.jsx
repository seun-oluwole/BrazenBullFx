import { Outlet } from "react-router";
import DashboardContainer from "../Dashboard/DashboardContainer";
import Header from "../Header/Header";
import styles from "./admincontainer.module.css";
import AdminSideBar from "./AdminSideBar";
import MobileNavigation from "../MobileNavigation/MobileNavigation";
import AdminNavContent from "./AdminNavContent";
import LogoutModal from "../Components/LogoutModal";

export default function AdminContainer({ isModalOpen, setIsModalOpen }) {
  return (
    <div className={styles.adminContainer}>
      <Header isAdmin={true} />
      <div>
        <div className={styles.container}>
          <AdminSideBar setIsModalOpen={setIsModalOpen}/>
          <DashboardContainer>
            <Outlet />
            <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} isAdmin={true}/>
          </DashboardContainer>
        </div>
        <MobileNavigation>
          <AdminNavContent />
        </MobileNavigation>
      </div>
    </div>
  );
}
