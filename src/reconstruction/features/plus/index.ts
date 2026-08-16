/**
 * Kareebu+
 * Donor module: com.careem.subscription
 * Reconstruction status: reconstruct
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "plus" as const;
export const donorModule = "com.careem.subscription" as const;
export const donorEntryPoints = [
  "careem://subscription.careem.com"
] as const;
