import { createContext, useContext, useState } from "react";

const ModalContext = createContext()

export default function ModalContextProvider({ children }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isAdminLogoutModalOpen, setIsAdminLogoutModalOpen] = useState(false);
  const [isTransactionModal, setIsTransactionModal] = useState(false);
  const [isTransHistoryModal, setIsTransHistoryModal] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  return (
    <ModalContext.Provider value={{
      isTransactionModal,
      setIsTransactionModal,
      isTransHistoryModal,
      setIsTransHistoryModal,
      isDepositModalOpen,
      setIsDepositModalOpen,
      isWithdrawModalOpen,
      setIsWithdrawModalOpen,
      isLogoutModalOpen,
      setIsLogoutModalOpen,
      isAdminLogoutModalOpen, 
      setIsAdminLogoutModalOpen
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)