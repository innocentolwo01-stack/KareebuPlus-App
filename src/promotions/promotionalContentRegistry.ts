import type { ImageSourcePropType } from 'react-native';

import type { Screen } from '../types';

export const KAREEBU_BANNER_WIDTH = 1817 as const;
export const KAREEBU_BANNER_HEIGHT = 866 as const;
export const KAREEBU_BANNER_ASPECT_RATIO = KAREEBU_BANNER_WIDTH / KAREEBU_BANNER_HEIGHT;

export type PromotionalAssetType =
  | 'category-banner'
  | 'subcategory-banner'
  | 'wide-promotion'
  | 'square-promotion'
  | 'home-promotion';

export type PromotionalPlacement =
  | 'home'
  | 'category-landing'
  | 'subcategory-landing';

export type PromotionalAssetOrigin =
  | 'approved-bespoke'
  | 'upload-ready-webp'
  | 'legacy-gap';

export type KareebuBannerDestination = {
  screen: Screen;
  categoryId?: string;
  vehicleMode?: 'RIDE' | 'BODA';
};

export type KareebuBannerAsset = {
  id: string;
  kind: 'category' | 'promo';
  type: PromotionalAssetType;
  slug: string;
  title: string;
  body: string;
  ctaLabel: string;
  accessibilityLabel: string;
  destination: KareebuBannerDestination;
  route: KareebuBannerDestination;
  width: number;
  height: number;
  aspectRatio: number;
  bakedCopy: true;
  priority: number;
  placement: readonly PromotionalPlacement[];
  active: boolean;
  origin: PromotionalAssetOrigin;
  category?: string;
  subcategory?: string;
  campaign?: string;
  source: ImageSourcePropType;
};

type RegistryInput = Omit<
  KareebuBannerAsset,
  'accessibilityLabel' | 'aspectRatio' | 'bakedCopy' | 'route' | 'active'
> & {
  accessibilityLabel?: string;
  active?: boolean;
};

const register = (input: RegistryInput): KareebuBannerAsset => ({
  ...input,
  accessibilityLabel: input.accessibilityLabel
    ?? [input.title, input.body, input.ctaLabel].filter(Boolean).join('. '),
  route: input.destination,
  aspectRatio: input.width / input.height,
  bakedCopy: true,
  active: input.active ?? true,
});

type UploadInput = Omit<
  RegistryInput,
  'kind' | 'type' | 'width' | 'height' | 'priority' | 'placement' | 'origin'
>;

const uploadCategory = (input: UploadInput): KareebuBannerAsset => register({
  ...input,
  kind: 'category',
  type: 'category-banner',
  width: KAREEBU_BANNER_WIDTH,
  height: KAREEBU_BANNER_HEIGHT,
  priority: 300,
  placement: ['home', 'category-landing'],
  origin: 'upload-ready-webp',
});

const uploadPromotion = (input: UploadInput): KareebuBannerAsset => register({
  ...input,
  kind: 'promo',
  type: 'wide-promotion',
  width: KAREEBU_BANNER_WIDTH,
  height: KAREEBU_BANNER_HEIGHT,
  priority: 300,
  placement: ['home', 'category-landing'],
  origin: 'upload-ready-webp',
});

type LegacyInput = {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  destination: KareebuBannerDestination;
  source: ImageSourcePropType;
};

const legacyGap = (input: LegacyInput): KareebuBannerAsset => register({
  ...input,
  kind: 'category',
  type: input.subcategory ? 'subcategory-banner' : 'category-banner',
  slug: input.id.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase(),
  body: '',
  ctaLabel: '',
  accessibilityLabel: `${input.title}. Open ${input.title} discovery.`,
  width: 420,
  height: 200,
  priority: 100,
  placement: [input.subcategory ? 'subcategory-landing' : 'category-landing'],
  origin: 'legacy-gap',
});

const approvedGroceriesWide = register({
  id: 'approved-groceries-essentials-wide',
  kind: 'category',
  type: 'category-banner',
  slug: 'groceries-essentials-promo-420x200',
  title: 'Groceries and essentials',
  body: 'Fresh groceries and everyday essentials.',
  ctaLabel: 'Shop now',
  accessibilityLabel: 'Groceries and essentials. Fresh groceries and everyday essentials. Shop now.',
  destination: { screen: 'groceries', categoryId: 'groceries' },
  width: 420,
  height: 200,
  priority: 400,
  placement: ['home', 'category-landing'],
  origin: 'approved-bespoke',
  category: 'groceries',
  source: require('../../assets/kareebu-plus/banners/approved/groceries-essentials-promo-420x200.png'),
});

const approvedGroceriesSquare = register({
  id: 'approved-groceries-fresh-picks-square',
  kind: 'promo',
  type: 'square-promotion',
  slug: 'groceries-fresh-picks-square-360x360',
  title: 'Fresh picks',
  body: 'Fresh grocery picks for the week.',
  ctaLabel: 'Shop fresh',
  accessibilityLabel: 'Fresh picks. Shop fresh groceries.',
  destination: { screen: 'groceries', categoryId: 'fresh-produce' },
  width: 360,
  height: 360,
  priority: 400,
  placement: ['category-landing'],
  origin: 'approved-bespoke',
  category: 'groceries',
  subcategory: 'fresh-produce',
  campaign: 'fresh-picks',
  source: require('../../assets/kareebu-plus/banners/approved/groceries-fresh-picks-square-360x360.png'),
});

