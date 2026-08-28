/**
 * Kareebu Account
 * Donor module: com.careem.identity
 * Reconstruction status: reconstruct-backend-replacement
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "account" as const;
export const donorModule = "com.careem.identity" as const;
export const donorEntryPoints = [
  "careem://identity.careem.com/settings/",
  "careem://identity.careem.com/update/profile",
  "careem://identity.careem.com/security"
] as const;
