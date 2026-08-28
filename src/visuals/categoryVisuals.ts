import type { ComponentProps } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { assets } from '../assets';

export type VisualSize = 'nav' | 'compact' | 'standard' | 'large' | 'hero';
export type VisualTone = 'yellow' | 'cream' | 'green' | 'rose' | 'blue';
export type VisualBackgroundMode = 'transparent' | 'soft-surface';
export type VisualShadow = 'none' | 'contact';
export type VisualArtStyle = 'lifestyle-photo' | 'product-photo' | 'editorial-photo';
export type VisualCompositionType = 'single-object' | 'composite' | 'scene' | 'utility';
export type VisualPerspective = 'three-quarter' | 'slightly-overhead' | 'front' | 'not-applicable';
export type VisualQualityStatus = 'production-ready' | 'review-required' | 'temporary-fallback';
export type VisualPresentation = {
  sizeTier?: VisualSize;
  opticalScale?: number;
  offsetX?: number;
  offsetY?: number;
  aspectRatio?: number;
  shadow?: VisualShadow;
  backgroundMode?: VisualBackgroundMode;
  style?: VisualArtStyle;
  compositionType?: VisualCompositionType;
  transparent?: boolean;
  perspective?: VisualPerspective;
  qualityStatus?: VisualQualityStatus;
};
export type VisualSourceMetadata = {
  source: 'kareebu-owned' | 'cms' | 'merchant' | 'reference-fixture';
  rightsStatus?: 'owned' | 'licensed' | 'merchant-provided' | 'reference-only';
  lastVerifiedAt?: string;
};
export type CategoryVisualAsset =
  | { type: 'local-photo'; source: ImageSourcePropType; alt: string; aspectRatio?: number; sourceMetadata?: VisualSourceMetadata }
  | { type: 'remote-image' | 'photo'; uri: string; alt: string; aspectRatio?: number; sourceMetadata?: VisualSourceMetadata };

export type CategoryVisual = {
  asset: CategoryVisualAsset;
  tone: VisualTone;
  marketOverrides?: Partial<Record<'Uganda' | 'Kenya' | 'Tanzania', CategoryVisualAsset>>;
  fallback?: CategoryVisualAsset;
  /** Compatibility fields for existing renderers while they migrate to asset. */
  image?: ImageSourcePropType;
  icon?: ComponentProps<typeof Ionicons>['name'];
  alt: string;
} & VisualPresentation;

export type SemanticVisual = {
  image?: ImageSourcePropType;
  icon?: ComponentProps<typeof Ionicons>['name'];
  accessibilityLabel: string;
} & VisualPresentation;

export type CmsCategoryVisualOverride = {
  type: 'remote-image' | 'photo';
  assetUrl: string;
  alt: string;
  aspectRatio?: number;
  sourceMetadata?: VisualSourceMetadata;
  presentation?: VisualPresentation;
};

export const VISUAL_SIZE: Record<VisualSize, number> = { nav: 36, compact: 54, standard: 72, large: 88, hero: 132 };
export const KAREEBU_ART_DIRECTION = 'Premium marketplace photography: realistic category-specific product and service imagery, clean commercial cutouts, soft neutral backgrounds, consistent lighting and no toy-like 3D or outline-icon category art.';
const DEFAULT_PHOTO_PRESENTATION: VisualPresentation = { sizeTier:'standard', opticalScale:1, shadow:'none', backgroundMode:'transparent', style:'product-photo', compositionType:'composite', transparent:true, perspective:'three-quarter', qualityStatus:'production-ready' };

const local = (source: ImageSourcePropType, alt: string, tone: VisualTone = 'cream', presentation: VisualPresentation = {}): CategoryVisual => ({
  asset: { type: 'local-photo', source, alt, sourceMetadata: { source: 'kareebu-owned', rightsStatus: 'owned' } },
  image: source,
  alt,
  tone,
  ...DEFAULT_PHOTO_PRESENTATION,
  ...presentation,
});

