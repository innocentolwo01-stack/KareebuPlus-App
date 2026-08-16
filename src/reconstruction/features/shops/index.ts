/**
 * Kareebu Shops
 * Donor module: com.careem.shops
 * Reconstruction status: reconstruct
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "shops" as const;
export const donorModule = "com.careem.shops" as const;
export const donorEntryPoints = [
  "careem://shops.careem.com/actions/address"
] as const;