export const kareebuBannerRegistry = {
  category: {
    shopsMarketplace: uploadCategory({id:"category-shops-marketplace",slug:"01-shops-marketplace",title:"Shop more. Live easier.",body:"Discover fashion, beauty and everyday finds in one place.",ctaLabel:"Start shopping",category:"shops",destination:{screen:"shops",categoryId:"shops-marketplace"},source:require('../../assets/kareebu-plus/banners/category/01-shops-marketplace.webp')}),
    foodDelivery: uploadCategory({id:"category-food-delivery",slug:"03-food-delivery",title:"Good food. Right on time.",body:"Kampala favourites delivered to your door.",ctaLabel:"Order food",category:"food",destination:{screen:"food",categoryId:"food-delivery"},source:require('../../assets/kareebu-plus/banners/category/03-food-delivery.webp')}),
    dineOutRestaurants: uploadCategory({id:"category-dineout-restaurants",slug:"04-dineout-restaurants",title:"Your table is waiting.",body:"Discover places to eat, meet and celebrate around Kampala.",ctaLabel:"Find a table",category:"dineout",destination:{screen:"dineOut",categoryId:"dineout-restaurants"},source:require('../../assets/kareebu-plus/banners/category/04-dineout-restaurants.webp')}),
    cafesCoffee: uploadCategory({id:"category-cafes-coffee",slug:"05-cafes-coffee",title:"Coffee tastes better together.",body:"Find your next Kampala coffee stop.",ctaLabel:"Explore cafés",category:"food",subcategory:"cafes",destination:{screen:"foodCategory",categoryId:"Cafés & Coffee"},source:require('../../assets/kareebu-plus/banners/category/05-cafes-coffee.webp')}),
    rides: uploadCategory({id:"category-rides",slug:"06-rides",title:"Move around with ease.",body:"A ride for every Kampala plan.",ctaLabel:"Book a ride",category:"rides",destination:{screen:"mobilityHome",categoryId:"rides",vehicleMode:"RIDE"},source:require('../../assets/kareebu-plus/banners/category/06-rides.webp')}),
    boda: uploadCategory({id:"category-boda",slug:"07-boda",title:"Beat the traffic. Ride smart.",body:"Quick boda trips with safety in mind.",ctaLabel:"Book a boda",category:"boda",destination:{screen:"mobilityHome",categoryId:"boda",vehicleMode:"BODA"},source:require('../../assets/kareebu-plus/banners/category/07-boda.webp')}),
    parcelDelivery: uploadCategory({id:"category-parcel-delivery",slug:"08-parcel-delivery",title:"Send it. Track it.",body:"Delivery from pickup to drop-off.",ctaLabel:"Send a parcel",category:"send",destination:{screen:"parcel",categoryId:"parcel-delivery"},source:require('../../assets/kareebu-plus/banners/category/08-parcel-delivery.webp')}),
    carRentals: uploadCategory({id:"category-car-rentals",slug:"09-car-rentals",title:"Your road trip starts here.",body:"Find the right car for every journey.",ctaLabel:"Rent a car",category:"rentals",destination:{screen:"rentals",categoryId:"car-rentals"},source:require('../../assets/kareebu-plus/banners/category/09-car-rentals.webp')}),
    homeServices: uploadCategory({id:"category-home-services",slug:"10-home-services",title:"Help for every home task.",body:"Local professionals for everyday tasks.",ctaLabel:"Find a pro",category:"home-care",destination:{screen:"serviceMarketplace",categoryId:"home-services"},source:require('../../assets/kareebu-plus/banners/category/10-home-services.webp')}),
    pharmacyHealth: uploadCategory({id:"category-pharmacy-health",slug:"11-pharmacy-health",title:"Everyday care, close to you.",body:"Health and wellness essentials from stores nearby.",ctaLabel:"Shop pharmacy",category:"pharmacy",destination:{screen:"pharmacyHome",categoryId:"pharmacy"},source:require('../../assets/kareebu-plus/banners/category/11-pharmacy-health.webp')}),
    fashion: uploadCategory({id:"category-fashion",slug:"12-fashion",title:"Kampala style. Made yours.",body:"Fresh looks for every plan and mood.",ctaLabel:"Shop fashion",category:"fashion",destination:{screen:"fashionHome",categoryId:"fashion"},source:require('../../assets/kareebu-plus/banners/category/12-fashion.webp')}),
    beautyWellness: uploadCategory({id:"category-beauty-wellness",slug:"13-beauty-wellness",title:"Glow your way.",body:"Beauty, hair and self-care made easier.",ctaLabel:"Shop beauty",category:"beauty",destination:{screen:"beautyHome",categoryId:"beauty"},source:require('../../assets/kareebu-plus/banners/category/13-beauty-wellness.webp')}),
    electronics: uploadCategory({id:"category-electronics",slug:"14-electronics",title:"Tech that keeps you moving.",body:"Phones, accessories and everyday electronics.",ctaLabel:"Shop tech",category:"electronics",destination:{screen:"electronicsHome",categoryId:"electronics"},source:require('../../assets/kareebu-plus/banners/category/14-electronics.webp')}),
    pets: uploadCategory({id:"category-pets",slug:"15-pets",title:"More care for your best friend.",body:"Food, treats and essentials for happy pets.",ctaLabel:"Shop pet care",category:"pets",destination:{screen:"petStoresHome",categoryId:"pets"},source:require('../../assets/kareebu-plus/banners/category/15-pets.webp')}),
    gifts: uploadCategory({id:"category-gifts",slug:"16-gifts",title:"Make their day.",body:"Thoughtful gifts for every kind of celebration.",ctaLabel:"Find a gift",category:"gifts",destination:{screen:"giftsFlowersHome",categoryId:"gifts"},source:require('../../assets/kareebu-plus/banners/category/16-gifts.webp')}),
    homeLiving: uploadCategory({id:"category-home-living",slug:"17-home-living",title:"Make home feel more you.",body:"Furniture, décor and everyday home essentials.",ctaLabel:"Shop home",category:"home",destination:{screen:"homeShoppingHome",categoryId:"home"},source:require('../../assets/kareebu-plus/banners/category/17-home-living.webp')}),
    globalShopping: uploadCategory({id:"category-global-shopping",slug:"18-global-shopping",title:"The world, within reach.",body:"Discover global finds for delivery to Uganda.",ctaLabel:"Shop global",category:"global",destination:{screen:"globalHome",categoryId:"global-shopping"},source:require('../../assets/kareebu-plus/banners/category/18-global-shopping.webp')}),
    walletPay: uploadCategory({id:"category-wallet-pay",slug:"19-wallet-pay",title:"Pay simply. Live freely.",body:"Send, request and manage money in one place.",ctaLabel:"Open Wallet",category:"wallet",destination:{screen:"wallet",categoryId:"wallet-pay"},source:require('../../assets/kareebu-plus/banners/category/19-wallet-pay.webp')}),
    localUgandanFood: uploadCategory({id:"category-local-ugandan-food",slug:"20-local-ugandan-food",title:"Taste Uganda.",body:"Matooke, luwombo and more local favourites.",ctaLabel:"Explore local food",category:"food",subcategory:"local-ugandan-food",destination:{screen:"foodCategory",categoryId:"Ugandan"},source:require('../../assets/kareebu-plus/banners/category/20-local-ugandan-food.webp')}),
    groceriesEssentials: approvedGroceriesWide,
  },
  promo: {
    everythingKareebu: uploadPromotion({id:"promo-everything-kareebu",slug:"promo-01-everything-kareebu",title:"Everything you need. One Kareebu+.",body:"Shop, eat, ride, send and more.",ctaLabel:"Explore Kareebu+",campaign:"everything-kareebu",destination:{screen:"exploreHub"},source:require('../../assets/kareebu-plus/banners/promo/promo-01-everything-kareebu.webp')}),
    weekendFood: uploadPromotion({id:"promo-weekend-food",slug:"promo-02-weekend-food",title:"Make the weekend delicious.",body:"Find food for sharing, relaxing and celebrating.",ctaLabel:"Find food",category:"food",campaign:"weekend-food",destination:{screen:"food"},source:require('../../assets/kareebu-plus/banners/promo/promo-02-weekend-food.webp')}),
    freshWeek: uploadPromotion({id:"promo-fresh-week",slug:"promo-03-fresh-week",title:"Fresh for the week.",body:"Stock up on produce and everyday essentials.",ctaLabel:"Shop fresh",category:"groceries",subcategory:"fresh-produce",campaign:"fresh-week",destination:{screen:"groceries",categoryId:"fresh-produce"},source:require('../../assets/kareebu-plus/banners/promo/promo-03-fresh-week.webp')}),
    kampalaStyleEdit: uploadPromotion({id:"promo-kampala-style-edit",slug:"promo-04-kampala-style-edit",title:"The Kampala style edit.",body:"Fresh fashion and beauty for your next look.",ctaLabel:"Explore the edit",category:"fashion",campaign:"kampala-style-edit",destination:{screen:"fashionHome",categoryId:"fashion"},source:require('../../assets/kareebu-plus/banners/promo/promo-04-kampala-style-edit.webp')}),
    coffeeBreak: uploadPromotion({id:"promo-coffee-break",slug:"promo-05-coffee-break",title:"Your coffee break, sorted.",body:"Find cafés and everyday pick-me-ups nearby.",ctaLabel:"Find a café",category:"food",subcategory:"cafes",campaign:"coffee-break",destination:{screen:"foodCategory",categoryId:"Cafés & Coffee"},source:require('../../assets/kareebu-plus/banners/promo/promo-05-coffee-break.webp')}),
    kampalaMoving: uploadPromotion({id:"promo-kampala-moving",slug:"promo-06-kampala-moving",title:"Kampala plans? Keep moving.",body:"Choose the ride that fits your day.",ctaLabel:"Book now",category:"rides",campaign:"kampala-moving",destination:{screen:"mobilityHome"},source:require('../../assets/kareebu-plus/banners/promo/promo-06-kampala-moving.webp')}),
    homeRefresh: uploadPromotion({id:"promo-home-refresh",slug:"promo-07-home-refresh",title:"A little help goes a long way.",body:"Find services and essentials for your space.",ctaLabel:"Refresh home",category:"home-care",campaign:"home-refresh",destination:{screen:"serviceMarketplace",categoryId:"home-services"},source:require('../../assets/kareebu-plus/banners/promo/promo-07-home-refresh.webp')}),
    globalFinds: uploadPromotion({id:"promo-global-finds",slug:"promo-08-global-finds",title:"Discover something new.",body:"Explore finds from around the world.",ctaLabel:"Shop global",category:"global",campaign:"global-finds",destination:{screen:"globalHome"},source:require('../../assets/kareebu-plus/banners/promo/promo-08-global-finds.webp')}),
  },
  approved: {
    groceriesFreshPicksSquare: approvedGroceriesSquare,
  },
} as const satisfies {
  category: Record<string, KareebuBannerAsset>;
  promo: Record<string, KareebuBannerAsset>;
  approved: Record<string, KareebuBannerAsset>;
};

