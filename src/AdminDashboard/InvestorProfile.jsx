import SpiralSpinner from "../Components/SpiralSpinner";
import ViewContainer from "../Components/ViewContainer";
import InvestorTransHistory from "./InvestorTransHistory";
import { SelectCryptoCurrency, SelectCurrency, SelectDepositCurrency, SelectTier } from "../Components/Selectors";
import { useParams } from "react-router";
import { supabase } from "../Utils/supabaseClient";
import { useEffect, useReducer, useState } from "react";
import { userAuth } from "../context/AuthContext";
import { NumericFormat } from "react-number-format";
import { useAdmin } from "../context/AdminContext";
import styles from "./investorprofile.module.css";
import convertCurrency from "../Utils/convertCurrency";
import CurrencyList from "currency-list";
import fetchExchangeRate from "../Utils/getExchangeRate";
import { getCurrencySymbol } from "../Utils/getCurrencySymbol";
import toast from "react-hot-toast";

export default function InvestorProfile() {
  const { userId } = useParams();
  const { allTransactions, fetchInvestorTransactions } = useAdmin()
  const [investorData, setInvestorData] = useState({});
  const [error, setError] = useState(null);
  const [inputData, setInputData] = useState({
    tier: "",
    currency: "",
    depositCurrency: "",
    cryptocurrency: "",
    currencySymbol: "",
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
    depositCurrency: false,
  });
  const { session } = userAuth();
  const userMetaData = session?.user?.user_metadata;
 
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
    if (action.type === "country_currency") {
      return { ...isLoading, depositCurrency: action.payload }
    }
  }

  useEffect(() => {
    if (userMetaData?.role === "admin") {
      fetchInvestor()
      fetchInvestorTransactions(userId)
    } 
  }, []);

  const fetchInvestor = async () => {
    dispatch({ type: "investor", payload: true });
    try {
      const { data: investorData, error } = await supabase.from("wallet").select("*").eq("user_id", userId);
      if (error) throw new Error(error);

      setInvestorData(investorData[0]);
    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: "investor", payload: false });
    }
  };

  const handleInput = (values, sourceInfo) => {
    //gets the name attribute from the sourceInfo
    const name = sourceInfo.event.target.name
    setInputData((data) => ({
      ...data,
      [name]: values.floatValue,
    }));
  };

  const handleSelectInput = (e) => {
    const { name, value } = e.target
    setInputData((data) => ({
      ...data,
      [name]: value,
    }));

    if (name === "currency") {
      const currencyValues = Object.values(CurrencyList.getAll("en_US"));
      const filteredCurrency = currencyValues.find(({ code }) => code === value);
      setInputData((data) => ({
        ...data,
        currencySymbol: filteredCurrency.symbol
      }))
    }
  }

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
    if (investorData?.currency === inputData.currency) return
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const rate = await fetchExchangeRate(investorData?.currency, inputData.currency)
      const convertedAvailableBal = rate * investorData?.available_balance
      const convertedTotalDeposit = rate * investorData?.total_deposit
      const convertedTotalWithdrawn = rate * investorData?.total_withdrawn
      const convertedWithdrawableBal = rate * investorData?.withdrawable_balance
      

      //Update all wallet balance with converted amount
      const { error: updateError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: inputData.currency,
          available_balance: convertedAvailableBal,
          total_deposit: convertedTotalDeposit,
          total_withdrawn: convertedTotalWithdrawn,
          withdrawable_balance: convertedWithdrawableBal
        })
        .eq("user_id", userId);
      
      if (updateError) throw new Error(updateError);

      // Convert and update transaction currency
      await Promise.all(allTransactions.map(async (transaction) => {
        if (transaction?.transaction_title === "Deposit") {
          const { convertedAmount, rate } = await convertCurrency(transaction?.deposit_currency, inputData.currency, transaction?.transaction_amount);
          const { error: updateError } = await supabase
          .from("transactions")
          .update({
            balance_currency: inputData.currency,
            converted_amount: convertedAmount,
            exchange_rate: rate
          })
          .eq("id", transaction?.id);

          if (updateError) throw updateError

        } else if (transaction?.transaction_title === "Withdraw"){
          const {convertedAmount, rate} = await convertCurrency(transaction?.withdraw_currency, inputData.currency, transaction?.transaction_amount);

          const { error: updateError } = await supabase
          .from("transactions")
          .update({
            balance_currency: inputData.currency,
            converted_amount: convertedAmount,
            exchange_rate: rate
          })
          .eq("id", transaction?.id);

          if (updateError) throw updateError
        }
      })).catch(err => toast.error(err.message))

      await fetchInvestor();

    } catch (error) {
      setError(error);
    } finally {
      dispatch({ type: `${walletColumn}`, payload: false });
    }
  };

  const updateDepositCurrency = async (walletColumn) => {
    dispatch({ type: `${walletColumn}`, payload: true });
    try {
      const { error: updateWalletError } = await supabase
        .from("wallet")
        .update({
          [walletColumn]: inputData.depositCurrency,
        })
        .eq("user_id", userId);

      if (updateWalletError) throw new Error(updateError);
      await fetchInvestor();
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
                    <SelectTier handleInput={handleSelectInput} value={inputData.tier} />
                    <button className={styles.button} onClick={() => updateTier("tier")}>
                      {isLoading.tier ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>Balance Currency: {investorData?.currency}</div>
                  <div className={styles.inputContainer}>
                    <SelectCurrency handleInput={handleSelectInput} value={inputData.currency} />
                    <button className={styles.button} onClick={() => updateCurrency("currency")}>
                      {isLoading.currency ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>Deposit Currency: {investorData?.country_currency}</div>
                  <div className={styles.inputContainer}>
                    <SelectDepositCurrency handleInput={handleSelectInput} value={inputData.depositCurrency} />
                    <button className={styles.button} onClick={() => updateDepositCurrency("country_currency")}>
                      {isLoading.depositCurrency ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>CryptoCurrency: {investorData?.cryptocurrency}</div>
                  <div className={styles.inputContainer}>
                    <SelectCryptoCurrency handleInput={handleSelectInput} value={inputData.cryptocurrency} />
                    <button className={styles.button} onClick={() => updateCryptoCurrency("cryptocurrency")}>
                      {isLoading.crypto ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
              
                <div>
                  <div className={styles.subTitle}>
                    Available Balance: {`${investorData?.available_balance?.toLocaleString()} ${investorData?.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                
                    <NumericFormat
                      className={styles.input}
                      name="availableBalance"
                      onValueChange={handleInput}
                      decimalScale={2}
                      prefix={getCurrencySymbol(investorData?.currency)}
                      thousandSeparator
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
  
                     <NumericFormat
                      className={styles.input}
                      name="totalDeposit"
                      onValueChange={handleInput}
                      decimalScale={2}
                      prefix={getCurrencySymbol(investorData?.currency)}
                      thousandSeparator
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
                    <NumericFormat
                      className={styles.input}
                      name="totalWithdrawn"
                      onValueChange={handleInput}
                      decimalScale={2}
                      prefix={getCurrencySymbol(investorData?.currency)}
                      thousandSeparator
                    />
                    <button className={styles.button} onClick={() => updateTotalWithdrawn("total_withdrawn")}>
                      {isLoading.totalWithdrawn ? <SpiralSpinner width={15} height={15} /> : "Update"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className={styles.subTitle}>
                    Withdrawable Balance:{" "}
                    {`${investorData?.withdrawable_balance?.toLocaleString()} ${investorData?.currency}`}
                  </div>
                  <div className={styles.inputContainer}>
                   <NumericFormat
                      className={styles.input}
                      name="withdrawableBalance"
                      onValueChange={handleInput}
                      decimalScale={2}
                      prefix={getCurrencySymbol(investorData?.currency)}
                      thousandSeparator
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
        <div className={styles.error}>{error ? "Check your connection and try again." : ""}</div>
      )}
    <InvestorTransHistory userId={userId}/>
    </ViewContainer>
  );
}
