import { useEffect } from "react";
import styles from "../Components/transactionmodal.module.css";
import { useModal } from "../context/modalContext";
import { useWallet } from "../context/WalletContextProvider";
import CustomModal from "./CustomModal";
import TransactionModalContent from "./TransactionModalContent";
import LoadingSvg from "./LoadingSvg";

export default function TransactionModal() {
  const { isTransactionModal, setIsTransactionModal } = useModal();

  const closeModal = () => {
    setIsTransactionModal(false);
  };

  return (
    <CustomModal isOpen={isTransactionModal} onClose={closeModal} width={450} height={525}>
      <div style={styles.container}>
        <h2 className={styles.title}>Transaction Details</h2>
        <TransactionModalContent closeModal={closeModal}/>
      </div>
    </CustomModal>
  );
}