const realV9 = {
  acService: require('../../assets/kareebu-plus/realistic-v9/ac-service.jpg'),
  accessories: require('../../assets/kareebu-plus/realistic-v9/accessories.jpg'),
  appliances: require('../../assets/kareebu-plus/realistic-v9/appliances.jpg'),
  audio: require('../../assets/kareebu-plus/realistic-v9/audio.jpg'),
  babyChild: require('../../assets/kareebu-plus/realistic-v9/baby-child.jpg'),
  beautyAtHome: require('../../assets/kareebu-plus/realistic-v9/beauty-at-home.jpg'),
  beautyProducts: require('../../assets/kareebu-plus/realistic-v9/beauty-products.jpg'),
  beauty: require('../../assets/kareebu-plus/realistic-v9/beauty.jpg'),
  cameras: require('../../assets/kareebu-plus/realistic-v9/cameras.jpg'),
  cleaning: require('../../assets/kareebu-plus/realistic-v9/cleaning.jpg'),
  coldFlu: require('../../assets/kareebu-plus/realistic-v9/cold-flu.jpg'),
  computing: require('../../assets/kareebu-plus/realistic-v9/computing.jpg'),
  electrical: require('../../assets/kareebu-plus/realistic-v9/electrical.jpg'),
  electronics: require('../../assets/kareebu-plus/realistic-v9/electronics.jpg'),
  fashionKids: require('../../assets/kareebu-plus/realistic-v9/fashion-kids.jpg'),
  fashionMen: require('../../assets/kareebu-plus/realistic-v9/fashion-men.jpg'),
  fashionWomen: require('../../assets/kareebu-plus/realistic-v9/fashion-women.jpg'),
  fashion: require('../../assets/kareebu-plus/realistic-v9/fashion.jpg'),
  firstAid: require('../../assets/kareebu-plus/realistic-v9/first-aid.jpg'),
  fragrance: require('../../assets/kareebu-plus/realistic-v9/fragrance.jpg'),
  gaming: require('../../assets/kareebu-plus/realistic-v9/gaming.jpg'),
  groceries: require('../../assets/kareebu-plus/realistic-v9/groceries.jpg'),
  haircare: require('../../assets/kareebu-plus/realistic-v9/haircare.jpg'),
  home: require('../../assets/kareebu-plus/realistic-v9/home.jpg'),
  medicinesHealth: require('../../assets/kareebu-plus/realistic-v9/medicines-health.jpg'),
  moving: require('../../assets/kareebu-plus/realistic-v9/moving.jpg'),
  painRelief: require('../../assets/kareebu-plus/realistic-v9/pain-relief.jpg'),
  personalCare: require('../../assets/kareebu-plus/realistic-v9/personal-care.jpg'),
  petSupplies: require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
  pharmacy: require('../../assets/kareebu-plus/realistic-v9/pharmacy.jpg'),
  phones: require('../../assets/kareebu-plus/realistic-v9/phones.jpg'),
  plumbing: require('../../assets/kareebu-plus/realistic-v9/plumbing.jpg'),
  power: require('../../assets/kareebu-plus/realistic-v9/power.jpg'),
  restaurants: require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'),
  sendBusiness: require('../../assets/kareebu-plus/realistic-v9/send-business.jpg'),
  sendDocuments: require('../../assets/kareebu-plus/realistic-v9/send-documents.jpg'),
  sendGift: require('../../assets/kareebu-plus/realistic-v9/send-gift.jpg'),
  sendParcel: require('../../assets/kareebu-plus/realistic-v9/send-parcel.jpg'),
  shoes: require('../../assets/kareebu-plus/realistic-v9/shoes.jpg'),
  skincare: require('../../assets/kareebu-plus/realistic-v9/skincare.jpg'),
  tvs: require('../../assets/kareebu-plus/realistic-v9/tvs.jpg'),
  vitaminsSupplements: require('../../assets/kareebu-plus/realistic-v9/vitamins-supplements.jpg'),
  flowers: require('../../assets/kareebu-plus/realistic-v9/flowers.jpg'),
  allergy: require('../../assets/kareebu-plus/realistic-v9/allergy.jpg'),
  digestiveHealth: require('../../assets/kareebu-plus/realistic-v9/digestive-health.jpg'),
  homeHealth: require('../../assets/kareebu-plus/realistic-v9/home-health.jpg'),
  laundry: require('../../assets/kareebu-plus/realistic-v9/laundry.jpg'),
  handyman: require('../../assets/kareebu-plus/realistic-v9/handyman.png'),
  pestControl: require('../../assets/kareebu-plus/realistic-v9/pest-control.jpg'),
  homeStorage: require('../../assets/kareebu-plus/realistic-v9/home-storage.png'),
  bags: require('../../assets/kareebu-plus/realistic-v9/bags.jpg'),
  sportswear: require('../../assets/kareebu-plus/realistic-v9/sportswear.png'),
  sports: require('../../assets/kareebu-plus/realistic-v9/sports.jpg'),
  automotive: require('../../assets/kareebu-plus/realistic-v9/automotive.png'),
  booksStationery: require('../../assets/kareebu-plus/realistic-v9/books-stationery.jpg'),
  kitchen: require('../../assets/kareebu-plus/realistic-v9/kitchen.jpg'),
  homeDecor: require('../../assets/kareebu-plus/realistic-v9/home-decor.jpg'),
  bedding: require('../../assets/kareebu-plus/realistic-v9/bedding.jpg'),
  lighting: require('../../assets/kareebu-plus/realistic-v9/lighting.jpg'),
  diy: require('../../assets/kareebu-plus/realistic-v9/diy.png'),
  wearables: require('../../assets/kareebu-plus/realistic-v9/wearables.jpg'),
  smartHome: require('../../assets/kareebu-plus/realistic-v9/smart-home.jpg'),
  toys: require('../../assets/kareebu-plus/realistic-v9/toys.png'),
  pay: require('../../assets/kareebu-plus/realistic-v9/pay.png'),
  healthcare: require('../../assets/kareebu-plus/realistic-v9/healthcare.jpg'),
};

