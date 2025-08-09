import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "./AuthContext";
import toast from "react-hot-toast";

const AdminContext = createContext();

export default function AdminContextProvider({ children }) {
  const [investors, setInvestors] = useState([]);
  const [fetchAllWalletError, setFetchAllWalletError] = useState(null);
  const [isFetchingAllWallet, setIsFetchingAllWallet] = useState(false);
  const [isFetchingInvestors, setIsFetchingInvestors] = useState(false);
  const [fetchingInvestorsError, setFetchingInvestorsError] = useState(false);
  const [fetchingInvestorTrans, setFetchingInvestorTrans] = useState(false);
  const [fetchingTransError, setFetchingTransError] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [investorTransDetail, setInvestorTransDetail] = useState({});
  const [fetchingInvestorTransDetail, setFetchingInvestorTransDetail] = useState(false);
  const [transDetailError, setTransDetailError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isOn, setIsOn] = useState(false)
 
  const [dashboardDetails, setDashboardDetails] = useState({
    totalInvestors: 0,
    totalWallets: 0,
    totalTransactions: 0,
  });

  const { session } = userAuth();
  const userRole = session?.user?.user_metadata?.role;
  const userId = session?.user?.id;

  useEffect(() => {
    if (userRole === "admin") {
      fetchAllWallets(userId);
      fetchInvestors(userId);
    }
  }, [session]);

  const fetchAllWallets = async (userId) => {
    if (!userId) return;
    setIsFetchingAllWallet(true);
    try {
      const { data: walletDetails, error: fetchWalletError } = await supabase
      .from("wallet")
      .select("*");

      if (fetchWalletError) throw new Error(fetchWalletError);

      const { data: transDetails, error: fetchTransError } = await supabase
      .from("transactions")
      .select("*");

      if (fetchTransError) throw new Error(fetchTransError);
     
      if (walletDetails.length > 0 && transDetails.length > 0) {
        setDashboardDetails((details) => ({
          ...details,
          totalInvestors: walletDetails.length,
          totalWallets: walletDetails.length,
          totalTransactions: transDetails.length
        }));
      }
    } catch (error) {
      setFetchAllWalletError(error.message);
    } finally {
      setIsFetchingAllWallet(false);
    }
  };

  const fetchInvestors = async (userId) => {
    if (!userId) return;
    setIsFetchingInvestors(true);
    try {
      const { data: investorDetails, error: fetchError } = await supabase
      .from("wallet")
      .select("*");
      if (fetchError) throw new Error(fetchError);

      if (investorDetails.length > 0) {
        setInvestors(investorDetails);
      }
    } catch (error) {
      setFetchingInvestorsError(error.message);
    } finally {
      setIsFetchingInvestors(false);
    }
  };

  const fetchInvestorTransactions = async (userId) => {
    if (!userId) return;
    setFetchingInvestorTrans(true);
    try {
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false });

      if (transactionError) {
        throw transactionError;
      }

      if (transactionData.length > 0) {
        setAllTransactions(transactionData);
      }
    } catch (error) {
      setFetchingTransError(error);
    } finally {
      setFetchingInvestorTrans(false);
    }
  };

  const fetchInvestorTransDetail = async (id) => {
    if (!id) return;
    setFetchingInvestorTransDetail(true);
    try {
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select()
        .eq("id", id);

      if (transactionError) throw new Error(transactionError);

      setInvestorTransDetail(transactionData[0]);
    } catch (error) {
      setTransDetailError(error);
    } finally {
      setFetchingInvestorTransDetail(false);
    }
  };

  const toggleGeneratingDetails = async (id) => {
    if (!id) return
    setIsToggling(true)
    try {
      const { error: updateError } = await supabase
      .from("transactions")
      .update({
        generating_details: !isOn,
      })
      .eq("id", id);

    if (updateError) throw new Error(updateError);
    setIsOn(!isOn)
    toast.success("Updated succesfully")
    } catch (error) {
      toast.error("Error: Failed to toggle")
    } finally {
      setIsToggling(false)
    }
    
  };

  const fetchGeneratingDetails = async (id) => {
    setIsToggling(true)
    try {
      const { data, error: fetchError } = await supabase
      .from("transactions")
      .select("generating_details")
      .eq("id", id);

      if (fetchError) throw new Error(updateError)
      setIsOn(data[0]?.generating_details)
    } catch (error) {
      toast.error("Error: something went wrong.")
    } finally {
      setIsToggling(false)
    }
    
  }

  return (
    <AdminContext.Provider
      value={{
        ...dashboardDetails,
        investors,
        fetchAllWalletError,
        isFetchingAllWallet,
        fetchingInvestorsError,
        isFetchingInvestors,
        allTransactions,
        setAllTransactions,
        fetchingInvestorTrans,
        fetchingTransError,
        fetchInvestorTransactions,
        investorTransDetail,
        fetchingInvestorTransDetail,
        transDetailError,
        fetchInvestorTransDetail,
        fetchGeneratingDetails,
        toggleGeneratingDetails,
        isToggling, 
        isOn
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
