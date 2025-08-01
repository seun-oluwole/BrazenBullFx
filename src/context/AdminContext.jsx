import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "./AuthContext";

const AdminContext = createContext();

export default function AdminContextProvider({ children }) {
  const [investors, setInvestors] = useState([]);
  const [fetchAllWalletError, setFetchAllWalletError] = useState(null);
  const [isFetchingAllWallet, setIsFetchingAllWallet] = useState(false);
  const [isFetchingInvestors, setIsFetchingInvestors] = useState(false);
  const [fetchingInvestorsError, setFetchingInvestorsError] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState({
    totalInvestors: 0,
    totalWallets: 0,
    walletsBalance: 0,
    currency: "USD",
  });

  const { session } = userAuth();
  const userRole = session?.user?.user_metadata?.role;
  const user = session?.user?.id

  
  
  useEffect(() => {
    if (userRole === "admin") {
      fetchAllWallets(user);
      fetchInvestors(user);
    }
  }, [session]);

  const fetchAllWallets = async (user) => {
    if (!user) return
    setIsFetchingAllWallet(true);
    try {
      const { data: walletDetails, error: fetchError } = await supabase.from("wallet").select("*");
      if (fetchError) throw new Error(fetchError);

      if (walletDetails.length > 0) {
        setDashboardDetails((details) => ({
          ...details,
          totalInvestors: walletDetails.length,
          totalWallets: walletDetails.length,
          walletsBalance: walletDetails.reduce((accumulator, value) => accumulator + value.available_balance, 0),
        }));
      }
    } catch (error) {
      setFetchAllWalletError(error.message);
    } finally {
      setIsFetchingAllWallet(false);
    }
  };

  const fetchInvestors = async (user) => {
    if (!user) return
    setIsFetchingInvestors(true);
    try {
      const { data: investorDetails, error: fetchError } = await supabase.from("wallet").select("*");
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

  return (
    <AdminContext.Provider
      value={{
        ...dashboardDetails,
        investors,
        fetchAllWalletError,
        isFetchingAllWallet,
        fetchingInvestorsError,
        isFetchingInvestors,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
