import CustomModal from "./CustomModal";
import LoadingSpinner from "./LoadingSpinner";
import LoadingSvg from "./LoadingSvg";
import { HiArrowsRightLeft, HiOutlineClipboardDocument } from "react-icons/hi2";
import { SelectDepositMethod } from "./Selectors";
import { useEffect, useState } from "react";
import { supabase } from "../Utils/supabaseClient";
import { userAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContextProvider";
import { NumericFormat } from "react-number-format";
import { useModal } from "../context/ModalContext";
import { useDebounce } from "../Utils/useDebounce";
import { getCurrencySymbol } from "../Utils/getCurrencySymbol";
import convertCurrency from "../Utils/convertCurrency";
import toast from "react-hot-toast";
import styles from "../Components/depositmodal.module.css";
import AmountConverter from "./AmountConverter";
import formatAmount from "../Utils/formatAmount";
import handleCopyToClipboard from "../Utils/copyToClipboard";

export default function DepositModal() {
  const [amount, setAmount] = useState(0);
  const [formattedAmount, setFormattedAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [depositMethod, setDepositMethod] = useState("Gcash");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingLastTransaction, setFetchingLastTransaction] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(false);
  const [submittingDeposit, setSubmittingDeposit] = useState(false);
  const [convertingCurrency, setConvertingCurrency] = useState(false);

  const { session } = userAuth();
  const { isDepositModalOpen, setIsDepositModalOpen } = useModal();
  const {
    depositCurrency,
    balanceCurrency,
    transactionDetail,
    setTransactionDetail,
    fetchAllTransactions,
    fetchingTransaction,
    steps,
    setSteps,
    reachedStepTwo,
    setReachedStepTwo,
    handleNextStep,
  } = useWallet();
  const userId = session?.user?.id;
  const transactionId = transactionDetail?.id;
  const isCrypto = transactionDetail?.transaction_method === "Crypto";
  const isGcash = transactionDetail?.transaction_method === "Gcash";
  const isBank = transactionDetail?.transaction_method === "Bank";
  const isPending = transactionDetail?.transaction_status === "pending";

  const debouncedQuery = useDebounce(amount, 1000);

  useEffect(() => {
    if (debouncedQuery && balanceCurrency !== depositCurrency) {
      convertDepositCurrency();
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (amount && balanceCurrency === depositCurrency) {
      convertDepositCurrency();
    }
  }, [amount]);

  const closeModal = () => {
    setIsDepositModalOpen(false);
    resetDepositFlow();
  };

  async function cancelDeposit() {
    if (reachedStepTwo) {
      await deleteTransaction(transactionId);
      closeModal();
      fetchAllTransactions(userId);
    }
  }

  const handleDeposit = async (id) => {
    if (!id) return;
    setSubmittingDeposit(true);
    try {
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ confirming_deposit: true })
        .eq("id", id);

      if (updateError) throw new Error(updateError);
    } catch (error) {
      toast.error("Error: Failed to submit deposit");
    } finally {
      setSubmittingDeposit(false);
    }
  };

  const resetDepositFlow = () => {
    setSteps(1);
    setTransactionDetail({});
    setAmount(0);
    setConvertedAmount(0);
    setFormattedAmount("");
    setDepositMethod("Gcash");
    setReachedStepTwo(false);
  };

  const handleAmountInput = (values) => {
    setAmount(values.floatValue);
    setFormattedAmount(values.formattedValue);
  };

  const selectDepositMethod = (e) => {
    setDepositMethod(e.target.value);
  };

  async function initializeDeposit() {
    if (!convertedAmount) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: userId,
        transaction_title: "Deposit",
        transaction_amount: amount,
        transaction_status: "pending",
        transaction_method: depositMethod,
        balance_currency: balanceCurrency,
        deposit_currency: depositCurrency,
        converted_amount: convertedAmount,
        exchange_rate: exchangeRate,
      });

      if (error) throw new Error("Error: Failed to initialize deposit.");
    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
      handleNextStep();
      await fetchLastTransaction();
    }
  }

  async function fetchLastTransaction() {
    setFetchingLastTransaction(true);
    try {
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .limit(1);

      if (transactionError) {
        toast.error("Sorry, something went wrong.");
        setTransactionError(transactionError);
        return;
      }

      setTransactionDetail(transactionData[0]);
    } finally {
      setFetchingLastTransaction(false);
    }
  }

  async function deleteTransaction(id) {
    if (!id) return;
    setDeletingTransaction(true);
    try {
      const { error: deleteError } = await supabase.from("transactions").delete().eq("id", id);

      if (deleteError) {
        toast.error("Error: Failed to cancel deposit");
        return;
      }
      toast.success("Deposit has been cancelled");
    } finally {
      setDeletingTransaction(false);
    }
  }

  async function convertDepositCurrency() {
    setConvertingCurrency(true);
    try {
      const { convertedAmount, rate } = await convertCurrency(depositCurrency, balanceCurrency, amount);
      setConvertedAmount(convertedAmount);
      setExchangeRate(rate);
    } catch (error) {
      toast.error(error);
    } finally {
      setConvertingCurrency(false);
    }
  }
  return (
    <CustomModal isOpen={isDepositModalOpen} onClose={closeModal}>
      <div className={styles.container}>
        <h2 className={styles.title}>Deposit</h2>
        {steps === 1 && (
          <div className={styles.stepOne}>
            <SelectDepositMethod value={depositMethod} handleInput={selectDepositMethod} />
            <div className={styles.depositDetailsContainer}>
              <div className={styles.amountContainer}>
                <h3 className={styles.subtitle}>Amount</h3>
                {formattedAmount && balanceCurrency !== depositCurrency && (
                  <AmountConverter
                    formattedAmount={formattedAmount}
                    convertingCurrency={convertingCurrency}
                    convertedAmount={convertedAmount}
                  />
                )}
                {balanceCurrency === depositCurrency && (
                  <div>
                    <span>{`${formattedAmount}`}</span>
                  </div>
                )}
              </div>
              <NumericFormat
                className={styles.input}
                placeholder="Enter deposit amount"
                onValueChange={handleAmountInput}
                decimalScale={2}
                prefix={`${getCurrencySymbol(depositCurrency)}`}
                thousandSeparator
              />
              <button
                className={styles.button}
                onClick={initializeDeposit}
                disabled={!amount || !debouncedQuery || convertingCurrency}
              >
                {isLoading ? <LoadingSvg width={25} height={25} color="#000" /> : "Proceed"}
              </button>
            </div>
          </div>
        )}

        {steps === 2 && (
          <>
            {fetchingTransaction || fetchingLastTransaction ? (
              <div className={styles.spinnerContainer}>
                <LoadingSpinner width={55} height={55} />
              </div>
            ) : (
              <>
                <div className={styles.depositInstruction}>
                  <h3 className={styles.subtitle}>Deposit via {transactionDetail?.transaction_method}</h3>
                  <p>
                    ✅ Please make your payment of{" "}
                    <span className={styles.deposit}>
                      {balanceCurrency !== depositCurrency
                        ? `${getCurrencySymbol(depositCurrency)}${formatAmount(
                            transactionDetail?.transaction_amount.toFixed(2)
                          )}`
                        : `${getCurrencySymbol(depositCurrency)}${formatAmount(
                            transactionDetail?.converted_amount.toFixed(2)
                          )}`}
                    </span>{" "}
                    into the details provided for you below.
                  </p>
                  <p>✅ Click on Confirm Deposit to submit your deposit for confirmation.</p>
                </div>

                <div className={styles.depositAmount}>
                  <div>Deposit Amount:</div>
                  <div className={styles.currencyContainer}>
                    {balanceCurrency !== depositCurrency ? (
                      <>
                        <span>
                          {getCurrencySymbol(transactionDetail?.deposit_currency)}
                          {formatAmount(transactionDetail?.transaction_amount?.toFixed(2))}
                        </span>
                        <HiArrowsRightLeft className={styles.icon} />
                        <span>
                          {getCurrencySymbol(transactionDetail?.balance_currency)}
                          {formatAmount(transactionDetail?.converted_amount?.toFixed(2))}
                        </span>
                      </>
                    ) : (
                      <span>
                        {getCurrencySymbol(transactionDetail?.balance_currency)}
                        {formatAmount(transactionDetail?.converted_amount?.toFixed(2))}
                      </span>
                    )}
                  </div>
                </div>
                {!transactionDetail?.generating_details ? (
                  <>
                    {isCrypto && (
                      <div className={styles.depositDetailsContainer}>
                        <div className={styles.depositDetails}>USDT (ERC-20)</div>
                        <div
                          className={styles.depositDetails}
                          onClick={() => handleCopyToClipboard(transactionDetail?.deposit_crypto_address)}
                        >
                          <div className={styles.cryptoAddress}>{transactionDetail?.deposit_crypto_address}</div>
                          <span className={styles.iconContainer}>
                            <HiOutlineClipboardDocument className={styles.icon} />
                          </span>
                        </div>
                      </div>
                    )}

                    {isGcash || isBank ? (
                      <div className={styles.depositDetailsContainer}>
                        <div
                          className={styles.depositDetails}
                          onClick={() => handleCopyToClipboard(transactionDetail?.deposit_account_name)}
                        >
                          <div>{transactionDetail?.deposit_account_name}</div>
                          <span className={styles.iconContainer}>
                            <HiOutlineClipboardDocument className={styles.icon} />
                          </span>
                        </div>
                        <div
                          className={styles.depositDetails}
                          onClick={() => handleCopyToClipboard(transactionDetail?.deposit_account_number)}
                        >
                          <div>{transactionDetail?.deposit_account_number}</div>
                          <span className={styles.iconContainer}>
                            <HiOutlineClipboardDocument className={styles.icon} />
                          </span>
                        </div>
                        {isBank ? (
                          <div
                            className={styles.depositDetails}
                            onClick={() => handleCopyToClipboard(transactionDetail?.deposit_bank_name)}
                          >
                            <div>{transactionDetail?.deposit_bank_name}</div>
                            <span className={styles.iconContainer}>
                              <HiOutlineClipboardDocument className={styles.icon} />
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : null}

                    <div className={styles.buttonContainer}>
                      {transactionDetail?.confirming_deposit ? (
                        <>
                          <button className={styles.button} disabled={isPending}>
                            Pending Confirmation
                          </button>
                          <button className={styles.cancel} onClick={closeModal}>
                            Close
                          </button>
                        </>
                      ) : (
                        <>
                          <button className={styles.button} onClick={() => handleDeposit(transactionId)}>
                            {submittingDeposit ? <LoadingSvg width={25} height={25} color="#000" /> : "Confirm Deposit"}
                          </button>
                          <button className={styles.cancel} onClick={cancelDeposit}>
                            {deletingTransaction ? "Cancelling..." : "Cancel Deposit"}
                          </button>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={styles.generatingContainer}>
                    <LoadingSpinner height={55} width={55} />
                    <p>Generating details please wait.</p>
                    <div className={styles.buttonContainer}>
                      <button className={styles.cancel} onClick={cancelDeposit}>
                        {deletingTransaction ? "Cancelling..." : "Cancel Deposit"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </CustomModal>
  );
}
