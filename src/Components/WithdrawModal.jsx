import CustomModal from "./CustomModal";
import LoadingSvg from "./LoadingSvg";
import { useEffect, useState } from "react";
import { SelectCryptoCurrency, SelectDepositMethod, SelectWithdrawalMethod } from "./Selectors";
import { NumericFormat } from "react-number-format";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { useModal } from "../context/modalContext";
import toast from "react-hot-toast";
import styles from "../Components/depositmodal.module.css";

export default function WithdrawModal() {
  const [steps, setSteps] = useState(1);
  const [amount, setAmount] = useState(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState("Gcash");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [initializingWithdrawal, setInitializingWithdrawal] = useState(false);
  const [bankDetails, setBankDetails] = useState({ accountName: "", accountNumber: "", bankName: "" });
  const [gcashDetails, setGcashDetails] = useState({gcashName: "", gcashNumber: ""})
  const [cryptoAddress, setCryptoAddress] = useState("")
  const { isWithdrawModalOpen, setIsWithdrawModalOpen } = useModal()
  const { fetchUserWallet } = useWallet();
  const { session } = userAuth();
  const userId = session?.user?.id;

  const gcash = withdrawalMethod === "Gcash" && !gcashDetails.gcashName || !gcashDetails.gcashNumber
  const bank = withdrawalMethod === "Bank" && !bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName
  const crypto = withdrawalMethod === "Crypto" && !selectedCrypto || !cryptoAddress

  const isGcash = withdrawalMethod === "Gcash"
  const isBank = withdrawalMethod === "Bank"
  const isCrypto = withdrawalMethod === "Crypto"

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
        if (balance <= 0 || balance < amount) {
          toast.error("Insufficient balance")
          return false;
        } else {
          // returns true if there is enough balance...
          return true;
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
    if (!userId) return;
    setInitializingWithdrawal(true);
    try {
      await handleBalanceSettlement(amount);
        if (isGcash) {
          if (!gcashDetails.gcashName && !gcashDetails.gcashNumber)return
          const { error: transactionError } = await supabase
            .from("transactions")
            .insert({
              user_id: userId,
              transaction_title: "Withdraw",
              transaction_amount: amount,
              transaction_status: "pending",
              transaction_method: withdrawalMethod,
              withdrawal_account_number: gcashDetails.gcashName,
              withdrawal_account_name: gcashDetails.gcashNumber,
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
              <h3 className={styles.subtitle}>Amount</h3>
              <NumericFormat
                className={styles.input}
                placeholder="Enter withdrawal amount"
                onValueChange={handleAmountInput}
                decimalScale={2}
                thousandSeparator
              />

              <button className={styles.button} onClick={handleNextStep} disabled={!formattedAmount}>
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
              <span className={styles.depositAmount}>Withdrawal Amount: {formattedAmount}</span>
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
