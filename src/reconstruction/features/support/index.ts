/**
 * Kareebu Support
 * Donor module: com.careem.care
 * Reconstruction status: reconstruct
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "support" as const;
export const donorModule = "com.careem.care" as const;
export const donorEntryPoints = [
  "careem://care.careem.com/unifiedhelp",
  "careem://care.careem.com/supportinbox"
] as const;
