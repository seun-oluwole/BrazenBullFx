import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../Utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session)
    });

    const {data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe()
  }, []);

  useEffect(() => {
    setUserData(session?.user?.user_metadata);
  }, [session]);

  // Sign up...
  const signUpNewUser = async (email, password, firstName, lastName, phoneNumber) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
        },
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
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
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error };
    }
    
    console.log(session)
    return { success: true };
    
  };

  return (
    <AuthContext.Provider
      value={{ session, signIn, signUpNewUser, signOut, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
