import { useModal } from "../context/modalContext";
import CustomModal from "./CustomModal";
import TransactionHistoryContainer from "./TransactionHistoryContainer";
import styles from "../Components/transactionhistorymodal.module.css";
import { useWallet } from "../context/WalletContextProvider";
import { useAdmin } from "../context/AdminContext";

export default function TransactionHisoryModal() {
  const { isTransHistoryModal, setIsTransHistoryModal } = useModal();
  const { investorTransDetail } = useAdmin()

  const title = investorTransDetail?.transaction_title
  const isCrypto = investorTransDetail?.transaction_method === "Crypto"
  const isGcash = investorTransDetail?.transaction_method === "Gcash"
  const isBank = investorTransDetail?.transaction_method === "Bank"

  

  const closeModal = () => {
    setIsTransHistoryModal(false)
  }

  return (
    <CustomModal isOpen={isTransHistoryModal} onClose={closeModal}>
      <div style={styles.container}>
        <h2 className={styles.title}>Transaction Details</h2>
        <TransactionHistoryContainer closeModal={closeModal}/>
      </div>
    </CustomModal>
  )
}