const photoArt = {
  appliances: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png'),
  baby: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'),
  beauty: require('../../assets/kareebu-plus/global/products/skincare-set.png'),
  buffet: require('../../assets/kareebu-plus/dineout/category-business-lunch-v2.png'),
  burger: require('../../assets/kareebu-plus/food-exact/categories/burger.png'),
  cleaning: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'),
  coffee: require('../../assets/kareebu-plus/food-exact/categories/coffee.png'),
  dessert: require('../../assets/kareebu-plus/food-exact/categories/dessert.png'),
  dineout: require('../../assets/kareebu-plus/dineout/dineout-hero.jpg'),
  dineoutCasual: require('../../assets/kareebu-plus/dineout/category-casual-v2.png'),
  dineoutPremium: require('../../assets/kareebu-plus/dineout/category-premium-v2.png'),
  dineoutBrunch: require('../../assets/kareebu-plus/dineout/category-brunch-v2.png'),
  dineoutBusiness: require('../../assets/kareebu-plus/dineout/category-business-lunch-v2.png'),
  electronics: require('../../assets/kareebu-plus/lifestyle-cutouts/service-electronics.png'),
  electrical: require('../../assets/kareebu-plus/lifestyle-cutouts/service-fix.png'),
  entertainment: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'),
  fashion: require('../../assets/kareebu-plus/global/products/trainers.png'),
  fashionAccessories: require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
  fitness: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png'),
  flowers: require('../../assets/kareebu-plus/top-offers/category-flowers.jpg'),
  chicken: require('../../assets/kareebu-plus/food-exact/categories/chicken-wings.png'),
  rawBeef: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-beef.png'),
  rawChicken: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-chicken.png'),
  groceries: require('../../assets/kareebu-plus/lifestyle-cutouts/service-groceries.png'),
  health: require('../../assets/kareebu-plus/lifestyle-cutouts/service-pharmacy.png'),
  healthy: require('../../assets/kareebu-plus/food-exact/categories/healthy.png'),
  medicines: require('../../assets/kareebu-plus/lifestyle-cutouts/service-pharmacy.png'),
  offers: require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg'),
  maintenance: require('../../assets/kareebu-plus/lifestyle-cutouts/service-home-care.png'),
  send: require('../../assets/kareebu-plus/lifestyle-cutouts/service-send.png'),
  personalCare: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'),
  pharmacy: require('../../assets/kareebu-plus/lifestyle-cutouts/service-pharmacy.png'),
  pizza: require('../../assets/kareebu-plus/food-exact/categories/pizza.png'),
  supplements: require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png'),
  toys: require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
  produce: require('../../assets/kareebu-plus/top-picks/hero-groceries.png'),
  bananas: require('../../assets/kareebu-plus/top-picks/bananas.png'),
  tomatoes: require('../../assets/kareebu-plus/top-picks/tomatoes.png'),
  cucumber: require('../../assets/kareebu-plus/top-picks/cucumber.png'),
  foodBurger: require('../../assets/kareebu-plus/food-exact/categories/burger.png'),
  foodHealthy: require('../../assets/kareebu-plus/food-exact/categories/healthy.png'),
  foodIndian: require('../../assets/kareebu-plus/food-exact/categories/indian.png'),
  foodPizza: require('../../assets/kareebu-plus/food-exact/categories/pizza.png'),
  foodBreakfast: require('../../assets/kareebu-plus/food-exact/categories/catering.png'),
  lifestyleGroceries: require('../../assets/kareebu-plus/lifestyle-cutouts/service-groceries.png'),
  freshFood: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fresh-food.png'),
  bakery: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-bakery.png'),
  dairyEggs: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-dairy-eggs.png'),
  drinks: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-drinks.png'),
  householdCleaning: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'),
  lifestylePersonalCare: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'),
  goat: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-goat.png'),
  fish: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fish.png'),
  seafood: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-seafood.png'),
  snacks: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-snacks.png'),
  cookingStaples: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-cooking-staples.png'),
  lifestylePharmacy: require('../../assets/kareebu-plus/lifestyle-cutouts/service-pharmacy.png'),
  lifestyleVitamins: require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png'),
  electronicsPhones: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-phones.png'),
  electronicsComputing: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-computing.png'),
  electronicsTv: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png'),
  essentials: require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
};

