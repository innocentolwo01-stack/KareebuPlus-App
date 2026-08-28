import {
  kareebuBannerRegistry,
  legacySubcategoryBannerRegistry,
  type KareebuBannerAsset,
} from '../promotions/promotionalContentRegistry';

export type CategoryBannerAsset = KareebuBannerAsset;

/**
 * Compatibility view for existing category screens. Static asset ownership
 * lives in promotionalContentRegistry; screens never require artwork directly.
 */
export const categoryBannerAssets = {
  main: {
    foodRestaurants: kareebuBannerRegistry.category.foodDelivery,
    groceriesEssentials: kareebuBannerRegistry.category.groceriesEssentials,
    pharmacyWellness: kareebuBannerRegistry.category.pharmacyHealth,
    fashionBeauty: kareebuBannerRegistry.category.fashion,
    electronicsGadgets: kareebuBannerRegistry.category.electronics,
    homeCare: kareebuBannerRegistry.category.homeServices,
    goOut: legacySubcategoryBannerRegistry.main.goOut,
    sendSomething: kareebuBannerRegistry.category.parcelDelivery,
  },
  food: {
    ...legacySubcategoryBannerRegistry.food,
    cafesCoffee: kareebuBannerRegistry.category.cafesCoffee,
    localUgandanFood: kareebuBannerRegistry.category.localUgandanFood,
  },
  groceries: legacySubcategoryBannerRegistry.groceries,
  pharmacy: legacySubcategoryBannerRegistry.pharmacy,
  fashionBeauty: legacySubcategoryBannerRegistry.fashionBeauty,
  electronics: legacySubcategoryBannerRegistry.electronics,
  homeCare: legacySubcategoryBannerRegistry.homeCare,
  goOut: legacySubcategoryBannerRegistry.goOut,
  send: legacySubcategoryBannerRegistry.send,
} as const;

const registeredLegacyAssets = Object.values(legacySubcategoryBannerRegistry)
  .flatMap(group => Object.values(group) as KareebuBannerAsset[]);

export const categoryBannerById: Readonly<Record<string, CategoryBannerAsset>> = {
  ...Object.fromEntries(registeredLegacyAssets.map(asset => [asset.id, asset])),
  'food.cafes_coffee': kareebuBannerRegistry.category.cafesCoffee,
  'food.local_ugandan_food': kareebuBannerRegistry.category.localUgandanFood,
};

export type CategoryBannerId = string;
export const categoryBannerForId = (id: CategoryBannerId): CategoryBannerAsset | undefined =>
  categoryBannerById[id];

export type CategoryBannerGroup = keyof typeof categoryBannerAssets;
export type CategoryBannerKey<Group extends CategoryBannerGroup> = keyof (typeof categoryBannerAssets)[Group];
export const CATEGORY_BANNER_COUNT = Object.keys(categoryBannerById).length;
