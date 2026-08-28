/**
 * Kareebu Authentication
 * Donor module: com.careem.auth
 * Reconstruction status: reconstruct-backend-replacement
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "auth" as const;
export const donorModule = "com.careem.auth" as const;
export const donorEntryPoints = [
  "careem://identity.careem.com/signin/",
  "careem://identity.careem.com/customer/onboard"
] as const;