export const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  'commerce.restaurants': local(realV9.restaurants, 'Restaurants and prepared food', 'yellow', { opticalScale: 1.2 }),
  'commerce.pharmacy': local(realV9.pharmacy, 'Pharmacy and health essentials', 'rose', { opticalScale: 1.2 }),
  'commerce.fashion': local(realV9.fashion, 'Fashion and clothing', 'rose', { opticalScale: 1.2 }),
  'commerce.home': local(realV9.home, 'Home and living', 'cream', { opticalScale: 1.2 }),
  'commerce.groceries': local(realV9.groceries, 'Groceries and fresh food', 'green', { opticalScale: 1.2 }),
  'commerce.electronics': local(realV9.electronics, 'Electronics and devices', 'blue', { opticalScale: 1.2 }),
  'commerce.beauty': local(realV9.beauty, 'Beauty and personal care', 'rose', { opticalScale: 1.2 }),
  'commerce.pets': local(realV9.petSupplies, 'Pet supplies', 'yellow', { opticalScale: 1.16 }),
  'shops.pharmacy': local(realV9.pharmacy, 'Pharmacy products', 'rose'),
  'shops.giftsFlowers': local(realV9.flowers, 'Flower bouquet', 'rose'),
  'shops.specialty': local(realV9.accessories, 'Curated specialty products', 'cream'),
  'shops.roasteriesSweets': local(photoArt.coffee, 'Coffee and sweet treats', 'yellow'),
  'shops.supermarket': local(realV9.groceries, 'Reusable bag of fresh groceries', 'green'),
  'shops.butcherySeafood': local(photoArt.rawBeef, 'Fresh butcher-cut meat', 'rose'),
  'shops.petSupplies': local(realV9.petSupplies, 'Pet supplies and toys', 'yellow'),
  'shops.healthBeauty': local(realV9.beautyProducts, 'Cosmetics and personal care', 'rose'),

  'pharmacy.medicines': local(realV9.medicinesHealth, 'Medicines and everyday health', 'rose', { opticalScale: 1.18 }),
  'pharmacy.pain-relief': local(realV9.painRelief, 'Pain relief medicines', 'rose', { opticalScale: 1.12 }),
  'pharmacy.cold-flu': local(realV9.coldFlu, 'Cold, flu and cough medicines', 'blue', { opticalScale: 1.1 }),
  'pharmacy.allergy': local(realV9.allergy, 'Allergy and pollen care', 'green'),
  'pharmacy.digestive': local(realV9.digestiveHealth, 'Digestive health', 'yellow'),
  'pharmacy.first-aid': local(realV9.firstAid, 'First aid', 'rose'),
  'pharmacy.vitamins': local(realV9.vitaminsSupplements, 'Vitamin and supplement containers', 'yellow', { opticalScale: 1.12 }),
  'pharmacy.baby-care': local(realV9.babyChild, 'Baby and child care products', 'cream', { opticalScale: 1.12 }),
  'pharmacy.personal-care': local(realV9.personalCare, 'Personal-care products', 'green', { opticalScale: 1.12 }),
  'pharmacy.home-health': local(realV9.homeHealth, 'Home health and monitoring', 'blue', { opticalScale: 1.1 }),
  'pharmacy.womens-health': local(realV9.personalCare, "Women's health and wellness", 'rose'),
  'pharmacy.mens-health': local(realV9.vitaminsSupplements, "Men's health and wellness", 'blue'),

  'groceries.fresh': local(photoArt.freshFood, 'Fresh fruit and vegetables', 'green'),
  'groceries.freshProduce': local(photoArt.freshFood, 'Fresh fruit and vegetables', 'green'),
  'groceries.tomatoes': local(photoArt.tomatoes, 'Fresh tomatoes', 'rose', { opticalScale: 1.08 }),
  'groceries.cucumber': local(photoArt.cucumber, 'Fresh cucumber and salad vegetables', 'green', { opticalScale: 1.08 }),
  'groceries.bananas': local(photoArt.bananas, 'Fresh bananas', 'yellow', { opticalScale: 1.08 }),
  'groceries.leafy-greens': local(photoArt.cucumber, 'Leafy greens and salad leaves', 'green', { opticalScale: 1.08, qualityStatus:'review-required' }),
  'groceries.root-vegetables': local(photoArt.freshFood, 'Root vegetables', 'cream', { opticalScale: 1.04, qualityStatus:'review-required' }),
  'groceries.onions-garlic-ginger': local(photoArt.cookingStaples, 'Onions, garlic and ginger', 'cream', { opticalScale: 1.02, qualityStatus:'review-required' }),
  'groceries.peppers': local(photoArt.tomatoes, 'Peppers and chillies', 'rose', { opticalScale: 1.04, qualityStatus:'review-required' }),
  'groceries.herbs': local(photoArt.cucumber, 'Fresh herbs', 'green', { opticalScale: 1.03, qualityStatus:'review-required' }),
  'groceries.mushrooms': local(photoArt.cookingStaples, 'Fresh mushrooms', 'cream', { opticalScale: .98, qualityStatus:'review-required' }),
  'groceries.ready-to-cook': local(photoArt.freshFood, 'Ready-to-cook vegetables', 'yellow', { opticalScale: 1.02, qualityStatus:'review-required' }),
  'groceries.meat-fish': local(photoArt.rawBeef, 'Fresh raw meat cuts', 'rose'),
  'groceries.meatFish': local(photoArt.rawBeef, 'Fresh raw meat cuts', 'rose'),
  'groceries.dairy': local(photoArt.dairyEggs, 'Milk, eggs and dairy products', 'blue'),
  'groceries.dairyEggs': local(photoArt.dairyEggs, 'Milk, eggs and dairy products', 'blue'),
  'groceries.drinks': local(photoArt.drinks, 'Water, juice and drinks', 'blue'),
  'groceries.snacks': local(photoArt.snacks, 'Crisps, biscuits and snacks', 'yellow'),
  'groceries.cooking': local(photoArt.cookingStaples, 'Rice, oil, flour and cooking staples', 'cream'),
  'groceries.staples': local(photoArt.cookingStaples, 'Cooking staples', 'cream'),
  'groceries.bakery': local(photoArt.bakery, 'Bread and bakery products', 'cream'),
  'groceries.household': local(photoArt.householdCleaning, 'Household and cleaning essentials', 'green'),
  'groceries.personal-care': local(photoArt.lifestylePersonalCare, 'Personal-care essentials', 'rose'),
  'groceries.baby': local(photoArt.baby, 'Baby-care essentials', 'cream'),
  'groceries.pet': local(realV9.petSupplies, 'Pet food and supplies', 'yellow'),

  'food.food': local(photoArt.burger, 'Prepared food', 'yellow'),
  'food.pizza': local(photoArt.foodPizza, 'Pizza', 'yellow'),
  'food.burgers': local(photoArt.foodBurger, 'Burger', 'yellow'),
  'food.burger': local(photoArt.foodBurger, 'Burger', 'yellow'),
  'food.chicken': local(photoArt.chicken, 'Chicken meal', 'cream'),
  'food.healthy': local(photoArt.foodHealthy, 'Healthy salad bowl', 'green'),
  'food.indian': local(photoArt.foodIndian, 'Indian meal', 'rose'),
  'food.breakfast': local(photoArt.foodBreakfast, 'Breakfast plate', 'cream'),
  'food.grill': local(photoArt.chicken, 'Grilled food', 'rose'),
  'food.african': local(photoArt.healthy, 'African plated meal', 'yellow'),
  'food.ugandan': local(photoArt.healthy, 'Ugandan plated meal', 'yellow'),
  'food.kenyan': local(photoArt.healthy, 'Kenyan plated meal', 'yellow'),
  'food.tanzanian': local(photoArt.healthy, 'Tanzanian plated meal', 'yellow'),

  'dineout.offers': local(photoArt.offers ?? photoArt.dineout, 'Dining offers', 'yellow'),
  'dineout.casual': local(photoArt.dineoutCasual, 'Realistic plated casual restaurant meal', 'cream'),
  'dineout.premium': local(photoArt.dineoutPremium, 'Realistic premium dining table setting', 'yellow'),
  'dineout.brunch': local(photoArt.dineoutBrunch, 'Realistic weekend brunch arrangement', 'cream'),
  'dineout.buffet': local(photoArt.buffet ?? photoArt.dineout, 'Buffet serving', 'yellow'),
  'dineout.business': local(photoArt.dineoutBusiness, 'Realistic business lunch setting', 'cream'),
  'dineout.dateNight': local(photoArt.dessert, 'Date night dining arrangement', 'rose'),
  'dineout.family': local(photoArt.foodIndian, 'Family-style dining', 'yellow'),

  'pets.dogs': local(realV9.petSupplies, 'Dog supplies', 'yellow'),
  'pets.cats': local(realV9.petSupplies, 'Cat supplies', 'cream'),
  'pets.birds': local(realV9.petSupplies, 'Bird-care supplies', 'blue'),
  'pets.small-pets': local(realV9.petSupplies, 'Small-pet supplies', 'green'),
  'pets.food': local(realV9.petSupplies, 'Pet food', 'yellow'),
  'pets.treats': local(realV9.petSupplies, 'Pet treats', 'cream'),
  'pets.toys': local(realV9.petSupplies, 'Pet toys', 'blue'),
  'pets.grooming': local(realV9.petSupplies, 'Pet grooming', 'rose'),
  'pets.beds': local(realV9.petSupplies, 'Pet beds', 'cream'),
  'pets.health': local(realV9.petSupplies, 'Pet health and care', 'green'),

  'gifts.birthday': local(photoArt.toys, 'Birthday gifts', 'yellow'),
  'gifts.anniversary': local(photoArt.flowers, 'Anniversary flowers', 'rose'),
  'gifts.congratulations': local(photoArt.fashionAccessories, 'Congratulations gift', 'yellow'),
  'gifts.thank-you': local(photoArt.flowers, 'Thank-you bouquet', 'green'),
  'gifts.new-baby': local(photoArt.baby, 'New baby gift', 'cream'),
  'gifts.just-because': local(photoArt.flowers, 'Thoughtful gift', 'blue'),
  'gifts.flowers': local(photoArt.flowers, 'Flower bouquet', 'rose'),
  'gifts.hampers': local(photoArt.groceries, 'Gift hamper', 'yellow'),
  'gifts.chocolates': local(photoArt.dessert, 'Chocolates', 'cream'),
  'gifts.cakes': local(photoArt.dessert, 'Celebration cake', 'rose'),
  'gifts.cards': local(photoArt.fashionAccessories, 'Greeting cards', 'blue'),
  'gifts.personalised': local(photoArt.fashionAccessories, 'Personalised gift', 'green'),

  'electronics.phones': local(realV9.phones, 'Smartphones and mobile devices', 'blue', { opticalScale: 1.08 }),
  'electronics.accessories': local(realV9.power, 'Phone and tech accessories', 'yellow'),
  'electronics.audio': local(realV9.audio, 'Headphones and audio equipment', 'rose', { opticalScale: 1.02 }),
  'electronics.tvs': local(realV9.tvs, 'Television and home entertainment', 'blue', { opticalScale: 1.06 }),
  'electronics.computing': local(realV9.computing, 'Computers and laptops', 'green', { opticalScale: 1.06 }),
  'electronics.gaming': local(realV9.gaming, 'Gaming consoles and accessories', 'rose', { opticalScale: 1.1 }),
  'electronics.appliances': local(realV9.appliances, 'Home appliances', 'cream', { opticalScale: 1.08 }),
  'electronics.power': local(realV9.power, 'Power banks and charging equipment', 'yellow', { opticalScale: 1.08 }),
  'electronics.cameras': local(realV9.cameras, 'Cameras and photography gear', 'blue', { opticalScale: 1.06 }),

  'beauty.skincare': local(realV9.skincare, 'Skincare products', 'rose', { opticalScale: 1.04 }),
  'beauty.hair': local(realV9.haircare, 'Hair-care and styling products', 'yellow', { opticalScale: 1.08 }),
  'beauty.fragrance': local(realV9.fragrance, 'Fragrance and scent', 'blue', { opticalScale: 1.08 }),
  'beauty.makeup': local(realV9.beauty, 'Makeup products', 'rose', { opticalScale: 1.1 }),
  'beauty.body': local(realV9.personalCare, 'Body care', 'cream'),
  'beauty.mens-grooming': local(realV9.haircare, "Men's grooming", 'blue'),
  'beauty.womens-care': local(realV9.beautyProducts, "Women's care", 'rose'),
  'fashion.women': local(realV9.fashionWomen, "Women's fashion", 'rose', { opticalScale: 1.1 }),
  'fashion.men': local(realV9.fashionMen, "Men's fashion", 'blue', { opticalScale: 1.1 }),
  'fashion.children': local(realV9.fashionKids, "Children's fashion and kids' essentials", 'yellow', { opticalScale: 1.08 }),
  'fashion.accessories': local(realV9.accessories, 'Fashion accessories', 'cream', { opticalScale: 1.08 }),
  'fashion.shoes': local(realV9.shoes, 'Shoes and trainers', 'rose', { opticalScale: .92 }),

  'butchery.beef': local(photoArt.rawBeef, 'Fresh raw beef cuts', 'rose'),
  'butchery.goat': local(photoArt.goat, 'Fresh raw goat meat', 'yellow'),
  'butchery.chicken': local(photoArt.rawChicken, 'Fresh raw chicken', 'cream'),
  'butchery.fish': local(photoArt.fish, 'Fresh raw fish and fillets', 'blue'),
  'butchery.seafood': local(photoArt.seafood, 'Fresh raw seafood', 'blue'),
  'butchery.bbq': local(photoArt.chicken, 'Barbecue selection', 'rose'),
  'home.cleaning': local(realV9.cleaning, 'Cleaning essentials', 'green'),
  'home.storage': local(realV9.homeStorage, 'Home storage and organisation', 'blue'),

  'home.plumbing': local(realV9.plumbing, 'Plumbing tools and fixtures', 'blue', { opticalScale: 1.12 }),
  'home.electrical': local(realV9.electrical, 'Electrical tools and testing equipment', 'yellow', { opticalScale: 1.12 }),
  'home.ac': local(realV9.acService, 'Air-conditioning service', 'green'),
  'home.moving': local(realV9.moving, 'Moving help', 'cream'),
  'home.laundry': local(realV9.laundry, 'Laundry service', 'blue'),
  'home.handyman': local(realV9.handyman, 'Handyman service', 'yellow'),
  'home.pest-control': local(realV9.pestControl, 'Pest-control service', 'green'),

  'services.plumbing': local(realV9.plumbing, 'Plumbing tools and fixtures', 'blue', { opticalScale: 1.12 }),
  'services.electrical': local(realV9.electrical, 'Electrical tools and testing equipment', 'yellow', { opticalScale: 1.12 }),
  'services.ac': local(realV9.acService, 'Air-conditioning service', 'green'),
  'services.moving': local(realV9.moving, 'Moving help', 'cream'),
  'services.beauty-home': local(realV9.beautyAtHome, 'Beauty at home', 'rose'),
  'fashion.bags': local(realV9.bags, 'Bags and handbags', 'rose'),
  'fashion.sportswear': local(realV9.sportswear, 'Sportswear and activewear', 'green'),
  'electronics.wearables': local(realV9.wearables, 'Wearable technology', 'blue'),
  'electronics.smart-home': local(realV9.smartHome, 'Smart home technology', 'blue'),
  'home.kitchen': local(realV9.kitchen, 'Kitchen and cooking essentials', 'yellow'),
  'home.decor': local(realV9.homeDecor, 'Home décor and living', 'rose'),
  'home.bedding': local(realV9.bedding, 'Bedding and bedroom essentials', 'cream'),
  'home.lighting': local(realV9.lighting, 'Lighting and lamps', 'yellow'),
  'home.diy': local(realV9.diy, 'DIY tools and supplies', 'yellow'),
  'general.toys': local(realV9.toys, 'Toys and play', 'yellow'),
  'general.sports': local(realV9.sports, 'Sports and fitness equipment', 'green'),
  'general.automotive': local(realV9.automotive, 'Automotive care and accessories', 'blue'),
  'general.books': local(realV9.booksStationery, 'Books and stationery', 'yellow'),
  'general.shoes': local(realV9.shoes, 'Shoes', 'rose'),
  'send.parcel': local(realV9.sendParcel, 'Parcel delivery', 'yellow'),
  'send.documents': local(realV9.sendDocuments, 'Document delivery', 'blue'),
  'send.gift': local(realV9.sendGift, 'Gift delivery', 'rose'),
  'send.business': local(realV9.sendBusiness, 'Business delivery', 'green'),
  'general.cube-outline': local(realV9.sendParcel, 'Parcel delivery', 'yellow'),
  'general.document-text-outline': local(realV9.sendDocuments, 'Document delivery', 'blue'),
  'general.gift-outline': local(realV9.sendGift, 'Gift delivery', 'rose'),
  'general.briefcase-outline': local(realV9.sendBusiness, 'Business delivery', 'green'),
};

