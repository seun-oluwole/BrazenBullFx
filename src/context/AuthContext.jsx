import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../Utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

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
        if (event === "SIGNED_IN" && session?.user?.id) {

          // Check if wallet already exists
          const { data: walletData } = await supabase
            .from("wallet")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          const userMetaData = session?.user?.user_metadata
          if (!walletData && userMetaData?.role === "user") await createWallet(userMetaData);

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

  async function createWallet(user) {
    if (!user) return;
    const { error: walletError } = await supabase.from("wallet").insert([{
      user_id: user?.sub,
      available_balance: 0,
      total_deposit: 0,
      total_withdrawn: 0,
      withdrawable_balance: 0,
      currency: "USD",
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
  const signUpNewUser = async (email, password, firstName, lastName, phoneNumber) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: "user",
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const userMetaData = authData.user.user_metadata;

      // Create wallet data...
      if (userMetaData?.role === "user") {
        const { success: walletCreated, error: walletError } = await createWallet(userMetaData);

        if (walletCreated) {
          setIsWalletCreated(true);
          return { success: true };
        } else {
          throw new Error(walletError.message);
        }
      }
    } catch (error) {
      return { success: false, error };
    }
  };

  //Sign In
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  };

  //Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      return { success: false, error };
    }

    setUserData(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ session, signIn, signUpNewUser, signOut, userData, isSessionLoading, isWalletCreated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
