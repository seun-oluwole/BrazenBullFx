export default function walletTier(tier) {
  if (!tier) return

  if (tier === "1") {
    return "TIER 1"
  } else if (tier === "2") {
    return "TIER 2"
  } else return tier
}