import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CryptoData from "./CryptoData";
import LoadingSpinner from "./LoadingSpinner";
import styles from "./cryptodatacontainer.module.css";

const coinstatUrl = import.meta.env.VITE_COINSTAT_URL;
const coinstatKey = import.meta.env.VITE_COINSTAT_KEY;

const fetchCryptoData = async () => {
  const response = await axios.get(`${coinstatUrl}/coins`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": `${coinstatKey}`,
    },
  });
  return response?.data?.result;
};

export default function CryptoDataList() {
  const { data, error, isPending } = useQuery({
    queryKey: ["crypto"],
    queryFn: fetchCryptoData,
    staleTime: 1000 * 60 * 5,
  });

  if (isPending)
    return (
      <div className={styles.spinnerContainer}>
        <LoadingSpinner />
      </div>
    );

  if (error) return <div>{`${error}`}</div>;

  return (
    <>
      {data.length > 0
        ? data.map(({ name, symbol, price, icon }, index) => (
            <CryptoData key={index} name={name} symbol={symbol} price={price} icon={icon} index={index} />
          ))
        : "Oops So Empty!"}
    </>
  );
}
