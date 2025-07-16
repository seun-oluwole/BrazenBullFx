import ViewContainer from "../Components/ViewContainer";
import Settings from "../Pages/Settings";
import styles from "./adminsettings.module.css"

export default function AdminSettings({ setIsModalOpen}) {
  return (
   <Settings setIsModalOpen={setIsModalOpen} isAdmin={true}/>
  )
}