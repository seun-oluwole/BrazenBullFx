import { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../Utils/useLocalStorage";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "./AuthContext";
import toast from "react-hot-toast";

const walletContext = createContext();
const [getItem, setItem] = useLocalStorage();

export default function WalletContextProvider({ children }) {
  const [steps, setSteps] = useState(1)
  const [reachedStepTwo, setReachedStepTwo] = useState(false)
  const [showBalance, setShowBalance] = useState(true);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [fetchWalletError, setFetchWalletError] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [fetchingAllTransactions, setFetchingAllTransactions] = useState(false)
  const [fetchingTransaction, setFetchingTransaction] = useState(false);
  const [fetchingTransError, setFetchingTransError] = useState(null)
  const [transactionDetail, setTransactionDetail] = useState({})

  const [walletData, setWalletData] = useState({
    tier: "",
    availableBalance: 0,
    totalDeposit: 0,
    totalWithdrawn: 0,
    withdrawableBalance: 0,
    balanceCurrency: "",
    currencySymbol: "",
    cryptocurrency: "",
  });

  const { session } = userAuth();
  const userMetaData = session?.user?.user_metadata;
  const userId = session?.user?.id;

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
    if (userMetaData?.role === "user"){
      fetchUserWallet(userId);
      fetchAllTransactions(userId)
    }

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

  async function fetchUserWallet(userId) {
    if (!userId) return; // Prevents function from executing if there is no userId...

    setIsWalletLoading(true);
    try {
      const { error: walletError, data: walletData } = await supabase
        .from("wallet")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (walletError) {
        throw new Error(walletError)
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
          currencySymbol: walletData?.currency_symbol,
          cryptocurrency: walletData?.cryptocurrency,
        }));
      }
    }catch (error) {
      if (error) {
        setFetchWalletError(error)
      }
    }finally {
      setIsWalletLoading(false);
    }
  }

  const fetchAllTransactions = async (userId) => {
    if (!userId) return
    setFetchingAllTransactions(true)
    try {
    const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

      if (transactionError) {
        throw(transactionError)
      }
      
      setAllTransactions(transactionData);
    }
    catch (error) {
     if (error) setFetchingTransError(error)
    } finally {
      setFetchingAllTransactions(false)
    }
  };

  const fetchTransaction = async (id) => {
    if (!id) return
    setFetchingTransaction(true)
    try {
      const { data: transactionData, error: transactionError } = await supabase
      .from("transactions")
      .select()
      .eq("id", id)

      if (transactionError) throw new Error(transactionError)

      setTransactionDetail(transactionData[0]);
      return transactionData[0]
    } catch(error) {
      setFetchingTransError(error)
    } finally {
      setFetchingTransaction(false)
    }
  }

  const handleNextStep = () => {
    if (steps === 1) {
      setSteps((prev) => prev + 1);
      setReachedStepTwo(true);
    }
  };

  return (
    <walletContext.Provider
      value={{
        ...walletData,
        showBalance,
        toggleShowBalance,
        isWalletLoading,
        fetchWalletError,
        fetchUserWallet,
        allTransactions,
        fetchAllTransactions,
        setAllTransactions,
        fetchingAllTransactions,
        fetchingTransError,
        fetchTransaction,
        fetchingTransaction,
        transactionDetail,
        setTransactionDetail,
        steps,
        setSteps,
        reachedStepTwo,
        setReachedStepTwo,
        handleNextStep,
      }}
    >
      {children}
    </walletContext.Provider>
  );
}

export const useWallet = () => useContext(walletContext);
