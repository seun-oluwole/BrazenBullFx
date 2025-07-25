import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../Utils/useLocalStorage";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "./AuthContext";

const walletContext = createContext();
const [getItem, setItem] = useLocalStorage();

export default function WalletContextProvider({ children }) {
  const [showBalance, setShowBalance] = useState(true);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [fetchWalletError, setFetchWalletError] = useState(null);
  const [walletData, setWalletData] = useState({
    tier: "",
    availableBalance: 0,
    totalDeposit: 0,
    totalWithdrawn: 0,
    withdrawableBalance: 0,
    balanceCurrency: "",
    cryptocurrency: "",
  });

  const { userData, session } = userAuth();
  const { sub: userId } = userData || {};
  const userMetaData = session?.user?.user_metadata

  // Checks for a saved preference...
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

  useEffect(() => {
    if (userMetaData?.role === "user") fetchUserWallet();

    // Reset wallet state when a user logs out...
    if (!session) {
      setWalletData({
        availableBalance: 0,
        totalDeposit: 0,
        totalWithdrawn: 0,
        withdrawableBalance: 0,
        balanceCurrency: "",
        cryptocurrency: "",
      });
    }
  }, [session]);

  const toggleShowBalance = () => {
    setShowBalance((prev) => !prev);
  };

  async function fetchUserWallet() {
    if (!userId) return; // Prevents function from executing if there is no userId...

    setIsWalletLoading(true);
    try {
      const { error: walletError, data: walletData } = await supabase
        .from("wallet")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (walletError) {
        setFetchWalletError(walletError.message);
        return;
      }

      if (walletData) {
        setWalletData((prevData) => ({
          ...prevData,
          tier: walletData?.tier,
          availableBalance: walletData?.available_balance,
          totalDeposit: walletData?.total_deposit,
          totalWithdrawn: walletData?.total_withdrawn,
          withdrawableBalance: walletData?.withdrawable_balance,
          balanceCurrency: walletData?.currency,
          cryptocurrency: walletData?.cryptocurrency,
        }));
      }
    } finally {
      setIsWalletLoading(false);
    }
  }


  return (
    <walletContext.Provider
      value={{
        ...walletData,
        showBalance,
        toggleShowBalance,
        isWalletLoading,
        fetchWalletError,
        fetchUserWallet,
      }}
    >
      {children}
    </walletContext.Provider>
  );
}

export const useWallet = () => useContext(walletContext);
