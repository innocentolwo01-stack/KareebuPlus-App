import type { ImageSourcePropType } from 'react-native';
import type { Screen } from '../types';

export type PromotionSlot = 'hero' | 'secondary' | 'double' | 'membership' | 'contextual';
export type PromotionService = 'home' | 'rides' | 'boda' | 'food' | 'groceries' | 'pharmacy' | 'shops' | 'dineout' | 'goout' | 'send' | 'services' | 'pay' | 'activity' | 'global';
export type PromotionPlacement =
  | 'HOME_HERO' | 'HOME_INLINE_1' | 'HOME_INLINE_2' | 'HOME_GLOBAL' | 'HOME_FOOD' | 'HOME_RIDES' | 'HOME_SHOPS' | 'HOME_MEMBERSHIP' | 'HOME_PROMO'
  | 'FOOD_HERO' | 'FOOD_CATEGORY' | 'FOOD_RESTAURANT' | 'FOOD_PROMO_INLINE' | 'FOOD_PAYMENT' | 'FOOD_KAREEBU_PLUS' | 'FOOD_CATEGORY_PROMO'
  | 'GROCERY_HERO' | 'GROCERY_FRESH' | 'GROCERY_HOUSEHOLD' | 'GROCERY_BABY' | 'GROCERY_PERSONAL_CARE' | 'GROCERY_SELLER'
  | 'PHARMACY_HERO' | 'PHARMACY_VITAMINS' | 'PHARMACY_WELLNESS' | 'PHARMACY_BABY' | 'PHARMACY_PERSONAL_CARE' | 'PHARMACY_FIRST_AID' | 'PHARMACY_SELLER'
  | 'SHOPS_HERO' | 'SHOP_CATEGORY_PROMO' | 'SHOP_MERCHANT' | 'SHOP_INLINE' | 'SHOP_GLOBAL_FALLBACK'
  | 'STORE_HERO' | 'STORE_TOP_DEALS' | 'STORE_INLINE' | 'STORE_CATEGORY' | 'STORE_BRAND' | 'STORE_SEASONAL' | 'STORE_CHECKOUT'
  | 'SUPERMARKET_HERO' | 'SUPERMARKET_TOP_DEALS' | 'SUPERMARKET_FRESH' | 'SUPERMARKET_HOUSEHOLD' | 'SUPERMARKET_PERSONAL_CARE' | 'SUPERMARKET_BABY' | 'SUPERMARKET_SEASONAL'
  | 'ELECTRONICS_HERO' | 'ELECTRONICS_GAMING' | 'ELECTRONICS_ACCESSORIES' | 'ELECTRONICS_BRAND'
  | 'BEAUTY_FEATURED' | 'PET_FEATURED'
  | 'RIDES_HERO' | 'RIDES_EVENT' | 'RIDES_AIRPORT' | 'RIDES_INLINE'
  | 'BODA_HERO' | 'BODA_EVENT' | 'BODA_INLINE'
  | 'DINEOUT_HERO' | 'DINEOUT_PROMO' | 'DINEOUT_BRUNCH' | 'DINEOUT_WEEKEND' | 'DINEOUT_RESTAURANT' | 'DINEOUT_CATEGORY'
  | 'GOOUT_HERO' | 'GOOUT_PROMO' | 'GOOUT_WEEKEND' | 'GOOUT_FAMILY' | 'GOOUT_WELLNESS' | 'GOOUT_EVENT' | 'GOOUT_CATEGORY'
  | 'GLOBAL_HERO' | 'GLOBAL_DEALS' | 'GLOBAL_MARKETPLACE_PROMO' | 'GLOBAL_CATEGORY_PROMO' | 'GLOBAL_TECH' | 'GLOBAL_FASHION' | 'GLOBAL_BEAUTY' | 'GLOBAL_HOME' | 'GLOBAL_OFFICE' | 'GLOBAL_SCHOOL' | 'GLOBAL_PET' | 'GLOBAL_BABY' | 'GLOBAL_NEW' | 'GLOBAL_TRENDING' | 'GLOBAL_PRICE' | 'GLOBAL_STORE' | 'GLOBAL_EDITORIAL'
  | 'SEARCH_FALLBACK' | 'ACTIVITY_PROMO' | 'PAY_PROMO' | 'KAREEBU_PLUS_PROMO' | 'CATEGORY_INLINE'
  | 'LANDING_HERO' | 'LANDING_AFTER_CHILDREN' | 'LANDING_AFTER_FEATURED' | 'LANDING_INLINE_1' | 'LANDING_INLINE_2' | 'LANDING_BRAND' | 'LANDING_MERCHANT' | 'LANDING_PRODUCT' | 'LANDING_SEASONAL' | 'LANDING_EDITORIAL';
