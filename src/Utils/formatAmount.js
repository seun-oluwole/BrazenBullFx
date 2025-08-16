export default function formatAmount(amountStr) {
  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  }