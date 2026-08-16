/**
 * Kareebu Home
 * Donor module: com.careem.superapp
 * Reconstruction status: preserve-and-enhance
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "home" as const;
export const donorModule = "com.careem.superapp" as const;
export const donorEntryPoints = [
  "careem://app.careem.com/home",
  "careem://home.careem.com"
] as const;
