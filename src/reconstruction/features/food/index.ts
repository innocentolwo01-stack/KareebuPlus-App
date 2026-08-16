/**
 * Kareebu Food
 * Donor module: com.careem.food
 * Reconstruction status: active-reconstruction
 *
 * This file is a boundary, not a Careem implementation. Screens and state
 * should be rebuilt here using React Native/Expo and Kareebu-owned services.
 */

export const featureId = "food" as const;
export const donorModule = "com.careem.food" as const;
export const donorEntryPoints = [
  "careem://food.careem.com/app/food-discovery-home/discover",
  "careem://food.careem.com/search",
  "careem://food.careem.com/app/food-menu/menu"
] as const;