const FALLBACK:CategoryVisual = { ...local(realV9.home, 'Category photography unavailable', 'cream', { qualityStatus:'temporary-fallback' }), image:undefined };

/** Explicit semantic inheritance. Display labels never participate in resolution. */
const CATEGORY_PARENT_KEYS: Record<string, string> = {
  'groceries.freshProduce': 'groceries.fresh',
  'groceries.meatFish': 'groceries.meat-fish',
  'groceries.dairyEggs': 'groceries.dairy',
  'butchery.bbq': 'butchery.beef',
  'pharmacy.mens-health': 'pharmacy.vitamins',
};

const DOMAIN_VISUAL_KEYS: Record<string, string> = {
  groceries: 'shops.supermarket',
  butchery: 'shops.butcherySeafood',
  pharmacy: 'shops.pharmacy',
  electronics: 'electronics.phones',
  food: 'food.food',
  dineout: 'dineout.casual',
  beauty: 'beauty.skincare',
  fashion: 'fashion.women',
  home: 'home.cleaning',
};

export type CategoryVisualResolution = { visual: CategoryVisual; resolvedKey: string; level: 'exact' | 'parent' | 'domain' | 'fallback' };

export function resolveCategoryVisual(key: string): CategoryVisualResolution {
  const exact=CATEGORY_VISUALS[key];
  if(exact) return {visual:exact,resolvedKey:key,level:'exact'};
  const parentKey=CATEGORY_PARENT_KEYS[key] ?? key.split('.').slice(0,-1).join('.');
  const parent=parentKey ? CATEGORY_VISUALS[parentKey] : undefined;
  if(parent) return {visual:parent,resolvedKey:parentKey,level:'parent'};
  const domainKey=DOMAIN_VISUAL_KEYS[key.split('.')[0]??''];
  const domain=domainKey ? CATEGORY_VISUALS[domainKey] : undefined;
  if(domain) return {visual:domain,resolvedKey:domainKey!,level:'domain'};
  return {visual:FALLBACK,resolvedKey:'fallback',level:'fallback'};
}