export const legacySubcategoryBannerRegistry = {
  main: {
    goOut: legacyGap({id:"00_main.go_out",title:"Go Out",category:"goout",destination:{screen:"exploreHub"},source:require('../../assets/kareebu-plus/category-banners/00_main/go_out.png')}),
  },
  food: {
    burgers: legacyGap({id:"food.burgers",title:"Burgers",category:"food",subcategory:"burgers",destination:{screen:"foodCategory",categoryId:"Burgers"},source:require('../../assets/kareebu-plus/category-banners/food/burgers.png')}),
    africanFood: legacyGap({id:"food.african_food",title:"African Food",category:"food",subcategory:"african",destination:{screen:"foodCategory",categoryId:"African"},source:require('../../assets/kareebu-plus/category-banners/food/african_food.png')}),
    pizza: legacyGap({id:"food.pizza",title:"Pizza",category:"food",subcategory:"pizza",destination:{screen:"foodCategory",categoryId:"Pizza"},source:require('../../assets/kareebu-plus/category-banners/food/pizza.png')}),
    breakfastBrunch: legacyGap({id:"food.breakfast_brunch",title:"Breakfast & Brunch",category:"food",subcategory:"breakfast",destination:{screen:"foodCategory",categoryId:"Breakfast"},source:require('../../assets/kareebu-plus/category-banners/food/breakfast_brunch.png')}),
    chicken: legacyGap({id:"food.chicken",title:"Chicken",category:"food",subcategory:"chicken",destination:{screen:"foodCategory",categoryId:"Chicken"},source:require('../../assets/kareebu-plus/category-banners/food/chicken.png')}),
    healthyFood: legacyGap({id:"food.healthy_food",title:"Healthy Food",category:"food",subcategory:"healthy",destination:{screen:"foodCategory",categoryId:"Healthy"},source:require('../../assets/kareebu-plus/category-banners/food/healthy_food.png')}),
    indianFood: legacyGap({id:"food.indian_food",title:"Indian Food",category:"food",subcategory:"indian",destination:{screen:"foodCategory",categoryId:"Indian"},source:require('../../assets/kareebu-plus/category-banners/food/indian_food.png')}),
    grillsBbq: legacyGap({id:"food.grills_bbq",title:"Grills & BBQ",category:"food",subcategory:"grills-bbq",destination:{screen:"foodCategory",categoryId:"Grills & BBQ"},source:require('../../assets/kareebu-plus/category-banners/food/grills_bbq.png')}),
    seafood: legacyGap({id:"food.seafood",title:"Seafood",category:"food",subcategory:"seafood",destination:{screen:"foodCategory",categoryId:"Seafood"},source:require('../../assets/kareebu-plus/category-banners/food/seafood.png')}),
    dessertsTreats: legacyGap({id:"food.desserts_treats",title:"Desserts & Treats",category:"food",subcategory:"desserts",destination:{screen:"foodCategory",categoryId:"Desserts & Treats"},source:require('../../assets/kareebu-plus/category-banners/food/desserts_treats.png')}),
    fastFood: legacyGap({id:"food.fast_food",title:"Fast Food",category:"food",subcategory:"fast-food",destination:{screen:"foodCategory",categoryId:"Fast Food"},source:require('../../assets/kareebu-plus/category-banners/food/fast_food.png')}),
  },
  groceries: {
    freshProduce: legacyGap({id:"groceries.fresh_produce",title:"Fresh Produce",category:"groceries",subcategory:"fresh-produce",destination:{screen:"verticalCategory",categoryId:"groceries.fresh-produce"},source:require('../../assets/kareebu-plus/category-banners/groceries/fresh_produce.png')}),
    meatFish: legacyGap({id:"groceries.meat_fish",title:"Meat & Fish",category:"groceries",subcategory:"meat-fish",destination:{screen:"verticalCategory",categoryId:"groceries.meat"},source:require('../../assets/kareebu-plus/category-banners/groceries/meat_fish.png')}),
    dairyEggs: legacyGap({id:"groceries.dairy_eggs",title:"Dairy & Eggs",category:"groceries",subcategory:"dairy-eggs",destination:{screen:"verticalCategory",categoryId:"groceries.dairy"},source:require('../../assets/kareebu-plus/category-banners/groceries/dairy_eggs.png')}),
    bakery: legacyGap({id:"groceries.bakery",title:"Bakery",category:"groceries",subcategory:"bakery",destination:{screen:"verticalCategory",categoryId:"groceries.bakery"},source:require('../../assets/kareebu-plus/category-banners/groceries/bakery.png')}),
    pantryStaples: legacyGap({id:"groceries.pantry_staples",title:"Pantry Staples",category:"groceries",subcategory:"pantry-staples",destination:{screen:"verticalCategory",categoryId:"groceries.rice-pasta-pulses"},source:require('../../assets/kareebu-plus/category-banners/groceries/pantry_staples.png')}),
    drinks: legacyGap({id:"groceries.drinks",title:"Drinks",category:"groceries",subcategory:"drinks",destination:{screen:"verticalCategory",categoryId:"groceries.beverages"},source:require('../../assets/kareebu-plus/category-banners/groceries/drinks.png')}),
    snacksSweets: legacyGap({id:"groceries.snacks_sweets",title:"Snacks & Sweets",category:"groceries",subcategory:"snacks-sweets",destination:{screen:"verticalCategory",categoryId:"groceries.snacks"},source:require('../../assets/kareebu-plus/category-banners/groceries/snacks_sweets.png')}),
    frozenFoods: legacyGap({id:"groceries.frozen_foods",title:"Frozen Foods",category:"groceries",subcategory:"frozen-foods",destination:{screen:"verticalCategory",categoryId:"groceries.frozen"},source:require('../../assets/kareebu-plus/category-banners/groceries/frozen_foods.png')}),
    householdCleaning: legacyGap({id:"groceries.household_cleaning",title:"Household & Cleaning",category:"groceries",subcategory:"household-cleaning",destination:{screen:"verticalCategory",categoryId:"groceries.household"},source:require('../../assets/kareebu-plus/category-banners/groceries/household_cleaning.png')}),
    personalCare: legacyGap({id:"groceries.personal_care",title:"Personal Care",category:"groceries",subcategory:"personal-care",destination:{screen:"verticalCategory",categoryId:"groceries.personal-care"},source:require('../../assets/kareebu-plus/category-banners/groceries/personal_care.png')}),
    babyChild: legacyGap({id:"groceries.baby_child",title:"Baby & Child",category:"groceries",subcategory:"baby-child",destination:{screen:"verticalCategory",categoryId:"groceries.baby"},source:require('../../assets/kareebu-plus/category-banners/groceries/baby_child.png')}),
    organicHealthy: legacyGap({id:"groceries.organic_healthy",title:"Organic & Healthy",category:"groceries",subcategory:"organic-healthy",destination:{screen:"verticalCategory",categoryId:"groceries.health"},source:require('../../assets/kareebu-plus/category-banners/groceries/organic_healthy.png')}),
  },
  pharmacy: {
    medicines: legacyGap({id:"pharmacy.medicines",title:"Medicines",category:"pharmacy",subcategory:"medicines",destination:{screen:"verticalCategory",categoryId:"pharmacy.medicines"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/medicines.png')}),
    painRelief: legacyGap({id:"pharmacy.pain_relief",title:"Pain Relief",category:"pharmacy",subcategory:"pain-relief",destination:{screen:"verticalCategory",categoryId:"pharmacy.pain-relief"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/pain_relief.png')}),
    coldFlu: legacyGap({id:"pharmacy.cold_flu",title:"Cold & Flu",category:"pharmacy",subcategory:"cold-flu",destination:{screen:"verticalCategory",categoryId:"pharmacy.cold-flu"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/cold_flu.png')}),
    vitaminsSupplements: legacyGap({id:"pharmacy.vitamins_supplements",title:"Vitamins & Supplements",category:"pharmacy",subcategory:"vitamins-supplements",destination:{screen:"verticalCategory",categoryId:"pharmacy.vitamins-supplements"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/vitamins_supplements.png')}),
    firstAid: legacyGap({id:"pharmacy.first_aid",title:"First Aid",category:"pharmacy",subcategory:"first-aid",destination:{screen:"verticalCategory",categoryId:"pharmacy.first-aid"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/first_aid.png')}),
    digestiveHealth: legacyGap({id:"pharmacy.digestive_health",title:"Digestive Health",category:"pharmacy",subcategory:"digestive-health",destination:{screen:"verticalCategory",categoryId:"pharmacy.digestive"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/digestive_health.png')}),
    allergyCare: legacyGap({id:"pharmacy.allergy_care",title:"Allergy Care",category:"pharmacy",subcategory:"allergy-care",destination:{screen:"verticalCategory",categoryId:"pharmacy.allergy"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/allergy_care.png')}),
    sexualWellness: legacyGap({id:"pharmacy.sexual_wellness",title:"Sexual Wellness",category:"pharmacy",subcategory:"sexual-wellness",destination:{screen:"verticalCategory",categoryId:"pharmacy.sexual-wellness"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/sexual_wellness.png')}),
    motherBaby: legacyGap({id:"pharmacy.mother_baby",title:"Mother & Baby",category:"pharmacy",subcategory:"mother-baby",destination:{screen:"verticalCategory",categoryId:"pharmacy.baby-child"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/mother_baby.png')}),
    skinCare: legacyGap({id:"pharmacy.skin_care",title:"Skin Care",category:"pharmacy",subcategory:"skin-care",destination:{screen:"verticalCategory",categoryId:"pharmacy.skincare"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/skin_care.png')}),
    personalCare: legacyGap({id:"pharmacy.personal_care",title:"Personal Care",category:"pharmacy",subcategory:"personal-care",destination:{screen:"verticalCategory",categoryId:"pharmacy.personal-care"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/personal_care.png')}),
    fitnessNutrition: legacyGap({id:"pharmacy.fitness_nutrition",title:"Fitness & Nutrition",category:"pharmacy",subcategory:"fitness-nutrition",destination:{screen:"verticalCategory",categoryId:"pharmacy.fitness-nutrition"},source:require('../../assets/kareebu-plus/category-banners/pharmacy/fitness_nutrition.png')}),
  },
  fashionBeauty: {
    womensFashion: legacyGap({id:"fashion_beauty.womens_fashion",title:"Women's Fashion",category:"fashion",subcategory:"women",destination:{screen:"verticalCategory",categoryId:"fashion.women"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/womens_fashion.png')}),
    mensFashion: legacyGap({id:"fashion_beauty.mens_fashion",title:"Men's Fashion",category:"fashion",subcategory:"men",destination:{screen:"verticalCategory",categoryId:"fashion.men"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/mens_fashion.png')}),
    kidsFashion: legacyGap({id:"fashion_beauty.kids_fashion",title:"Kids' Fashion",category:"fashion",subcategory:"kids",destination:{screen:"verticalCategory",categoryId:"fashion.kids"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/kids_fashion.png')}),
    shoes: legacyGap({id:"fashion_beauty.shoes",title:"Shoes",category:"fashion",subcategory:"shoes",destination:{screen:"verticalCategory",categoryId:"fashion.shoes"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/shoes.png')}),
    bags: legacyGap({id:"fashion_beauty.bags",title:"Bags",category:"fashion",subcategory:"bags",destination:{screen:"verticalCategory",categoryId:"fashion.bags"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/bags.png')}),
    jewelleryWatches: legacyGap({id:"fashion_beauty.jewellery_watches",title:"Jewellery & Watches",category:"fashion",subcategory:"jewellery-watches",destination:{screen:"verticalCategory",categoryId:"fashion.jewellery-watches"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/jewellery_watches.png')}),
    accessories: legacyGap({id:"fashion_beauty.accessories",title:"Accessories",category:"fashion",subcategory:"accessories",destination:{screen:"verticalCategory",categoryId:"fashion.accessories"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/accessories.png')}),
    skincare: legacyGap({id:"fashion_beauty.skincare",title:"Skincare",category:"beauty",subcategory:"skincare",destination:{screen:"verticalCategory",categoryId:"beauty.skincare"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/skincare.png')}),
    makeup: legacyGap({id:"fashion_beauty.makeup",title:"Makeup",category:"beauty",subcategory:"makeup",destination:{screen:"verticalCategory",categoryId:"beauty.makeup"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/makeup.png')}),
    hairCare: legacyGap({id:"fashion_beauty.hair_care",title:"Hair Care",category:"beauty",subcategory:"hair",destination:{screen:"verticalCategory",categoryId:"beauty.hair"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/hair_care.png')}),
    fragrance: legacyGap({id:"fashion_beauty.fragrance",title:"Fragrance",category:"beauty",subcategory:"fragrance",destination:{screen:"verticalCategory",categoryId:"beauty.fragrance"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/fragrance.png')}),
    beautyTools: legacyGap({id:"fashion_beauty.beauty_tools",title:"Beauty Tools",category:"beauty",subcategory:"tools",destination:{screen:"verticalCategory",categoryId:"beauty.tools"},source:require('../../assets/kareebu-plus/category-banners/fashion_beauty/beauty_tools.png')}),
  },
  electronics: {
    smartphones: legacyGap({id:"electronics.smartphones",title:"Smartphones",category:"electronics",subcategory:"phones",destination:{screen:"verticalCategory",categoryId:"electronics.phones"},source:require('../../assets/kareebu-plus/category-banners/electronics/smartphones.png')}),
    laptopsComputers: legacyGap({id:"electronics.laptops_computers",title:"Laptops & Computers",category:"electronics",subcategory:"computers",destination:{screen:"verticalCategory",categoryId:"electronics.computers"},source:require('../../assets/kareebu-plus/category-banners/electronics/laptops_computers.png')}),
    televisions: legacyGap({id:"electronics.televisions",title:"Televisions",category:"electronics",subcategory:"tv",destination:{screen:"verticalCategory",categoryId:"electronics.tv"},source:require('../../assets/kareebu-plus/category-banners/electronics/televisions.png')}),
    audioHeadphones: legacyGap({id:"electronics.audio_headphones",title:"Audio & Headphones",category:"electronics",subcategory:"audio",destination:{screen:"verticalCategory",categoryId:"electronics.audio"},source:require('../../assets/kareebu-plus/category-banners/electronics/audio_headphones.png')}),
    gaming: legacyGap({id:"electronics.gaming",title:"Gaming",category:"electronics",subcategory:"gaming",destination:{screen:"verticalCategory",categoryId:"electronics.gaming"},source:require('../../assets/kareebu-plus/category-banners/electronics/gaming.png')}),
    smartwatches: legacyGap({id:"electronics.smartwatches",title:"Smartwatches",category:"electronics",subcategory:"wearables",destination:{screen:"verticalCategory",categoryId:"electronics.wearables"},source:require('../../assets/kareebu-plus/category-banners/electronics/smartwatches.png')}),
    cameras: legacyGap({id:"electronics.cameras",title:"Cameras",category:"electronics",subcategory:"cameras",destination:{screen:"verticalCategory",categoryId:"electronics.cameras"},source:require('../../assets/kareebu-plus/category-banners/electronics/cameras.png')}),
    phoneAccessories: legacyGap({id:"electronics.phone_accessories",title:"Phone Accessories",category:"electronics",subcategory:"phone-accessories",destination:{screen:"verticalCategory",categoryId:"electronics.phone-accessories"},source:require('../../assets/kareebu-plus/category-banners/electronics/phone_accessories.png')}),
    computerAccessories: legacyGap({id:"electronics.computer_accessories",title:"Computer Accessories",category:"electronics",subcategory:"computer-accessories",destination:{screen:"verticalCategory",categoryId:"electronics.computer-accessories"},source:require('../../assets/kareebu-plus/category-banners/electronics/computer_accessories.png')}),
    homeAppliances: legacyGap({id:"electronics.home_appliances",title:"Home Appliances",category:"electronics",subcategory:"appliances",destination:{screen:"verticalCategory",categoryId:"electronics.appliances"},source:require('../../assets/kareebu-plus/category-banners/electronics/home_appliances.png')}),
    kitchenAppliances: legacyGap({id:"electronics.kitchen_appliances",title:"Kitchen Appliances",category:"electronics",subcategory:"kitchen-appliances",destination:{screen:"verticalCategory",categoryId:"electronics.kitchen-appliances"},source:require('../../assets/kareebu-plus/category-banners/electronics/kitchen_appliances.png')}),
    powerCharging: legacyGap({id:"electronics.power_charging",title:"Power & Charging",category:"electronics",subcategory:"power",destination:{screen:"verticalCategory",categoryId:"electronics.power"},source:require('../../assets/kareebu-plus/category-banners/electronics/power_charging.png')}),
  },
  homeCare: {
    cleaning: legacyGap({id:"home_care.cleaning",title:"Cleaning",category:"home-care",subcategory:"cleaning",destination:{screen:"serviceProviders",categoryId:"cleaning"},source:require('../../assets/kareebu-plus/category-banners/home_care/cleaning.png')}),
    plumbing: legacyGap({id:"home_care.plumbing",title:"Plumbing",category:"home-care",subcategory:"plumbing",destination:{screen:"serviceProviders",categoryId:"plumbing"},source:require('../../assets/kareebu-plus/category-banners/home_care/plumbing.png')}),
    electrical: legacyGap({id:"home_care.electrical",title:"Electrical",category:"home-care",subcategory:"electrical",destination:{screen:"serviceProviders",categoryId:"electrical"},source:require('../../assets/kareebu-plus/category-banners/home_care/electrical.png')}),
    acService: legacyGap({id:"home_care.ac_service",title:"AC Service",category:"home-care",subcategory:"ac",destination:{screen:"serviceProviders",categoryId:"ac"},source:require('../../assets/kareebu-plus/category-banners/home_care/ac_service.png')}),
    moving: legacyGap({id:"home_care.moving",title:"Moving",category:"home-care",subcategory:"moving-help",destination:{screen:"serviceProviders",categoryId:"moving-help"},source:require('../../assets/kareebu-plus/category-banners/home_care/moving.png')}),
    beautyAtHome: legacyGap({id:"home_care.beauty_at_home",title:"Beauty at Home",category:"home-care",subcategory:"beauty-home",destination:{screen:"serviceProviders",categoryId:"beauty-home"},source:require('../../assets/kareebu-plus/category-banners/home_care/beauty_at_home.png')}),
    handyman: legacyGap({id:"home_care.handyman",title:"Handyman",category:"home-care",subcategory:"handyman",destination:{screen:"serviceProviders",categoryId:"handyman"},source:require('../../assets/kareebu-plus/category-banners/home_care/handyman.png')}),
    laundryDryCleaning: legacyGap({id:"home_care.laundry_dry_cleaning",title:"Laundry & Dry Cleaning",category:"home-care",subcategory:"laundry",destination:{screen:"serviceProviders",categoryId:"laundry"},source:require('../../assets/kareebu-plus/category-banners/home_care/laundry_dry_cleaning.png')}),
  },
  goOut: {
    attractionsLeisure: legacyGap({id:"07_go_out.attractions_leisure",title:"Attractions & Leisure",category:"goout",subcategory:"attractions-leisure",destination:{screen:"exploreHub",categoryId:"goout.attractions-leisure"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/attractions_leisure.png')}),
    spaWellness: legacyGap({id:"07_go_out.spa_wellness",title:"Spa & Wellness",category:"goout",subcategory:"spa-wellness",destination:{screen:"exploreHub",categoryId:"goout.spa-wellness"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/spa_wellness.png')}),
    themeParksFun: legacyGap({id:"07_go_out.theme_parks_fun",title:"Theme Parks & Fun",category:"goout",subcategory:"theme-parks",destination:{screen:"exploreHub",categoryId:"goout.theme-parks"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/theme_parks_fun.png')}),
    cinema: legacyGap({id:"07_go_out.cinema",title:"Cinema",category:"goout",subcategory:"cinema",destination:{screen:"exploreHub",categoryId:"goout.cinema"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/cinema.png')}),
    kidsActivities: legacyGap({id:"07_go_out.kids_activities",title:"Kids Activities",category:"goout",subcategory:"kids-activities",destination:{screen:"exploreHub",categoryId:"goout.kids-activities"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/kids_activities.png')}),
    restaurantsDining: legacyGap({id:"07_go_out.restaurants_dining",title:"Restaurants & Dining",category:"goout",subcategory:"restaurants-dining",destination:{screen:"exploreHub",categoryId:"goout.restaurants-dining"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/restaurants_dining.png')}),
    events: legacyGap({id:"07_go_out.events",title:"Events",category:"goout",subcategory:"events",destination:{screen:"exploreHub",categoryId:"goout.events"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/events.png')}),
    nightlife: legacyGap({id:"07_go_out.nightlife",title:"Nightlife",category:"goout",subcategory:"nightlife",destination:{screen:"exploreHub",categoryId:"goout.nightlife"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/nightlife.png')}),
    parksOutdoors: legacyGap({id:"07_go_out.parks_outdoors",title:"Parks & Outdoors",category:"goout",subcategory:"outdoor",destination:{screen:"exploreHub",categoryId:"goout.outdoor"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/parks_outdoors.png')}),
    experiences: legacyGap({id:"07_go_out.experiences",title:"Experiences",category:"goout",subcategory:"experiences",destination:{screen:"exploreHub",categoryId:"goout.experiences"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/experiences.png')}),
    shoppingMalls: legacyGap({id:"07_go_out.shopping_malls",title:"Shopping & Malls",category:"goout",subcategory:"shopping-malls",destination:{screen:"exploreHub",categoryId:"goout.shopping-malls"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/shopping_malls.png')}),
    dayTrips: legacyGap({id:"07_go_out.day_trips",title:"Day Trips",category:"goout",subcategory:"day-trips",destination:{screen:"exploreHub",categoryId:"goout.day-trips"},source:require('../../assets/kareebu-plus/category-banners/07_go_out/day_trips.png')}),
  },
  send: {
    sendParcel: legacyGap({id:"send.send_parcel",title:"Send a Parcel",category:"send",subcategory:"small-parcel",destination:{screen:"parcel",categoryId:"small-parcel"},source:require('../../assets/kareebu-plus/category-banners/send/send_parcel.png')}),
    sendDocuments: legacyGap({id:"send.send_documents",title:"Send Documents",category:"send",subcategory:"documents",destination:{screen:"parcel",categoryId:"documents"},source:require('../../assets/kareebu-plus/category-banners/send/send_documents.png')}),
    deliverGift: legacyGap({id:"send.deliver_gift",title:"Deliver a Gift",category:"send",subcategory:"gift",destination:{screen:"parcel",categoryId:"gift"},source:require('../../assets/kareebu-plus/category-banners/send/deliver_gift.png')}),
    businessDelivery: legacyGap({id:"send.business_delivery",title:"Business Delivery",category:"send",subcategory:"business",destination:{screen:"parcel",categoryId:"business"},source:require('../../assets/kareebu-plus/category-banners/send/business_delivery.png')}),
  },
} as const satisfies Record<string, Record<string, KareebuBannerAsset>>;

export type KareebuCategoryBannerKey = keyof typeof kareebuBannerRegistry.category;
export type KareebuPromoBannerKey = keyof typeof kareebuBannerRegistry.promo;

export const kareebuCategoryBanners = Object.values(kareebuBannerRegistry.category);
export const kareebuPromoBanners = Object.values(kareebuBannerRegistry.promo);
export const kareebuApprovedBanners = Object.values(kareebuBannerRegistry.approved);
export const kareebuLegacyGapBanners: KareebuBannerAsset[] = Object.values(
  legacySubcategoryBannerRegistry,
).flatMap(group => Object.values(group) as KareebuBannerAsset[]);

const mainCategoryBannerAliases: Record<string, KareebuBannerAsset> = {
  shops: kareebuBannerRegistry.category.shopsMarketplace,
  groceries: kareebuBannerRegistry.category.groceriesEssentials,
  food: kareebuBannerRegistry.category.foodDelivery,
  dineout: kareebuBannerRegistry.category.dineOutRestaurants,
  rides: kareebuBannerRegistry.category.rides,
  boda: kareebuBannerRegistry.category.boda,
  send: kareebuBannerRegistry.category.parcelDelivery,
  rentals: kareebuBannerRegistry.category.carRentals,
  services: kareebuBannerRegistry.category.homeServices,
  'home-care': kareebuBannerRegistry.category.homeServices,
  pharmacy: kareebuBannerRegistry.category.pharmacyHealth,
  fashion: kareebuBannerRegistry.category.fashion,
  beauty: kareebuBannerRegistry.category.beautyWellness,
  electronics: kareebuBannerRegistry.category.electronics,
  pets: kareebuBannerRegistry.category.pets,
  gifts: kareebuBannerRegistry.category.gifts,
  home: kareebuBannerRegistry.category.homeLiving,
  global: kareebuBannerRegistry.category.globalShopping,
  wallet: kareebuBannerRegistry.category.walletPay,
  goout: legacySubcategoryBannerRegistry.main.goOut,
  butchery: legacySubcategoryBannerRegistry.groceries.meatFish,
};

export const mainPromotionalBannerForCategory = (
  category: string,
): KareebuBannerAsset | undefined => mainCategoryBannerAliases[category];

export const promotionalContentRegistry: readonly KareebuBannerAsset[] = [
  ...kareebuCategoryBanners,
  ...kareebuPromoBanners,
  ...kareebuApprovedBanners,
  ...kareebuLegacyGapBanners,
];

export const kareebuCategoryBannerByCategoryId = Object.fromEntries(
  kareebuCategoryBanners.flatMap(item => item.destination.categoryId ? [[item.destination.categoryId, item]] : []),
) as Record<string, KareebuBannerAsset>;

export function promotionalAssetsFor({
  type,
  category,
  subcategory,
  placement,
}: {
  type?: PromotionalAssetType;
  category?: string;
  subcategory?: string;
  placement?: PromotionalPlacement;
}): KareebuBannerAsset[] {
  return promotionalContentRegistry
    .filter(asset => asset.active)
    .filter(asset => !type || asset.type === type)
    .filter(asset => !category || asset.category === category)
    .filter(asset => !subcategory || asset.subcategory === subcategory)
    .filter(asset => !placement || asset.placement.includes(placement))
    .sort((a, b) => b.priority - a.priority);
}

export const promotionalAssetForSource = (source: ImageSourcePropType): KareebuBannerAsset | undefined =>
  promotionalContentRegistry.find(asset => asset.source === source);

export const promotionalAssetExclusions = [
  { id: 'master-webp-runtime-copies', reason: 'All 28 WebPs are SHA-256-identical to the upload-ready pack.' },
  { id: 'master-png-finals', reason: 'WebP is supported by the current Expo 57 / React Native 0.86 stack; PNG runtime fallbacks are not required.' },
  { id: 'master-artwork-previews-contact-sheets', reason: 'Source-only artwork, previews and contact sheets are not runtime assets.' },
  { id: 'category-groceries-essentials-upload-ready', reason: 'Superseded for the groceries category placement by the approved 420x200 bespoke override.' },
  { id: 'legacy-main-verticals-except-goout', reason: 'Superseded by approved or upload-ready main-category creatives.' },
  { id: 'food.offers', reason: 'The copy implies a restaurant speciality that cannot truthfully describe an offer.' },
  { id: 'food.new_additions', reason: 'No current catalogue timestamp supports a new-addition claim.' },
  { id: 'food.cafes_coffee', reason: 'Superseded by the upload-ready Cafés & Coffee creative.' },
  { id: 'food.local_ugandan_food', reason: 'Superseded by the upload-ready Local Ugandan Food creative.' },
  { id: '07_go_out.sports_recreation', reason: 'Artwork depicts nutrition supplements rather than a sports or recreation destination.' },
  { id: '07_go_out.museums_culture', reason: 'Artwork depicts Ugandan food rather than museums or culture.' },
] as const;
