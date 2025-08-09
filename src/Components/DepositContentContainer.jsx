import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import toast from "react-hot-toast";
import { supabase } from "../Utils/supabaseClient";
import styles from "../Components/depositcontentcontainer.module.css";
import LoadingSvg from "./LoadingSvg";

export default function DepositContentContainer({ closeModal }) {
  const [updatingDetails, setUpdatingDetails] = useState(false);
  const [depositDetails, setDepositDetails] = useState({accountName: "", accountNumber: "", bankName: "", cryptoAddress: ""}); 
  const { investorTransDetail, fetchInvestorTransDetail, transDetailError, fetchGeneratingDetails, toggleGeneratingDetails, isToggling, isOn } = useAdmin();
  const transactionId = investorTransDetail?.id;
  const transactionMethod = investorTransDetail?.transaction_method;
  const isCrypto = investorTransDetail?.transaction_method === "Crypto"
  const isGcash = investorTransDetail?.transaction_method === "Gcash"
  const isBank = investorTransDetail?.transaction_method === "Bank"
  const accountName = investorTransDetail?.deposit_account_name
  const accountNumber = investorTransDetail?.deposit_account_number
  const bankName = investorTransDetail?.deposit_bank_name
  const cryptoAddress = investorTransDetail?.deposit_crypto_address

  useEffect(() => {
    fetchGeneratingDetails(transactionId)
  }, []);

  const handleInput = (e) => {
    const { value, name } = e.target;
    setDepositDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, id, depositMethod) => {
    e.preventDefault();
    if (!id) return;
    // Updates cryptoaddress field if deposit method is crypto
    if (depositMethod === "Crypto") {
      if (!depositDetails.cryptoAddress) return;
      setUpdatingDetails(true);
      try {
        const { error: updateError } = await supabase
          .from("transactions")
          .update({
            deposit_crypto_address: depositDetails.cryptoAddress,
          })
          .eq("id", id);

        if (updateError) throw new Error(updateError);

        toast.success("Submitted successfully");
      } catch (error) {
        toast.error("Error: Failed to submit");
      } finally {
        setUpdatingDetails(false);
        await fetchInvestorTransDetail(transactionId);
      }
      // Updates gcash field if deposit method is gcash
    } else if (depositMethod === "Gcash") {
      if (!depositDetails.accountName || !depositDetails.accountNumber) return;
      setUpdatingDetails(true);
      try {
        const { error: updateError } = await supabase
          .from("transactions")
          .update({
            deposit_account_name: depositDetails.accountName,
            deposit_account_number: depositDetails.accountNumber,
          })
          .eq("id", id);

        if (updateError) throw new Error(updateError);

        toast.success("Submitted successfully");
      } catch (error) {
        toast.error("Error: Failed to submit");
      } finally {
        setUpdatingDetails(false);
        await fetchInvestorTransDetail(transactionId);
      }

      // Updates bank field if deposit method is bank
    } else if (depositMethod === "Bank") {
      if (!depositDetails.accountName || !depositDetails.accountNumber || !depositDetails.bankName) return;
      setUpdatingDetails(true);
      try {
        const { error: updateError } = await supabase
          .from("transactions")
          .update({
            deposit_account_name: depositDetails.accountName,
            deposit_account_number: depositDetails.accountNumber,
            deposit_bank_name: depositDetails.bankName
          })
          .eq("id", id);

        if (updateError) throw new Error(updateError);

        toast.success("Submitted successfully");
      } catch (error) {
        toast.error("Error: Failed to submit");
      } finally {
        setUpdatingDetails(false);
        await fetchInvestorTransDetail(transactionId);
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h3 className={styles.title}>Deposit Details</h3>
      <div className={styles.generatingDetails}>
        Generating details
        <button className={styles.toggleBtn} onClick={() => toggleGeneratingDetails(transactionId)}>
          {!isToggling ? 
          (isOn ? "TURNED ON" : "TURNED OFF")
          : <LoadingSvg width={25} height={25} color="#000"/>
          }
        </button>
      </div>
      {!transDetailError ? (
        <>
          <div className={styles.cryptoContainer}>{cryptoAddress || ""}</div>
          <div className={styles.inputContainer}>
            {isCrypto ? (
              <form>
                <div>USDT (ERC-20)</div>
                <input
                  className={styles.input}
                  value={depositDetails.cryptoAddress}
                  type="text"
                  name="cryptoAddress"
                  placeholder={"Enter crypto address"}
                  onChange={handleInput}
                />
              </form>
            ) : null}
            {isGcash || isBank ? (
              <form>
                <input
                  className={styles.input}
                  value={depositDetails.accountName}
                  type="text"
                  name="accountName"
                  placeholder={accountName || "Enter account name"}
                  onChange={handleInput}
                />
                <input
                  className={styles.input}
                  value={depositDetails.accountNumber}
                  type="text"
                  name="accountNumber"
                  placeholder={accountNumber || "Enter account number"}
                  onChange={handleInput}
                />
                {isBank && (
                  <input
                  className={styles.input}
                  value={depositDetails.bankName}
                  type="text"
                  name="bankName"
                  placeholder={bankName || "Enter bank name"}
                  onChange={handleInput}
                />
                )}
              </form>
            ): null}
          </div>
        </>
      ) : (
        "Check your connection and try again."
      )}

      <div className={styles.inputContainer}>
        <button className="button" onClick={(e) => handleSubmit(e, transactionId, transactionMethod)}>
          {updatingDetails ? <LoadingSvg width={25} height={25} color="#000" /> : "Submit"}
        </button>
        <button className={styles.button} onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}
