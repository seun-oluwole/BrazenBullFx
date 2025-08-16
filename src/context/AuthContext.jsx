import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../Utils/supabaseClient";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [signUpError, setSignUpError] = useState(null);
  const [signInUserError, setSignInUserError] = useState(null);
  const [signInAdminError, setSignInAdminError] = useState(null);
  const role = session?.user?.user_metadata?.role
 
  // Get and set user session on page load...
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
      setUserData(session?.user?.user_metadata);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUserData(session?.user?.user_metadata);

      setTimeout(async () => {
        if (event === "SIGNED_IN" && session?.user?.id && role === "user" ) {

          // Check if wallet already exists
          const { data: walletData } = await supabase
            .from("wallet")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          const userMetaData = session?.user?.user_metadata
          if (!walletData && role === "user") await createWallet(userMetaData);

          if (walletData) {
            setIsWalletCreated(true);
          } else {
            setIsWalletCreated(false);
          }
        } else {
          setIsWalletCreated(false);
        }
      }, 0);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function createWallet(user, countryCurrency) {
    if (!user) return;
    const { error: walletError } = await supabase.from("wallet").insert([{
      user_id: user?.sub,
      available_balance: 0,
      total_deposit: 0,
      total_withdrawn: 0,
      withdrawable_balance: 0,
      currency: countryCurrency,
      country_currency: countryCurrency,
      currency_symbol: "$",
      cryptocurrency: "USDT",
      tier: "1",
      first_name: user?.firstName,
      last_name: user?.lastName,
    }]);

    if (walletError) {
      return { success: false, walletError };
    }
    return { success: true };
  }

  // Sign up...
  const signUpNewUser = async (email, password, firstName, lastName, phoneNumber, countryCurrency, role) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: role,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
          },
        },
      });

      if (authError) throw authError

      const userMetaData = authData.user.user_metadata;

      // Create wallet data...
      if (userMetaData?.role === "user" && countryCurrency) {
        const { success: walletCreated, error: walletError } = await createWallet(userMetaData, countryCurrency);

        if (walletError) throw walletError
      }
      toast.success("Account created successfully.")
    } catch (error) {
      setSignUpError(error.message)
      toast.error("Error: Signup Failed.")

    } finally {
       let timeoutId = setTimeout(() => {
        setSignUpError(null)
        clearTimeout(timeoutId)  
      }, 2000)
    }
  };

  //Sign In User
  const signInUser = async (email, password) => {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) throw error
  
      const authRole = authData?.user?.user_metadata?.role
  
      if (authRole === "user") {
        toast.success("Welcome!")
      } else {
        await signOut()
        toast.error("Error: Unauthorized login.")
      } 
    } catch (error) {
      setSignInUserError(error.message)
      toast.error("Error: Login Error");

    } finally {
      let timeoutId = setTimeout(() => {
        setSignInUserError(null)
        clearTimeout(timeoutId)  
      }, 2000)
    }
  }
  //Sign In Admin
  const signInAdmin = async (email, password) => {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (signInError) throw signInError
  
      const authRole = authData?.user?.user_metadata?.role
  
      if (authRole === "admin") {
        toast.success("Welcome Admin")
      } else {
        toast.error("Error: Unathorised login")
        await signOut()
      }

    } catch (error) {
      setSignInAdminError(error.message)
      toast.error("Error: Login Error")

    } finally {
      let timeoutId = setTimeout(() => {
        setSignInAdminError(null)
        clearTimeout(timeoutId)  
      }, 2000)
    }
  }


  //Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      toast.error("Error: Logout failed.")
      return { success: false, error };
    }

    toast.success("Logout successful.")
    setUserData(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ session, signInUser, signInAdmin, signUpNewUser, signOut, userData, isSessionLoading, isWalletCreated, signUpError, signInAdminError, signInUserError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
