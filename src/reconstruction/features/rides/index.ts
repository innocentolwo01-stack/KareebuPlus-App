/**
 * Kareebu Rides
 * Donor module: com.careem.ridehail
 * Reconstruction status: preserve-and-enhance
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "rides" as const;
export const donorModule = "com.careem.ridehail" as const;
export const donorEntryPoints = [
  "careem://bookaride",
  "careem://gmm-bookaride",
  "careem://ridehailing.careem.com/gmm-bookaride"
] as const;
