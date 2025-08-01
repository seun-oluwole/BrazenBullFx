import CustomModal from "./CustomModal";
import { HiOutlineClipboardDocument } from "react-icons/hi2";
import { SelectDepositMethod } from "./Selectors";
import { useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "../context/AuthContext";
import LoadingSvg from "./LoadingSvg";
import styles from "../Components/depositmodal.module.css";
import LoadingSpinner from "./LoadingSpinner";
import { useWallet } from "../context/WalletContextProvider";
import { NumericFormat } from "react-number-format";
import toast from "react-hot-toast";

export default function DepositModal({ isDepositModalOpen, setIsDepositModalOpen }) {
  const [steps, setSteps] = useState(1);
  const [reachedStepTwo, setReachedStepTwo] = useState(false)
  const [amount, setAmount] = useState(0);
  const [formattedAmount, setFormattedAmount] = useState("")
  const [depositMethod, setDepositMethod] = useState("Gcash")
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingTransaction, setFetchingTransaction] = useState(false);
  const [generatingDetails, setGeneratingDetails] = useState(false);
  const [lastTransaction, setLastTransaction] = useState({});
  const [transactionError, setTransactionError] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(false)
 

  const { session } = userAuth();
  const { fetchAllTransactions } = useWallet();
  const userId = session?.user?.id;
  const transactionId = lastTransaction?.id
  console.log(transactionId);
  console.log(lastTransaction)

  useEffect(() => {
    if (reachedStepTwo) {
      fetchLastTransaction();
    }
  }, [steps]);

  const modalHeight = (step) => {
    if (step === 1) {
      return 335;
    } else if (step === 2) {
      return 545;
    }
  };

  const handleNextStep = () => {
    if (steps === 1) {
      setSteps((prev) => prev + 1)
      setReachedStepTwo(true)
    }
  }

  async function closeModal() {
    await deleteTransaction(transactionId)
    setIsDepositModalOpen(false);
    setSteps(1);
    setLastTransaction({});
    setAmount(0);
    setFormattedAmount("");
    setDepositMethod("Gcash");
    setReachedStepTwo(false)

    if (reachedStepTwo) {
      fetchAllTransactions(userId)
    }
  }

  const handleAmountInput = (values) => {
    setAmount(values.floatValue);
    setFormattedAmount(values.formattedValue)
    console.log(values)
  };

  const selectDepositMethod = (e) => {
    setDepositMethod(e.target.value)
  };

  console.log(amount);
  console.log(depositMethod);
  // console.log(transactionData)

  async function initializeDeposit() {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        transaction_title: "Deposit",
        transaction_amount: amount,
        transaction_status: "pending",
        transaction_method: depositMethod,
      });

      if (error) {
       toast.error(error.message)
       return;
      }
    } finally {
      setIsLoading(false);
      handleNextStep()
    }
  }

  async function fetchLastTransaction() {
    setFetchingTransaction(true);
    try {
      console.log(userId);
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(1);

      if (transactionError) {
        toast.error(transactionError.message)
        setTransactionError(transactionError.message);
        return;
      }

      setLastTransaction(transactionData[0]);
    } finally {
      setFetchingTransaction(false);
    }
  }

  async function deleteTransaction(id) {
    if (!id) return
     setDeletingTransaction(true)
    try {
      const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id)

      if (deleteError) {
        toast.error("Something went wrong! Try again.")
        return
      }

    } finally {
      toast.success("Deposit has been cancelled")
      setDeletingTransaction(false)
    }

  }

  return (
    <CustomModal isOpen={isDepositModalOpen} onClose={closeModal} width={450} height={modalHeight(steps)}>
      <div className={styles.container}>
        <h2 className={styles.title}>Deposit</h2>
        {steps === 1 ? (
          <div className={styles.stepOne}>
            <SelectDepositMethod value={depositMethod} handleInput={selectDepositMethod} />
            <div className={styles.depositDetailsContainer}>
              <h3 className={styles.subtitle}>Amount</h3>
              <NumericFormat
                className={styles.input}
                placeholder="Enter deposit amount"
                onValueChange={handleAmountInput}
                decimalScale={2}
                thousandSeparator
              />
              <button className={styles.button} onClick={initializeDeposit} disabled={!amount}>
                {isLoading ? <LoadingSvg width={25} height={25} color="#000"/> : "Proceed"}
              </button>
            </div>
          </div>
        ) : (
          ""
        )}

        {steps === 2 ? (
          <>
            {!fetchingTransaction ? (
              <>
              <div className={styles.depositInstruction}>
                <h3 className={styles.subtitle}>Deposit via {depositMethod}</h3>
                <p>✅ Please make your payment into the details provided for you below.</p>
                <p>✅ Please confirm details is correct before making your deposit.</p>
              </div>

              <span className={styles.depositAmount}>
                Deposit Amount: {formattedAmount}
              </span>
              {!generatingDetails ? (
                <>
                  <div className={styles.depositDetailsContainer}>
                    <div className={styles.depositDetails}>USDT (ERC 20)</div>
                    <div className={styles.depositDetails}>
                      <div>3ugaouy83uyaou938ayvs8ys</div>
                      <span>
                        <HiOutlineClipboardDocument className={styles.icon} />
                      </span>
                    </div>
                  </div>

                  <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={() => setIsDepositModalOpen(false)}>Deposit</button>
                    <button className={styles.cancel} onClick={closeModal}>
                     {deletingTransaction ? "Cancelling..." : "Cancel"}
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.spinnerContainer}>
                  <LoadingSpinner height={55} width={55} />
                  <p>Generating details please wait.</p>
                </div>
              )}

              {generatingDetails ? (
                <div className={styles.buttonContainer}>
                  <button className={styles.cancel} onClick={closeModal}>
                    {deletingTransaction ? "Cancelling..." : "Cancel"}
                  </button>
                </div>
              ) : (
                ""
              )}
              </>
            ) : (<div className={styles.spinner}><LoadingSpinner width={55} height={55}/></div>)}   
          </>
        ) : (
          ""
        )}
      </div>
    </CustomModal>
  );
}