const CATEGORY_PRESENTATION: Record<string, VisualPresentation> = {
  'shops.pharmacy': { opticalScale: 1.16 },
  'shops.giftsFlowers': { opticalScale: 1.2, offsetY: -1 },
  'shops.supermarket': { opticalScale: 1.18, offsetY: 1 },
  'shops.butcherySeafood': { opticalScale: 1.16 },
  'shops.petSupplies': { opticalScale: 1.18 },
  'shops.healthBeauty': { opticalScale: 1.16 },
  'pharmacy.pain-relief': { opticalScale: 1.16 },
  'pharmacy.cold-flu': { opticalScale: 1.14 },
  'pharmacy.allergy': { opticalScale: 1.18 },
  'pharmacy.digestive': { opticalScale: 1.16 },
  'pharmacy.first-aid': { opticalScale: 1.16 },
  'pharmacy.vitamins': { opticalScale: 1.15 },
  'groceries.fresh': { opticalScale: 1.17, offsetY: 1 },
  'groceries.freshProduce': { opticalScale: 1.17, offsetY: 1 },
  'groceries.meat-fish': { opticalScale: 1.16 },
  'groceries.meatFish': { opticalScale: 1.16 },
  'groceries.dairy': { opticalScale: 1.16 },
  'groceries.dairyEggs': { opticalScale: 1.16 },
  'groceries.drinks': { opticalScale: 1.18 },
  'groceries.snacks': { opticalScale: 1.16 },
  'groceries.cooking': { opticalScale: 1.2 },
  'food.pizza': { opticalScale: 1.15, aspectRatio: 1.08 },
  'food.burgers': { opticalScale: 1.17 },
  'food.burger': { opticalScale: 1.17 },
  'food.chicken': { opticalScale: 1.15 },
  'food.healthy': { opticalScale: 1.16 },
  'food.indian': { opticalScale: 1.14 },
  'food.breakfast': { opticalScale: 1.16 },
  'electronics.phones': { opticalScale: 1.16 },
  'electronics.audio': { opticalScale: 1.16 },
  'electronics.computing': { opticalScale: 1.16 },
  'pets.dogs': { opticalScale: 1.18 },
  'pets.cats': { opticalScale: 1.18 },
  'beauty.skincare': { opticalScale: 1.16 },
  'fashion.women': { opticalScale: 1.16 },
};

