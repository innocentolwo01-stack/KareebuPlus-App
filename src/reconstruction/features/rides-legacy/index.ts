/**
 * Kareebu Rides compatibility
 * Donor module: com.careem.rides
 * Reconstruction status: reference-only
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "rides-legacy" as const;
export const donorModule = "com.careem.rides" as const;
export const donorEntryPoints = [
  "careem://rides.careem.com"
] as const;
