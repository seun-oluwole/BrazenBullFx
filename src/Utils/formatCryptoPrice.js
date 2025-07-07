export default function formatCryptoPrice(price = 0) {
  const formattedPrice = Math.floor(Number(price) * 100) / 100
  return `$${formattedPrice > 0 ? formattedPrice.toLocaleString() : price}`
}