export function categoryVisual(
  key: string,
  options: { market?: 'Uganda' | 'Kenya' | 'Tanzania'; cmsOverride?: CmsCategoryVisualOverride } = {},
): CategoryVisual {
  const packaged = resolveCategoryVisual(key).visual;
  if (options.cmsOverride) {
    const override: CategoryVisualAsset = {
      type: options.cmsOverride.type,
      uri: options.cmsOverride.assetUrl,
      alt: options.cmsOverride.alt,
      aspectRatio: options.cmsOverride.aspectRatio,
      sourceMetadata: options.cmsOverride.sourceMetadata,
    };
    return { ...packaged, ...options.cmsOverride.presentation, asset: override, image: { uri: options.cmsOverride.assetUrl }, alt: override.alt };
  }
  const marketAsset = options.market ? packaged.marketOverrides?.[options.market] : undefined;
  const presentation = CATEGORY_PRESENTATION[key];
  if (!marketAsset) return presentation ? { ...packaged, ...presentation } : packaged;
  return marketAsset.type === 'local-photo'
    ? { ...packaged, asset: marketAsset, image: marketAsset.source, alt: marketAsset.alt }
    : { ...packaged, asset: marketAsset, image: { uri: marketAsset.uri }, alt: marketAsset.alt };
}

