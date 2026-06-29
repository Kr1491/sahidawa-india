export function getOptimalSyncTier() {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (!connection) return "TIER_3"; // Fallback if browser doesn't support the API

  // If user is on a slow network environment (2g or 3g) or data saver mode is on
  if (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g') {
    console.log("Low bandwidth detected. Restricting download to Tier 1 and Tier 2 assets.");
    return "TIER_2"; 
  }

  return "TIER_3"; // High-speed network fallback
}
