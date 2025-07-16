import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";

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

  useEffect(() => {
    fetchAllWallets();
    fetchInvestors();
  }, []);

  const fetchAllWallets = async () => {
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

  const fetchInvestors = async () => {
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
