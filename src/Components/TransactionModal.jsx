
import styles from "../Components/transactionmodal.module.css";
import { useModal } from "../context/modalContext";
import CustomModal from "./CustomModal";
import TransactionModalContent from "./TransactionModalContent";

export default function TransactionModal() {
  const { isTransactionModal, setIsTransactionModal } = useModal();

  const closeModal = () => {
    setIsTransactionModal(false);
  };

  return (
    <CustomModal isOpen={isTransactionModal} onClose={closeModal}>
      <div style={styles.container}>
        <h2 className={styles.title}>Transaction Details</h2>
        <TransactionModalContent closeModal={closeModal}/>
      </div>
    </CustomModal>
  );
}
