import { useParams } from "react-router";
import { supabase } from "../Utils/supabaseClient";
import { useEffect, useReducer, useState } from "react";
import { SelectCryptoCurrency, SelectCurrency, SelectTier } from "../Components/Selectors";
import SpiralSpinner from "../Components/SpiralSpinner";
import ViewContainer from "../Components/ViewContainer";
import styles from "./investorprofile.module.css";

export default function InvestorProfile() {
  const { userId } = useParams();
  const [investorData, setInvestorData] = useState({});
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    tier: "",
    currency: "",
    cryptocurrency: "",
    availableBalance: 0,
    totalDeposit: 0,
    totalWithdrawn: 0,
    withdrawableBalance: 0,
  });
  const [isLoading, dispatch] = useReducer(reducer, {
    investor: false,
    tier: false,
    currency: false,
    crypto: false,
    availableBal: false,
    totalDeposit: false,
    totalWithdrawn: false,
    withdrawableBal: false,
  });

  function reducer(isLoading, action) {
    if (action.type === "investor") {
      return { ...isLoading, investor: action.payload };
    }

    if (action.type === "tier") {
      return { ...isLoading, tier: action.payload };
    }
    if (action.type === "currency") {
      return { ...isLoading, currency: action.payload };
    }
    if (action.type === "cryptocurrency") {
      return { ...isLoading, crypto: action.payload };
    }
    if (action.type === "available_balance") {
      return { ...isLoading, availableBal: action.payload };
    }
    if (action.type === "total_deposit") {
      return { ...isLoading, totalDeposit: action.payload };
    }
    if (action.type === "total_withdrawn") {
      return { ...isLoading, totalWithdrawn: action.payload };
    }
    if (action.type === "withdrawable_balance") {
      return { ...isLoading, withdrawableBal: action.payload };
    }
  }

  useEffect(() => {
    fetchInvestor().then((data) => console.log(data));
  }, []);

  const fetchInvestor = async () => {
    dispatch({ type: "investor", payload: true });
    try {
      const { data: investorData, error } = await supabase.from("wallet").select("*").eq("user_id", userId);
      if (error) throw new Error(error);

      setInvestorData(investorData[0]);
      return investorData;
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: "investor", payload: false });
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const updateTier = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: inputData.tier,
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateCurrency = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: inputData.currency,
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateCryptoCurrency = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: inputData.cryptocurrency,
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateTotalDeposit = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: Number(inputData.totalDeposit),
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateAvailableBal = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: Number(inputData.availableBalance),
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateTotalWithdrawn = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: Number(inputData.totalWithdrawn),
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };
  
  const updateWithdrawableBal = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: Number(inputData.withdrawableBalance),
        })
        .eq("user_id", userId);

      await fetchInvestor();

      if (updateError) throw new Error(updateError);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  return (
    <ViewContainer>
      <h2 className={styles.title}>Investor Profile</h2>
      {!error ? (
        <>
          {!isLoading.investor ? (
            <div className={styles.mainContainer}>
              <div className={styles.container}>
                <div>
                  <div className={styles.subTitle}>Name</div>
                  <div className={styles.name}>
                    {`${investorData?.first_name} ${investorData?.last_name}`}{" "}
                    <span className={styles.tier}>
                      {investorData?.tier === "V.I.P" ? investorData?.tier : `TIER ${investorData?.tier}`}
                    </span>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>Tier</div>
                  <div className={styles.inputContainer}>
                    <SelectTier handleInput={handleInput} value={inputData.tier} />
                    <button className={styles.button} onClick={() => updateTier("tier")}>
                      {isLoading.tier ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>Currency: {investorData?.currency}</div>
                  <div className={styles.inputContainer}>
                    <SelectCurrency handleInput={handleInput} value={inputData.currency} />
                    <button className={styles.button} onClick={() => updateCurrency("currency")}>
                      {isLoading.currency ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>CryptoCurrency: {investorData?.cryptocurrency}</div>
                  <div className={styles.inputContainer}>
                    <SelectCryptoCurrency handleInput={handleInput} value={inputData.cryptocurrency} />
                    <button className={styles.button} onClick={() => updateCryptoCurrency("cryptocurrency")}>
                      {isLoading.crypto ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>
                    Available Balance: {`${investorData?.available_balance?.toLocaleString()} ${investorData.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      name="availableBalance"
                      value={inputData.availableBalance}
                      onChange={handleInput}
                    />
                    <button className={styles.button} onClick={() => updateAvailableBal("available_balance")}>
                      {isLoading.availableBal ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>
                    Total Deposit: {`${investorData?.total_deposit?.toLocaleString()} ${investorData?.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      name="totalDeposit"
                      value={inputData.totalDeposit}
                      onChange={handleInput}
                    />
                    <button className={styles.button} onClick={() => updateTotalDeposit("total_deposit")}>
                      {isLoading.totalDeposit ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>
                    Total Withdrawn: {`${investorData?.total_withdrawn?.toLocaleString()} ${investorData?.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      name="totalWithdrawn"
                      value={inputData.totalWithdrawn}
                      placeholder={investorData?.total_withdrawn}
                      onChange={handleInput}
                    />
                    <button className={styles.button} onClick={() => updateTotalWithdrawn("total_withdrawn")}>
                      {isLoading.totalWithdrawn ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>
                    Withdrawable Balance: {`${investorData?.withdrawable_balance?.toLocaleString()} ${investorData?.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                    <input
                      className={styles.input}
                      type="text"
                      name="withdrawableBalance"
                      value={inputData.withdrawableBalance}
                      placeholder={investorData?.withdrawable_balance}
                      onChange={handleInput}
                    />
                    <button className={styles.button} onClick={() => updateWithdrawableBal("withdrawable_balance")}>
                      {isLoading.withdrawableBal ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.spiralContainer}>
              <SpiralSpinner width={30} height={30} />
            </div>
          )}
        </>
      ) : (
        <div className={styles.error}>{error ? "Something went wrong! Try again." : ""}</div>
      )}
    </ViewContainer>
  );
}
