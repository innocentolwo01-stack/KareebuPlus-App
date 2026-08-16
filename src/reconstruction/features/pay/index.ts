/**
 * Kareebu Pay
 * Donor module: com.careem.pay
 * Reconstruction status: reconstruct-backend-replacement
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "pay" as const;
export const donorModule = "com.careem.pay" as const;
export const donorEntryPoints = [
  "careem://pay.careem.com/pay_home_sa",
  "careem://pay.careem.com/p2p",
  "careem://pay.careem.com/topup-credit"
] as const;