export type PromotionTreatment = 'yellow' | 'cream' | 'charcoal' | 'green' | 'photo' | 'rose' | 'blue';
export type PromotionCreativeType = 'PHOTOGRAPHIC_HERO' | 'PRODUCT_CAMPAIGN' | 'MERCHANT_CAMPAIGN' | 'SERVICE_CAMPAIGN' | 'MARKETPLACE_CAMPAIGN' | 'CATEGORY_CAMPAIGN' | 'EVENT_CAMPAIGN' | 'MEMBERSHIP_CAMPAIGN' | 'PAYMENT_CAMPAIGN' | 'EDITORIAL_CAMPAIGN';
export type PromotionProductionStatus = 'production-approved' | 'merchant-supplied' | 'kareebu-owned' | 'licensed' | 'development-fixture' | 'needs-production-art';

export type PromotionCreativeMetadata = {
  assetUrl?: string;
  assetType: 'bundled' | 'cms-photo' | 'cms-3d' | 'merchant-provided';
  width: number;
  height: number;
  aspectRatio: number;
  market: string;
  service: PromotionService;
  source: 'kareebu-owned' | 'cms-upload' | 'merchant-provided' | 'reference-fixture';
  rightsStatus: 'cleared' | 'pending' | 'reference-only';
  merchant?: string;
  lastVerifiedAt?: string;
  productionStatus?: PromotionProductionStatus;
};

export type PromotionCampaign = {
  id: string;
  slot: PromotionSlot;
  service: PromotionService;
  campaign: string;
  headline: string;
  body: string;
  badge?: string;
  image?: ImageSourcePropType;
  imageOnly?: boolean;
  logo?: ImageSourcePropType;
  foregroundImage?: ImageSourcePropType;
  backgroundImage?: ImageSourcePropType;
  backgroundTreatment: PromotionTreatment;
  creativeType?: PromotionCreativeType;
  ctaLabel: string;
  ctaScreen: Screen;
  priority: number;
  country?: string;
  city?: string;
  categoryId?: string;
  subcategoryId?: string;
  sellerId?: string;
  brandId?: string;
  marketplaceId?: string;
  merchantType?: string;
  membershipRequired?: boolean;
  startAt?: string;
  endAt?: string;
  enabled: boolean;
  cmsSlot?: string;
  placement?: PromotionPlacement;
  audience?: 'new' | 'returning' | 'all';
  paymentMethod?: string;
  frequencyCap?: number;
  sessionCap?: number;
  cooldownHours?: number;
  dismissible?: boolean;
  eligibility?: string[];
  creative?: PromotionCreativeMetadata;
  budgetCap?: number;
  redemptionCap?: number;
  perCustomerCap?: number;
  fraudLossBudget?: number;
  riskPolicy?: 'standard' | 'strict-new-user' | 'high-value';
  referenceFixture?: boolean;
  partnerStatus?: 'partner' | 'unknown' | 'not-required';
  analyticsKey?: string;
};

export type PromotionContext = {
  service: PromotionService;
  country: string;
  city: string;
  member?: boolean;
  now?: Date;
  categoryId?: string;
  subcategoryId?: string;
  sellerId?: string;
  marketplaceId?: string;
  merchantType?: string;
  brandId?: string;
  nodeId?: string;
  nodeType?: string;
};
