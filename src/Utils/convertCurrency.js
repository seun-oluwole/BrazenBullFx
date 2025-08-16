import fetchExchangeRate from "./getExchangeRate";

export default async function convertCurrency(fromCurr, toCurr, amount) {
  if (!fromCurr || !toCurr) {
      throw new Error('Invalid currency codes');
    }
    
  const rate = await fetchExchangeRate(fromCurr, toCurr);
  const convertedAmount = rate * amount

  return { convertedAmount, rate }
}