const NAVIGATION_VISUALS: Record<string, Required<Pick<SemanticVisual, 'icon' | 'accessibilityLabel'>>> = {
  home: { icon: 'home-outline', accessibilityLabel: 'Home' },
  explore: { icon: 'compass-outline', accessibilityLabel: 'Explore' },
  pay: { icon: 'wallet-outline', accessibilityLabel: 'Pay' },
  activity: { icon: 'time-outline', accessibilityLabel: 'Activity' },
  account: { icon: 'person-outline', accessibilityLabel: 'Account' },
};

export const SERVICE_VISUALS: Record<string, SemanticVisual> = {
  rides: { image: assets.service.rides, accessibilityLabel: 'Rides', sizeTier:'large', opticalScale:.94, shadow:'none', backgroundMode:'transparent' },
  food: { image: assets.service.food, accessibilityLabel: 'Food', sizeTier:'large', opticalScale:.92, shadow:'none', backgroundMode:'transparent' },
  groceries: { image: assets.service.groceries, accessibilityLabel: 'Groceries', sizeTier:'large', opticalScale:.92, shadow:'none', backgroundMode:'transparent' },
  boda: { image: assets.service.boda, accessibilityLabel: 'Boda motorcycle', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  pharmacy: { image: assets.service.pharmacy, accessibilityLabel: 'Pharmacy', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  shops: { image: assets.service.shops, accessibilityLabel: 'Shops', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  electronics: { image: assets.service.electronics, accessibilityLabel: 'Electronics', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  send: { image: assets.service.send, accessibilityLabel: 'Send', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  pay: { image: realV9.pay, accessibilityLabel: 'Kareebu Pay', sizeTier:'large', opticalScale:1.16, shadow:'contact', backgroundMode:'transparent' },
  more: { image: realV9.home, accessibilityLabel: 'More services', sizeTier:'large', opticalScale:1.13, shadow:'contact', backgroundMode:'transparent' },
  homeCare: { image: assets.service.homeCare, accessibilityLabel: 'Home and Care', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  homeServices: { image: assets.service.homeServices, accessibilityLabel: 'Local services', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  dineout: { image: assets.service.dineout, accessibilityLabel: 'DineOut', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  fix: { image: assets.service.fix, accessibilityLabel: 'Fix and repairs', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  forGood: { image: realV9.flowers, accessibilityLabel: 'For Good', sizeTier:'large', opticalScale:1.1, shadow:'contact', backgroundMode:'transparent' },
  goOut: { image: assets.service.goOut, accessibilityLabel: 'Go Out', sizeTier:'large', opticalScale:.9, shadow:'none', backgroundMode:'transparent' },
  healthcare: { image: realV9.healthcare, accessibilityLabel: 'Rewards and wellbeing', sizeTier:'large', opticalScale:1.1, shadow:'contact', backgroundMode:'transparent' },
  rewards: { image: realV9.pay, accessibilityLabel: 'Rewards', sizeTier:'large', opticalScale:1.14, shadow:'contact', backgroundMode:'transparent' },
  support: { image: require('../../assets/kareebu-plus/lifestyle-cutouts/service-home-care.png'), accessibilityLabel: 'Help and support', sizeTier:'large', opticalScale:1.1, shadow:'contact', backgroundMode:'transparent' },
};

export function serviceVisual(key: string): SemanticVisual {
  const visual=SERVICE_VISUALS[key] ?? SERVICE_VISUALS.more!;
  return { ...DEFAULT_PHOTO_PRESENTATION, sizeTier:'large', ...visual };
}

export function navigationVisual(key: string) { return NAVIGATION_VISUALS[key] ?? NAVIGATION_VISUALS.explore; }
