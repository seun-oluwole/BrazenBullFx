import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../Utils/useLocalStorage";

const walletContext = createContext();
const [getItem, setItem] = useLocalStorage();

export default function WalletContextProvider({ children }) {
  const [availableBalance, setAvailableBalance] = useState("120,000");
  const [totalDeposit, setTotalDeposit] = useState("52,000");
  const [totalWithdrawn, setTotalWithdrawn] = useState("0");
  const [withdrawableBalance, setWithdrawableBalance] = useState("75,000");
  const [balanceCurrency, setBalanceCurrency] = useState("USD");
  const [cryptocurrency, setCryptocurrency] = useState("BTC");
  const [showBalance, setShowBalance] = useState(true);

  //Checks for a saved preference...
  useEffect(() => {
    const savedPreference = getItem("balanceVisible");
    if (savedPreference !== null) {
      setShowBalance(savedPreference);
    }
  }, []);

  // Persists showBalance state to localStorage...
  useEffect(() => {
    setItem("balanceVisible", showBalance);
  }, [showBalance]);

  const toggleShowBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <walletContext.Provider
      value={{
        balanceCurrency,
        cryptocurrency,
        showBalance,
        availableBalance,
        totalDeposit,
        totalWithdrawn,
        withdrawableBalance,
        toggleShowBalance,
      }}
    >
      {children}
    </walletContext.Provider>
  );
}

export const useWallet = () => useContext(walletContext);
