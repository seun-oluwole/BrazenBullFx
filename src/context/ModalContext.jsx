import { createContext, useContext, useState } from "react";

const ModalContext = createContext()

export default function ModalContextProvider({ children }) {
  const [isTransactionModal, setIsTransactionModal] = useState(false);

  return (
    <ModalContext.Provider value={{
      isTransactionModal,
      setIsTransactionModal
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)