import { createContext, useContext, useState } from "react";

const walletContext = createContext();

export default function WalletContextProvider({ children }) {
  const [availableBalance, setAvailableBalance] = useState("120,000");
  const [totalDeposit, setTotalDeposit] = useState("52,000");
  const [totalWithdrawn, setTotalWithdrawn] = useState("0");
  const [withdrawableBalance, setWithdrawableBalance] = useState("75,000");
  const [balanceCurrency, setBalanceCurrency] = useState("USD");
  const [cryptocurrency, setCryptocurrency] = useState("BTC");
  const [showBalance, setShowBalance] = useState(true);

  const toggleShowBalance = () => {
    if (showBalance) {
      setShowBalance(!showBalance);
      setAvailableBalance("*****");
      setTotalDeposit("*****");
      setTotalWithdrawn("*****");
      setWithdrawableBalance("*****");
    } else {
      setShowBalance(true);
      setAvailableBalance("120,000");
      setTotalDeposit("52,000");
      setTotalWithdrawn("0");
      setWithdrawableBalance("75000");
    }
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
