import type { ImageSourcePropType } from 'react-native';
import { KAREEBU_BANNER_ASPECT_RATIO, kareebuBannerRegistry } from '../assets/kareebuBannerRegistry';

export const PROMOTIONAL_BANNER_RATIO = KAREEBU_BANNER_ASPECT_RATIO;
export const PROMOTIONAL_BANNER_ASPECT_RATIO = PROMOTIONAL_BANNER_RATIO;

export const promotionalBannerAssets = {
  home: {
    superApp: kareebuBannerRegistry.promo.everythingKareebu.source,
    ride: kareebuBannerRegistry.promo.kampalaMoving.source,
    shopping: kareebuBannerRegistry.category.shopsMarketplace.source,
    send: kareebuBannerRegistry.category.parcelDelivery.source,
    groceriesEssentials: kareebuBannerRegistry.category.groceriesEssentials.source,
    fashionBeauty: kareebuBannerRegistry.category.fashion.source,
    electronicsGadgets: kareebuBannerRegistry.category.electronics.source,
    dineOutIconicKampala: kareebuBannerRegistry.category.dineOutRestaurants.source,
  },
  ride: {
    primary: kareebuBannerRegistry.category.rides.source,
    secondary: kareebuBannerRegistry.promo.kampalaMoving.source,
  },
  boda: {
    primary: kareebuBannerRegistry.category.boda.source,
    secondary: kareebuBannerRegistry.category.boda.source,
  },
  food: {
    primary: kareebuBannerRegistry.category.foodDelivery.source,
    secondary: kareebuBannerRegistry.promo.weekendFood.source,
    tertiary: kareebuBannerRegistry.category.localUgandanFood.source,
  },
  groceries: {
    primary: kareebuBannerRegistry.category.groceriesEssentials.source,
    secondary: kareebuBannerRegistry.promo.freshWeek.source,
    tertiary: kareebuBannerRegistry.promo.freshWeek.source,
  },
  marketplace: {
    primary: kareebuBannerRegistry.category.shopsMarketplace.source,
    secondary: kareebuBannerRegistry.promo.everythingKareebu.source,
  },
  fashion: { primary: kareebuBannerRegistry.category.fashion.source },
  beauty: { primary: kareebuBannerRegistry.category.beautyWellness.source },
  electronics: { primary: kareebuBannerRegistry.category.electronics.source },
  pharmacy: {
    primary: kareebuBannerRegistry.category.pharmacyHealth.source,
    secondary: kareebuBannerRegistry.category.pharmacyHealth.source,
    wellnessApproved: kareebuBannerRegistry.category.pharmacyHealth.source,
  },
  dineout: {
    weekendApproved: kareebuBannerRegistry.category.dineOutRestaurants.source,
  },
  send: {
    primary: kareebuBannerRegistry.category.parcelDelivery.source,
    secondary: kareebuBannerRegistry.category.parcelDelivery.source,
    page: kareebuBannerRegistry.category.parcelDelivery.source,
  },
  homeCare: {
    primary: kareebuBannerRegistry.category.homeServices.source,
    secondary: kareebuBannerRegistry.promo.homeRefresh.source,
  },
  mobility: { city: kareebuBannerRegistry.promo.kampalaMoving.source },
  website: {
    dineout: kareebuBannerRegistry.category.dineOutRestaurants.source,
    benefits: require('../../assets/kareebu-plus/promotional-banners/web/kareebu-plus-benefits.webp'),
    global: kareebuBannerRegistry.category.globalShopping.source,
    medicines: kareebuBannerRegistry.category.pharmacyHealth.source,
    pharmacy: kareebuBannerRegistry.category.pharmacyHealth.source,
  },
} satisfies Record<string, Record<string, ImageSourcePropType>>;
