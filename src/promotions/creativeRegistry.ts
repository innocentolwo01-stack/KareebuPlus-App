import type { ImageSourcePropType } from 'react-native';
import type { PromotionCreativeType, PromotionProductionStatus, PromotionService } from './types';

export type PromotionCreativeDefinition = {
  key: string;
  asset: ImageSourcePropType;
  service: PromotionService | 'shared';
  creativeType: PromotionCreativeType;
  aspectRatio: number;
  source: 'kareebu-owned' | 'merchant-supplied' | 'reference-fixture';
  rightsStatus: 'cleared' | 'reference-only';
  productionStatus: PromotionProductionStatus;
  semanticUse: string;
};

export const PROMOTION_CREATIVE = {
  shops: { key:'promo.shops', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/service-shops.png'), service:'shops', creativeType:'SERVICE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'shops and local seller discovery' },
  foodWeekend: { key:'promo.food.weekend', asset:require('../../assets/kareebu-plus/food-exact/banners/promo-weekend.png'), service:'food', creativeType:'PHOTOGRAPHIC_HERO', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'food discovery and weekend dining' },
  groceryFresh: { key:'promo.grocery.fresh', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fresh-food.png'), service:'groceries', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'fresh grocery merchandising' },
  groceryHousehold: { key:'promo.grocery.household', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'), service:'groceries', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'household grocery merchandising' },
  personalCare: { key:'promo.personal-care', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'), service:'shared', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'personal care and beauty' },
  pharmacy: { key:'promo.pharmacy', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/service-pharmacy.png'), service:'pharmacy', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'pharmacy and first-aid discovery' },
  vitamins: { key:'promo.pharmacy.vitamins', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png'), service:'pharmacy', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'vitamins and wellness' },
  electronics: { key:'promo.electronics', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/service-electronics.png'), service:'shops', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'electronics and Global tech' },
  beauty: { key:'promo.beauty', asset:require('../../assets/kareebu-plus/global/products/skincare-set.png'), service:'shared', creativeType:'PRODUCT_CAMPAIGN', aspectRatio:2.08, source:'reference-fixture', rightsStatus:'reference-only', productionStatus:'needs-production-art', semanticUse:'beauty and skincare fixture campaigns' },
  home: { key:'promo.home', asset:require('../../assets/kareebu-plus/global/products/home-organisation-kit.png'), service:'shared', creativeType:'PRODUCT_CAMPAIGN', aspectRatio:2.08, source:'reference-fixture', rightsStatus:'reference-only', productionStatus:'needs-production-art', semanticUse:'home and household fixture campaigns' },
  rides: { key:'promo.rides', asset:require('../../assets/kareebu-plus/rides-home/city-to-city.png'), service:'rides', creativeType:'SERVICE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'ride destination and city campaigns' },
  rideSchedule: { key:'promo.rides.schedule', asset:require('../../assets/kareebu-plus/rides-home/schedule.png'), service:'rides', creativeType:'SERVICE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'scheduled rides' },
  boda: { key:'promo.boda', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/service-boda.png'), service:'boda', creativeType:'SERVICE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'Boda campaigns only' },
  dineoutBrunch: { key:'promo.dineout.brunch', asset:require('../../assets/kareebu-plus/dineout/editorial-weekend-brunch.jpg'), service:'dineout', creativeType:'PHOTOGRAPHIC_HERO', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'brunch and weekend dining' },
  dineoutWeekend: { key:'promo.dineout.weekend', asset:require('../../assets/kareebu-plus/dineout/editorial-weekend-dining.jpg'), service:'dineout', creativeType:'EDITORIAL_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'weekend DineOut discovery' },
  goout: { key:'promo.goout', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/service-go-out.png'), service:'goout', creativeType:'SERVICE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'Go Out discovery' },
  wellness: { key:'promo.goout.wellness', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png'), service:'goout', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'wellness experiences' },
  activities: { key:'promo.goout.activities', asset:require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'), service:'goout', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'activities and things to do' },
  globalHero: { key:'promo.global.hero', asset:require('../../assets/kareebu-plus/global/hero-global-shopping.png'), service:'global', creativeType:'MARKETPLACE_CAMPAIGN', aspectRatio:2.08, source:'kareebu-owned', rightsStatus:'cleared', productionStatus:'kareebu-owned', semanticUse:'Kareebu Global discovery' },
  globalSchool: { key:'promo.global.school', asset:require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'), service:'global', creativeType:'CATEGORY_CAMPAIGN', aspectRatio:2.08, source:'reference-fixture', rightsStatus:'reference-only', productionStatus:'needs-production-art', semanticUse:'Global office and school' },
} as const satisfies Record<string, PromotionCreativeDefinition>;

export type PromotionCreativeKey = keyof typeof PROMOTION_CREATIVE;
