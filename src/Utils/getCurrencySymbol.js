import CurrencyList from "currency-list";
import country from "country-list-js"

export function getCurrencySymbol(currencyCode) {
  if (!currencyCode) return
  const countryNames = country.names().sort();
  const allCountries = countryNames.map(name => country.findByName(name))
  const filteredCountry = allCountries.find(({ currency: { code } }) => code === currencyCode)
  return filteredCountry.currency.symbol
}