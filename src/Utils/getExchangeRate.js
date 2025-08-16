import axios from "axios";

const exchangeUrl = import.meta.env.VITE_EXCHANGE_URL;
const exchangeKey = import.meta.env.VITE_EXCHANGE_KEY;

export default async function fetchExchangeRate(fromCurr, toCurr) {
  if (fromCurr === toCurr) return 1

  if (!fromCurr || !toCurr) return
  try {
    const response = await axios.get(`${exchangeUrl}/${exchangeKey}/pair/${fromCurr}/${toCurr}`);

    if (!response?.status === 200) throw new Error("Error: Failed to fetch rate") 
    return response?.data?.conversion_rate
  } catch (error) {
    return 
  }

}