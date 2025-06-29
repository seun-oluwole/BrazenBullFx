import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../Utils/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [userData, setUserData] = useState({});
  const [supabaseError, setSupabaseError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
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
      setSupabaseError(error);
      return { success: false };
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
      setSupabaseError(error);
      return { success: false };
    }

    return { success: true };
  };

  //Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setSupabaseError(error);
      return { success: false };
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ session, signIn, signUpNewUser, signOut, userData, supabaseError, setSupabaseError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  return useContext(AuthContext);
};
