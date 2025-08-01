import CustomModal from "./CustomModal";
import { useEffect, useState } from "react";
import { SelectCryptoCurrency, SelectDepositMethod, SelectWithdrawalMethod } from "./Selectors";
import styles from "../Components/depositmodal.module.css";
import { NumericFormat } from "react-number-format";
import { supabase } from "../Utils/supabaseClient";
import toast from "react-hot-toast";
import { userAuth } from "../context/AuthContext";
import LoadingSvg from "./LoadingSvg";
import { useWallet } from "../context/WalletContextProvider";

export default function WithdrawModal({ isWithdrawModalOpen, setIsWithdrawModalOpen }) {
  const [steps, setSteps] = useState(1);
  const [amount, setAmount] = useState(0);
  const [withdrawalMethod, setWithdrawalMethod] = useState("Gcash");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [isBankAccount, setIsBankAccount] = useState(false);
  const [isCrypto, setIsCrypto] = useState(false);
  const [isGcash, setIsGcash] = useState(false);
  const [checkingBalance, setCheckingBalance] = useState(false);
  const [initializingWithdrawal, setInitializingWithdrawal] = useState(false);
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    cryptoAddress: "",
  });

  const { fetchAllTransactions, fetchUserWallet } = useWallet();
  const { session } = userAuth();
  const userId = session?.user?.id;

  // Updates state to display feilds based on selected value.
  useEffect(() => {
    if (withdrawalMethod === "Gcash") {
      setIsGcash(true);
      setIsBankAccount(false);
      setIsCrypto(false);
    } else if (withdrawalMethod === "Bank") {
      setIsBankAccount(true);
      setIsCrypto(false);
      setIsGcash(false);
    } else if (withdrawalMethod === "Crypto") {
      setIsCrypto(true);
      setIsGcash(false);
      setIsBankAccount(false);
    }
  }, [withdrawalMethod, isWithdrawModalOpen]);

  // Custom modal height adjustment according to steps
  const modalHeight = (step) => {
    if (step === 1) {
      return 335;
    } else if (step === 2 && !isBankAccount) {
      return 555;
    } else if (step === 2 && isBankAccount) {
      return 615;
    }
  };

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
      const { data, error } = await supabase.from("wallet").select("withdrawable_balance").eq("user_id", userId);

      if (error) {
        throw new Error(error);
      }
      // Checks balance and returns true or false if balance is empty or insufficient...
      if (data.length > 0) {
        const balance = data[0]?.withdrawable_balance;
        console.log(balance);
        if (balance <= 0 || balance < amount) {
          toast.error("Insufficient balance")
          return false;
        } else {
          // returns true if thhere is enough balance...
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
    setWithdrawalDetails((details) => ({
      ...details,
      [name]: value,
    }));
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
      const { accountName, accountNumber, bankName, cryptoAddress } = withdrawalDetails;
      if (accountName || accountNumber || bankName || cryptoAddress || amount || selectedCrypto) {
        if (isGcash) {
          const { error: transactionError } = await supabase
            .from("transactions")
            .insert({
              user_id: userId,
              transaction_title: "Withdraw",
              transaction_amount: amount,
              transaction_status: "pending",
              transaction_method: withdrawalMethod,
              withdrawal_account_number: accountNumber,
              withdrawal_account_name: accountName,
            })
            .eq("user_id", userId);

          if (transactionError) {
            throw new Error(transactionError);
          }
        } else if (isBankAccount) {
          const { error: transactionError } = await supabase
            .from("transactions")
            .insert({
              user_id: userId,
              transaction_title: "Withdraw",
              transaction_amount: amount,
              transaction_status: "pending",
              transaction_method: withdrawalMethod,
              withdrawal_account_number: accountNumber,
              withdrawal_account_name: accountName,
              withdrawal_bank_name: bankName,
            })
            .eq("user_id", userId);

          if (transactionError) {
            throw new Error(transactionError);
          }
        } else if (isCrypto) {
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
    await fetchAllTransactions(userId);
    await fetchUserWallet(userId);
  };

  function closeModal() {
    setIsWithdrawModalOpen(false);
    setSteps(1);
    setIsBankAccount(false);
    setIsCrypto(false);
    setIsGcash(false);
    setWithdrawalMethod("Gcash");
    setAmount(0);
    setFormattedAmount("");
    setWithdrawalDetails((details) => ({
      ...details,
      accountName: "",
      accountNumber: "",
      bankName: "",
      cryptoAddress: "",
    }));
  }

  return (
    <CustomModal isOpen={isWithdrawModalOpen} onClose={closeModal} width={450} height={modalHeight(steps)}>
      <div className={styles.container}>
        <h2 className={styles.title}>Withdraw</h2>
        {steps === 1 ? (
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
        ) : (
          ""
        )}

        {steps === 2 ? (
          <>
            <div className={styles.depositInstruction}>
              <h3 className={styles.subtitle}>Withdraw to {withdrawalMethod}</h3>
              <p>✅ Fill in your correct details into the provided field below.</p>
              <p>✅ Please confirm details is correct before making your withdrawal.</p>
            </div>

            <div className={styles.depositDetailsContainer}>
              <span className={styles.depositAmount}>Withdrawal Amount: {formattedAmount}</span>
              {isCrypto ? <SelectCryptoCurrency value={selectedCrypto} handleInput={selectCrypto} /> : ""}
              {isBankAccount || isGcash ? (
                <input
                  className={styles.input}
                  value={withdrawalDetails.accountName}
                  name="accountName"
                  placeholder="Enter account name"
                  type="text"
                  onChange={handleInput}
                />
              ) : (
                ""
              )}
              {isBankAccount || isGcash ? (
                <input
                  className={styles.input}
                  value={withdrawalDetails.accountNumber}
                  name="accountNumber"
                  placeholder="Enter account number"
                  type="text"
                  onChange={handleInput}
                />
              ) : (
                ""
              )}
              {isBankAccount ? (
                <input
                  className={styles.input}
                  value={withdrawalDetails.bankName}
                  name="bankName"
                  placeholder="Enter bank name"
                  type="text"
                  onChange={handleInput}
                />
              ) : (
                ""
              )}
              {isCrypto ? (
                <input
                  className={styles.input}
                  value={withdrawalDetails.cryptoAddress}
                  name="cryptoAddress"
                  placeholder="Enter crypto address"
                  type="text"
                  onChange={handleInput}
                />
              ) : (
                ""
              )}
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.button} onClick={handleWithdraw}>
                {initializingWithdrawal ? <LoadingSvg width={25} height={25} color="#000"/> : "Withdraw"}
              </button>
              <button className={styles.cancel} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </CustomModal>
  );
}
