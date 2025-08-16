import CustomModal from "./CustomModal";
import LoadingSvg from "./LoadingSvg";
import { useEffect, useState } from "react";
import { SelectCryptoCurrency, SelectDepositMethod, SelectWithdrawalMethod } from "./Selectors";
import { NumericFormat } from "react-number-format";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { useModal } from "../context/modalContext";
import { useDebounce } from "../Utils/useDebounce";
import convertCurrency from "../Utils/convertCurrency";
import { getCurrencySymbol } from "../Utils/getCurrencySymbol";
import { HiArrowsRightLeft } from "react-icons/hi2";
import styles from "../Components/depositmodal.module.css";
import toast from "react-hot-toast";
import AmountConverter from "./AmountConverter";
import formatAmount from "../Utils/formatAmount";

export default function WithdrawModal() {
  const [steps, setSteps] = useState(1);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [convertingCurrency, setConvertingCurrency] = useState(false)
  const [withdrawalMethod, setWithdrawalMethod] = useState("Gcash");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [initializingWithdrawal, setInitializingWithdrawal] = useState(false);
  const [bankDetails, setBankDetails] = useState({ accountName: "", accountNumber: "", bankName: "" });
  const [gcashDetails, setGcashDetails] = useState({gcashName: "", gcashNumber: ""})
  const [cryptoAddress, setCryptoAddress] = useState("")
  const { isWithdrawModalOpen, setIsWithdrawModalOpen } = useModal()
  const { fetchUserWallet, balanceCurrency, depositCurrency, transactionDetail } = useWallet();
  const { session } = userAuth();
  const userId = session?.user?.id;

  const gcash = withdrawalMethod === "Gcash" && !gcashDetails.gcashName || !gcashDetails.gcashNumber
  const bank = withdrawalMethod === "Bank" && !bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName
  const crypto = withdrawalMethod === "Crypto" && !selectedCrypto || !cryptoAddress

  const isGcash = withdrawalMethod === "Gcash"
  const isBank = withdrawalMethod === "Bank"
  const isCrypto = withdrawalMethod === "Crypto"

  const debouncedQuery = useDebounce(amount, 1000)
   useEffect(() => { 
    if (debouncedQuery && balanceCurrency !== depositCurrency) {
      convertWithdrawCurrency()
    }
  }, [debouncedQuery])

  useEffect(() => {
    if (amount && balanceCurrency === depositCurrency) {
      convertWithdrawCurrency()
    }
  }, [amount])

   async function convertWithdrawCurrency() {
    setConvertingCurrency(true)
    try {
      const { convertedAmount, rate } = await convertCurrency(depositCurrency, balanceCurrency, amount)
      setConvertedAmount(convertedAmount)
      setExchangeRate(rate)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setConvertingCurrency(false)
    }
  }

  const selectWithdrawMethod = (e) => {
    setWithdrawalMethod(e.target.value);
  };

  const selectCrypto = (e) => {
    setSelectedCrypto(e.target.value);
  };

  const handleAmountInput = (values) => {
    setAmount(values.floatValue);
    setFormattedAmount(values.formattedValue);
  };

  const handleCheckBalance = async (userId) => {
    if (!userId) return;
    setCheckingBalance(true);
    try {
      const { data, error } = await supabase
      .from("wallet")
      .select("withdrawable_balance")
      .eq("user_id", userId);

      if (error) throw new Error(error);

      // Checks balance and returns true or false if balance is empty or insufficient...
      if (data.length > 0) {
        const balance = data[0]?.withdrawable_balance;
        if (balanceCurrency === depositCurrency) {
          if (balance === 0 || balance < amount) {
            toast.error("Insufficient balance")
            return false;
          } else {
            // returns true if there is enough balance...
            return true;
          }
        } else {
           if (balance === 0 || balance < convertedAmount) {
            toast.error("Insufficient balance")
            return false;
          } else {
            // returns true if there is enough balance...
            return true;
          }
        }
      }
    } catch (error) {
      if (error) {
        toast.error("Something went wrong! Try again.") 
        return
      }
    } finally {
      setCheckingBalance(false);
    }
  };

  const handleNextStep = async () => {
    const isBalanceSufficient = await handleCheckBalance(userId);
    if (isBalanceSufficient) {
      setSteps((prev) => prev + 1);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (isBank) {
      setBankDetails((details) => ({
        ...details,
        [name]: value,
      }));

    } else if (isGcash) {
        setGcashDetails((details) => ({
        ...details,
        [name]: value,
      }));

    } else if (isCrypto) setCryptoAddress(value)
  };

  const handleBalanceSettlement = async (amount) => {
    try {
      const { data: walletData, error } = await supabase
        .from("wallet")
        .select("withdrawable_balance")
        .eq("user_id", userId);

      if (error) {
        throw new Error(error);
      }

      if (walletData.length > 0) {
        const balance = walletData[0].withdrawable_balance;
        if (balance === 0 || balance < amount) return

        const newBalance = balance - amount;

        const { error: walletError } = await supabase
          .from("wallet")
          .update({ withdrawable_balance: newBalance })
          .eq("user_id", userId);

        if (walletError) {
          throw new Error(walletError);
        }
      }
    } catch (error) {
      if (error) {
        toast.error("Something went wrong! Try again.");
      }
    }
  };

  const initializeWithdrawal = async (userId) => {
    if (!userId || !convertedAmount) return;
    setInitializingWithdrawal(true);
    try {
      await handleBalanceSettlement(convertedAmount)
      
      if (isGcash) {
        if (!gcashDetails.gcashName && !gcashDetails.gcashNumber) return
          const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            transaction_title: "Withdraw",
            transaction_amount: amount,
            transaction_status: "pending",
            transaction_method: withdrawalMethod,
            withdrawal_account_number: gcashDetails.gcashNumber,
            withdrawal_account_name: gcashDetails.gcashName,
            withdraw_currency: depositCurrency,
            balance_currency: balanceCurrency,
            converted_amount: convertedAmount,
            exchange_rate: exchangeRate
          })
          .eq("user_id", userId);

          if (transactionError) {
            throw new Error(transactionError);
          }
      } else if (isBank) {
        if (!bankDetails.accountName && !bankName.accountNumber && !bankDetails.bankName)return
        const { error: transactionError } = await supabase
          .from("transactions")
          .insert({
            user_id: userId,
            transaction_title: "Withdraw",
            transaction_amount: amount,
            transaction_status: "pending",
            transaction_method: withdrawalMethod,
            withdrawal_account_number: bankDetails.accountNumber,
            withdrawal_account_name: bankDetails.accountName,
            withdrawal_bank_name: bankDetails.bankName,
            withdraw_currency: depositCurrency,
            balance_currency: balanceCurrency,
            converted_amount: convertedAmount,
            exchange_rate: exchangeRate
          })
          .eq("user_id", userId);

        if (transactionError) {
          throw new Error(transactionError);
        }
      } else if (isCrypto) {
        if (!selectCrypto && !cryptoAddress)return
        const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: userId,
          transaction_title: "Withdraw",
          transaction_amount: amount,
          transaction_status: "pending",
          transaction_method: withdrawalMethod,
          withdrawal_cryptocurrency: selectedCrypto,
          withdrawal_crypto_address: cryptoAddress,
          withdraw_currency: depositCurrency,
          balance_currency: balanceCurrency,
          converted_amount: convertedAmount,
          exchange_rate: exchangeRate
        })
        .eq("user_id", userId);

        if (transactionError) {
          throw new Error(transactionError);
        }
      }
    } catch (error) {
      if (error) {
        toast.error("Failed to complete withdrawal");
        return
      }
    } finally {
      toast.success("Your withdrawal was successful.");
      setInitializingWithdrawal(false);
    }
  };

  const handleWithdraw = async () => {
    await initializeWithdrawal(userId);
    closeModal();
    await fetchUserWallet(userId);
  };

  function closeModal() {
    setIsWithdrawModalOpen(false);
    setSteps(1);
    setWithdrawalMethod("Gcash");
    setAmount(0);
    setConvertedAmount(0)
    setFormattedAmount("");
    setBankDetails((details) => ({
      ...details,
      accountName: "",
      accountNumber: "",
      bankName: "",
    }));
    setGcashDetails((details) => ({
      ...details,
      gcashName: "",
      gcashNumber: ""
    }
    ));
    setCryptoAddress("")
  }

  return (
    <CustomModal isOpen={isWithdrawModalOpen} onClose={closeModal}>
      <div className={styles.container}>
        <h2 className={styles.title}>Withdraw</h2>
        {steps === 1 && (
          <div className={styles.stepOne}>
            <SelectWithdrawalMethod value={withdrawalMethod} handleInput={selectWithdrawMethod} />
            <div className={styles.depositDetailsContainer}>
              <div className={styles.amountContainer}>
                <h3 className={styles.subtitle}>Amount</h3>
                {formattedAmount && balanceCurrency !== depositCurrency &&  
                 <AmountConverter 
                 formattedAmount={formattedAmount}
                 convertedAmount={convertedAmount}
                 convertingCurrency={convertingCurrency}
                 />
                }
                {balanceCurrency === depositCurrency &&
                  <div>
                    <span>{`${formattedAmount}`}</span>
                  </div>
                }  
              </div>
              <NumericFormat
                className={styles.input}
                placeholder="Enter withdrawal amount"
                onValueChange={handleAmountInput}
                decimalScale={2}
                prefix={`${getCurrencySymbol(depositCurrency)}`}
                thousandSeparator
              />

              <button className={styles.button} onClick={handleNextStep} disabled={!formattedAmount || convertingCurrency}>
                {checkingBalance ? <LoadingSvg width={25} height={25} color="#000"/> : "Proceed"}
              </button>
            </div>
          </div>
        )}

        {steps === 2 && (
          <>
            <div className={styles.depositInstruction}>
              <h3 className={styles.subtitle}>Withdraw to {withdrawalMethod}</h3>
              <p>✅ Fill in your correct details into the provided field below.</p>
              <p>✅ Please confirm details is correct before making your withdrawal.</p>
            </div>

            <div className={styles.depositDetailsContainer}>
              <div className={styles.depositAmount}>
                Withdrawal Amount:
                <div className={styles.currencyContainer}>
                  {balanceCurrency !== depositCurrency ? (
                    <>
                      <span>
                        {getCurrencySymbol(balanceCurrency)}
                        {formatAmount(convertedAmount.toFixed(2))}
                      </span>
                      <HiArrowsRightLeft className={styles.icon}/>
                       <span>
                        {formattedAmount}
                      </span>
                    </>
                  ) : (
                    <span>
                      {getCurrencySymbol(balanceCurrency)}
                      {formatAmount(convertedAmount.toFixed(2))}
                    </span>
                  )}
                </div>
              </div>
              {isGcash && (
                <>
                  <input
                    className={styles.input}
                    value={gcashDetails.gcashName}
                    name="gcashName"
                    placeholder="Enter account name"
                    type="text"
                    onChange={handleInput}/>

                  <input
                    className={styles.input}
                    value={gcashDetails.gcashNumber}
                    name="gcashNumber"
                    placeholder="Enter account number"
                    type="text"
                    onChange={handleInput}/>
                </>
              )}
              {isBank && (
                <>
                  <input
                    className={styles.input}
                    value={bankDetails.accountName}
                    name="accountName"
                    placeholder="Enter account name"
                    type="text"
                    onChange={handleInput}
                  />
                  <input
                    className={styles.input}
                    value={bankDetails.accountNumber}
                    name="accountNumber"
                    placeholder="Enter account number"
                    type="text"
                    onChange={handleInput}
                  />
                  <input
                    className={styles.input}
                    value={bankDetails.bankName}
                    name="bankName"
                    placeholder="Enter bank name"
                    type="text"
                    onChange={handleInput}
                  />
                </>
              )}
              {isCrypto && (
                <>
                  <SelectCryptoCurrency value={selectedCrypto} handleInput={selectCrypto} />
                  <input
                    className={styles.input}
                    value={cryptoAddress}
                    name="cryptoAddress"
                    placeholder="Enter crypto address"
                    type="text"
                    onChange={handleInput}
                  />
                </>
              )}
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleWithdraw} disabled={bank && gcash && crypto}>
                {initializingWithdrawal ? <LoadingSvg width={25} height={25} color="#000"/> : "Withdraw"}
              </button>
              <button className={styles.cancel} onClick={closeModal}>
                Cancel Withdraw
              </button>
            </div>
          </>
        )}
      </div>
    </CustomModal>
  );
}
