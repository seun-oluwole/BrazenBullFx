import axios from "axios";

const exchangeUrl = import.meta.env.VITE_EXCHANGE_URL;
const exchangeKey = import.meta.env.VITE_EXCHANGE_KEY;

export default async function convertCurrency(baseCode, targetCode, amount) {
  if (baseCode === targetCode) return 
  const response = await axios.get(`${exchangeUrl}/${exchangeKey}/pair/${baseCode}/${targetCode}/${amount}`);

  if (!response?.status === 200) throw new Error("Error: Failed to fetch") 
  return response?.data
}