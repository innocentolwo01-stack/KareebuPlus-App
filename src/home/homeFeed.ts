import type { ImageSourcePropType } from 'react-native';
import type { Screen } from '../types';
import type { VehicleMode } from '../ride/vehicle';
import type { PromotionCampaign } from '../promotions/types';
import { promotionalBannerAssets } from '../promotions/promotionalBannerAssets';
import type {
  AppEngineItem,
  AppEnginePageDefinition,
  AppEnginePromotion,
  AppEngineSectionDefinition,
  AppEngineSectionType,
} from '../appEngine/types';

export type HomeModuleType = 'merchant-rail'|'category-grid'|'discovery-rail'|'promo'|'mobility-campaign'|'service-grid'|'dineout'|'membership'|'rewards'|'global'|'retention';
export type HomeAudience = 'all'|'member'|'returning';
export type HomeFeedItem = {id:string;title:string;subtitle?:string;meta?:string;badge?:string;image?:ImageSourcePropType;visualKey?:string;merchantName?:string;merchantId?:string;restaurantId?:string;brand?:string;price?:string;source?:string;mobilityMode?:VehicleMode;screen:Screen};
export type HomeFeedModule = {id:string;type:HomeModuleType;title?:string;subtitle?:string;service?:string;slot?:string;priority:number;country?:string;city?:string;enabled:boolean;items?:HomeFeedItem[];promo?:PromotionCampaign;promos?:PromotionCampaign[];cta?:{label:string;screen:Screen};audience?:HomeAudience;membershipRequired?:boolean};

const art={
  grocery:require('../../assets/kareebu-plus/realistic-v9/groceries.jpg'),
  pharmacy:require('../../assets/kareebu-plus/realistic-v9/pharmacy.jpg'),
  electronics:require('../../assets/kareebu-plus/realistic-v9/electronics.jpg'),
  fashion:require('../../assets/kareebu-plus/realistic-v9/fashion.jpg'),
  beauty:require('../../assets/kareebu-plus/realistic-v9/beauty.jpg'),
  flowers:require('../../assets/kareebu-plus/top-offers/category-flowers.jpg'),
  pets:require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
  food:require('../../assets/kareebu-plus/realistic-v9/restaurants.jpg'),
  dineout:require('../../assets/kareebu-plus/dineout/dineout-hero.jpg'),
  send:require('../../assets/kareebu-plus/realistic-v9/send-parcel.jpg'),
  care:require('../../assets/kareebu-plus/realistic-v9/home.jpg'),
  plus:require('../../assets/kareebu-plus/kareebu-plus-mark.png'),
  global:require('../../assets/kareebu-plus/realistic-v9/fashion.jpg'),
};
const promo=(id:string,slot:string,headline:string,body:string,image:ImageSourcePropType,ctaLabel:string,ctaScreen:Screen,treatment:'yellow'|'cream'|'charcoal'|'photo'='yellow'):PromotionCampaign=>({id,slot:'contextual',service:'home',campaign:slot,headline,body,image,imageOnly:true,backgroundTreatment:treatment,ctaLabel,ctaScreen,priority:70,enabled:true});

export const HOME_FEED_MODULES:HomeFeedModule[]=[
 {id:'home-top-featured',type:'promo',title:'Featured on Kareebu',subtitle:'Move, shop, eat and discover more around your city',priority:1000,enabled:true,promos:[
  promo('home-featured-super-app','HOME_FEATURED_SUPER_APP','Move, shop, send and pay','Everything you need around your city.',promotionalBannerAssets.home.superApp,'Explore Kareebu','exploreHub','photo'),
  promo('home-featured-food','HOME_FEATURED_FOOD','Explore food with Kareebu','Browse restaurants and meals around your city.',promotionalBannerAssets.food.primary,'Explore Food','food','photo'),
  promo('home-featured-shopping','HOME_FEATURED_SHOPPING','Shop more, live easier','Browse trusted stores and everyday essentials.',promotionalBannerAssets.marketplace.secondary,'Browse Shops','shops','photo'),
 ],},
 {id:'top-stores-uganda',type:'merchant-rail',title:'Stores to browse',subtitle:'Named stores · availability is confirmed in app',service:'shops',priority:300,country:'Uganda',enabled:true,cta:{label:'See all',screen:'allStores'},items:[
  {id:'carrefour',title:'Carrefour Uganda',merchantName:'Carrefour Uganda',merchantId:'carrefour',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'capital',title:'Capital Shoppers',merchantName:'Capital Shoppers',merchantId:'capital',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'goodlife',title:'Goodlife Pharmacy',merchantName:'Goodlife Pharmacy',merchantId:'goodlife',subtitle:'Pharmacy & wellness',meta:'Open storefront',screen:'shop'},
  {id:'gentlemans-pharmacy',title:"Gentleman's Pharmacy",merchantName:"Gentleman's Pharmacy",merchantId:'gentlemans-pharmacy',subtitle:'Pharmacy & wellness',meta:'Open storefront',screen:'shop'},
 ]},
 {id:'top-stores-kenya',type:'merchant-rail',title:'Stores to browse',subtitle:'Named stores · availability is confirmed in app',service:'shops',priority:300,country:'Kenya',enabled:true,cta:{label:'See all',screen:'allStores'},items:[
  {id:'naivas',title:'Naivas',merchantName:'Naivas',merchantId:'naivas',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'quickmart',title:'Quickmart',merchantName:'Quickmart',merchantId:'quickmart',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'goodlife-ke',title:'Goodlife Pharmacy',merchantName:'Goodlife Pharmacy',merchantId:'goodlife',subtitle:'Pharmacy & wellness',meta:'Open storefront',screen:'shop'},
 ]},
 {id:'top-stores-tanzania',type:'merchant-rail',title:'Stores to browse',subtitle:'Named stores · availability is confirmed in app',service:'shops',priority:300,country:'Tanzania',enabled:true,cta:{label:'See all',screen:'allStores'},items:[
  {id:'shoppers-tz',title:'Shoppers Supermarket',merchantName:'Shoppers Supermarket',merchantId:'shoppers-tz',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'village-tz',title:'Village Supermarket',merchantName:'Village Supermarket',merchantId:'village-tz',subtitle:'Groceries',meta:'Open storefront',screen:'shop'},
  {id:'breeze-tz',title:'Breeze Pharmacy',merchantName:'Breeze Pharmacy',merchantId:'breeze-tz',subtitle:'Pharmacy & wellness',meta:'Open storefront',screen:'shop'},
 ]},
 {id:'shop-categories',type:'category-grid',title:'Shop by category',subtitle:'Browse food, stores and everyday essentials',priority:320,enabled:true,cta:{label:'Browse all',screen:'exploreHub'},items:[
  ['restaurants','Restaurants','commerce.restaurants','food'],['groceries','Groceries','commerce.groceries','groceries'],['pharmacy','Pharmacy','commerce.pharmacy','pharmacyHome'],['electronics','Electronics','commerce.electronics','electronicsHome'],['fashion','Fashion','commerce.fashion','fashionHome'],['beauty','Beauty','commerce.beauty','beautyHome'],['home','Home','commerce.home','homeShoppingHome'],['pets','Pet supplies','commerce.pets','petStoresHome'],['gifts','Flowers & gifts','gifts.flowers','giftsFlowersHome'],['baby','Baby','pharmacy.baby-care','pharmacyHome'],['sports','Sports','general.sports','shops'],['automotive','Automotive','general.automotive','shops'],['books','Books & stationery','general.books','shops'],['wellness','Health & wellness','pharmacy.vitamins','pharmacyHome'],['phones','Phones','electronics.phones','electronicsHome'],['household','Household essentials','groceries.household','groceries'],
 ].map(([id,title,visualKey,screen])=>({id,title,visualKey,screen:screen as Screen}))},
 {id:'home-mobility-campaign',type:'mobility-campaign',priority:315,enabled:true,items:[
  {id:'home-ride-campaign',title:'Your city, one ride away.',subtitle:'Book a ride',image:require('../../assets/kareebu-plus/lifestyle-cutouts/service-rides.png'),mobilityMode:'RIDE',screen:'mobilityHome'},
  {id:'home-boda-campaign',title:'Move through the city.',subtitle:'Book a Boda',image:require('../../assets/kareebu-plus/lifestyle-cutouts/service-boda.png'),mobilityMode:'BODA',screen:'mobilityHome'},
 ]},
 {id:'after-stores-promo',type:'promo',slot:'HOME_AFTER_STORES',priority:280,enabled:true,promo:promo('home-after-stores','HOME_AFTER_STORES','Fresh finds from local shops','Explore shops and sellers around your city.',promotionalBannerAssets.marketplace.primary,'Browse Shops','shops','photo')},
 {id:'popular',type:'discovery-rail',title:'Explore Kareebu+',subtitle:'More useful ways to browse around your city',priority:270,enabled:true,items:[
  {id:'popular-food',title:'Local food',subtitle:'Food',meta:'Browse configured kitchens',image:art.food,screen:'food'},
  {id:'popular-fresh',title:'Fresh weekly shop',subtitle:'Groceries',meta:'Produce and essentials',image:art.grocery,screen:'groceries'},
  {id:'popular-wellness',title:'Wellness essentials',subtitle:'Pharmacy',meta:'Everyday care products',image:art.pharmacy,screen:'pharmacyHome'},
  {id:'popular-clean',title:'Home cleaning',subtitle:'Home & Care',meta:'Build a service-specific request',image:art.care,screen:'serviceMarketplace'},
  {id:'popular-dine',title:'Dinner in the city',subtitle:'DineOut',meta:'Plan first; restaurant confirms',image:art.dineout,screen:'dineOut'},
 ]},
 {id:'food-nearby-uganda',type:'merchant-rail',title:'Restaurants to explore',subtitle:'Configured restaurants · current availability is confirmed in app',service:'food',priority:258,country:'Uganda',enabled:true,cta:{label:'See all Food',screen:'food'},items:[
  {id:'cafe-javas-home',title:'Café Javas',merchantName:'Café Javas',restaurantId:'cafe-javas',subtitle:'Café · local favourites',meta:'Open restaurant',image:require('../../assets/kareebu-plus/dineout/restaurant-city-cafe.jpg'),screen:'restaurant'},
 ]},
 {id:'food-nearby-kenya',type:'merchant-rail',title:'Restaurants to explore',subtitle:'Configured restaurants · current availability is confirmed in app',service:'food',priority:258,country:'Kenya',enabled:true,cta:{label:'See all Food',screen:'food'},items:[
  {id:'java-house-home',title:'Java House Kenya',merchantName:'Java House Kenya',restaurantId:'java-house',subtitle:'Coffee · breakfast · café',meta:'Open restaurant',image:require('../../assets/kareebu-plus/dineout/restaurant-city-cafe.jpg'),screen:'restaurant'},
 ]},
 {id:'food-promo',type:'promo',slot:'HOME_FOOD_CAMPAIGN',priority:265,enabled:true,promo:promo('home-food-campaign','HOME_FOOD_CAMPAIGN','Explore food with Kareebu','Browse restaurants and meals around your city.',promotionalBannerAssets.food.secondary,'Explore Food','food','photo')},
 {id:'grocery-essentials',type:'discovery-rail',title:'Groceries & essentials',subtitle:'Everyday items for your weekly shop',service:'groceries',priority:235,enabled:true,cta:{label:'Shop groceries',screen:'groceries'},items:[
  {id:'fresh',title:'Fresh produce',subtitle:'Fruit & vegetables',image:require('../../assets/kareebu-plus/top-picks/tomatoes.png'),screen:'groceries'},
  {id:'staples',title:'Cooking essentials',subtitle:'Rice, flour, oil & staples',image:art.grocery,screen:'groceries'},
  {id:'breakfast',title:'Breakfast',subtitle:'Tea, coffee, bread & cereal',visualKey:'groceries.bakery',screen:'groceries'},
  {id:'household',title:'Household',subtitle:'Cleaning and home care',visualKey:'groceries.household',screen:'groceries'},
  {id:'baby',title:'Baby care',subtitle:'Everyday baby essentials',visualKey:'groceries.baby',screen:'groceries'},
 ]},
 {id:'grocery-categories',type:'category-grid',title:'Fill your basket',subtitle:'Shop grocery aisles',priority:240,enabled:true,items:[['fresh','Fresh','groceries.fresh'],['breakfast','Breakfast','groceries.bakery'],['drinks','Drinks','groceries.drinks'],['snacks','Snacks','groceries.snacks'],['household','Household','groceries.household'],['baby','Baby','groceries.baby'],['personal','Personal care','pharmacy.personal-care'],['cooking','Cooking','groceries.staples']].map(([id,title,visualKey])=>({id,title,visualKey,screen:'groceries'}))},
 {id:'grocery-promo',type:'promo',slot:'HOME_GROCERY_CAMPAIGN',priority:245,enabled:true,promo:promo('home-grocery-campaign','HOME_GROCERY_CAMPAIGN','Freshness delivered','Browse fresh produce and everyday essentials.',promotionalBannerAssets.home.groceriesEssentials,'Start your shop','groceries','photo')},
 {id:'pharmacy-promo',type:'promo',title:'Pharmacy & wellness',subtitle:'Everyday medicines, care and wellbeing in one place',service:'pharmacy',slot:'HOME_PHARMACY_HERO',priority:225,enabled:true,promo:promo('home-pharmacy-hero','HOME_PHARMACY_HERO','Wellness, when you need it','Medicines, health essentials and trusted pharmacies — all in one place.',promotionalBannerAssets.pharmacy.wellnessApproved,'Shop medicines & wellness','pharmacyHome','photo')},
 {id:'pharmacy',type:'category-grid',title:'Shop medicines & health by need',subtitle:'Start with a familiar health and care department',service:'pharmacy',priority:220,enabled:true,cta:{label:'Shop health & wellness',screen:'pharmacyHome'},items:[['medicines','Medicines & Health','pharmacy.medicines'],['pain','Pain Relief','pharmacy.pain-relief'],['cold','Cold, Flu & Cough','pharmacy.cold-flu-cough'],['allergy','Allergy & Hayfever','pharmacy.allergy'],['vitamins','Vitamins & Supplements','pharmacy.vitamins'],['personal','Personal Care','pharmacy.personal-care'],['baby','Baby & Child','pharmacy.baby-care'],['first-aid','First Aid','pharmacy.first-aid']].map(([id,title,visualKey])=>({id,title,visualKey,screen:'pharmacyHome'}))},
 {id:'pharmacy-products',type:'discovery-rail',title:'Health essentials',subtitle:'Relevant pharmacy and wellness products to explore',service:'pharmacy',priority:218,enabled:true,cta:{label:'See all',screen:'pharmacyHome'},items:[
  {id:'pharmacy-pain',title:'Pain relief essentials',subtitle:'Pharmacy',image:require('../../assets/kareebu-plus/realistic-v9/pain-relief.jpg'),screen:'pharmacyHome'},
  {id:'pharmacy-cold',title:'Cold and flu care',subtitle:'Pharmacy',image:require('../../assets/kareebu-plus/realistic-v9/cold-flu.jpg'),screen:'pharmacyHome'},
  {id:'pharmacy-vitamins',title:'Vitamins and supplements',subtitle:'Wellness',image:require('../../assets/kareebu-plus/realistic-v9/vitamins-supplements.jpg'),screen:'pharmacyHome'},
  {id:'pharmacy-family',title:'Personal and family care',subtitle:'Wellness',image:require('../../assets/kareebu-plus/realistic-v9/baby-child.jpg'),screen:'pharmacyHome'},
 ]},
 {id:'pharmacy-skus',type:'discovery-rail',title:'Individual products',subtitle:'Browse familiar pharmacy and wellness items',service:'pharmacy',priority:217,enabled:true,cta:{label:'Shop all',screen:'pharmacyHome'},items:[
  {id:'panadol-advance',title:'Panadol Advance',brand:'Panadol',subtitle:'500 mg tablets · pack size varies',source:'Pharmacy catalogue',image:require('../../assets/kareebu-plus/realistic-v9/pain-relief.jpg'),screen:'pharmacyHome'},
  {id:'vicks-vaporub',title:'Vicks VapoRub',brand:'Vicks',subtitle:'Cold and flu care',source:'Pharmacy catalogue',image:require('../../assets/kareebu-plus/realistic-v9/cold-flu.jpg'),screen:'pharmacyHome'},
  {id:'vitamin-d3',title:'Vitamin D3 supplements',brand:'Wellness',subtitle:'Everyday supplement range',source:'Pharmacy catalogue',image:require('../../assets/kareebu-plus/realistic-v9/vitamins-supplements.jpg'),screen:'pharmacyHome'},
  {id:'baby-care-range',title:'Baby care essentials',brand:'Family care',subtitle:'Gentle care range',source:'Pharmacy catalogue',image:require('../../assets/kareebu-plus/realistic-v9/baby-child.jpg'),screen:'pharmacyHome'},
 ]},
 {id:'nearby-pharmacies-uganda',type:'merchant-rail',title:'Pharmacies to shop',subtitle:'Named pharmacies · stock and delivery details appear only when supplied',service:'pharmacy',priority:215,country:'Uganda',enabled:true,cta:{label:'See pharmacies',screen:'pharmacyHome'},items:[
  {id:'goodlife-pharmacy',title:'Goodlife Pharmacy',merchantName:'Goodlife Pharmacy',merchantId:'goodlife',subtitle:'Pharmacy & wellness',meta:'Open pharmacy storefront',screen:'shop'},
  {id:'gentlemans-pharmacy-home',title:"Gentleman's Pharmacy",merchantName:"Gentleman's Pharmacy",merchantId:'gentlemans-pharmacy',subtitle:'Pharmacy & wellness',meta:'Open pharmacy storefront',screen:'shop'},
 ]},
 {id:'nearby-pharmacies-kenya',type:'merchant-rail',title:'Pharmacies to shop',subtitle:'Named pharmacies · stock and delivery details appear only when supplied',service:'pharmacy',priority:215,country:'Kenya',enabled:true,cta:{label:'See pharmacies',screen:'pharmacyHome'},items:[
  {id:'goodlife-pharmacy-ke',title:'Goodlife Pharmacy',merchantName:'Goodlife Pharmacy',merchantId:'goodlife',subtitle:'Pharmacy & wellness',meta:'Open pharmacy storefront',screen:'shop'},
 ]},
 {id:'nearby-pharmacies-tanzania',type:'merchant-rail',title:'Pharmacies to shop',subtitle:'Named pharmacies · stock and delivery details appear only when supplied',service:'pharmacy',priority:215,country:'Tanzania',enabled:true,cta:{label:'See pharmacies',screen:'pharmacyHome'},items:[
  {id:'breeze-pharmacy-tz',title:'Breeze Pharmacy',merchantName:'Breeze Pharmacy',merchantId:'breeze-tz',subtitle:'Pharmacy & wellness',meta:'Open pharmacy storefront',screen:'shop'},
 ]},
 {id:'fashion-promo',type:'promo',title:'Fashion & beauty',subtitle:'Style, beauty and everyday self-expression',slot:'HOME_FASHION_CAMPAIGN',priority:205,enabled:true,promo:promo('home-fashion-campaign','HOME_FASHION_CAMPAIGN','Fashion & beauty','Browse fashion, beauty and personal-care products.',promotionalBannerAssets.home.fashionBeauty,'Browse fashion & beauty','fashionHome','photo')},
 {id:'fashion-beauty',type:'category-grid',title:'Fashion & beauty',subtitle:'Browse style, beauty and personal care',priority:200,enabled:true,cta:{label:'Browse fashion & beauty',screen:'fashionHome'},items:[['women','Women','fashion.women','fashionHome'],['men','Men','fashion.men','fashionHome'],['kids','Kids','fashion.children','fashionHome'],['shoes','Shoes','fashion.shoes','fashionHome'],['beauty','Beauty','beauty.skincare','beautyHome'],['hair','Hair','beauty.hair','beautyHome'],['fragrance','Fragrance','beauty.fragrance','beautyHome'],['accessories','Accessories','fashion.accessories','fashionHome']].map(([id,title,visualKey,screen])=>({id,title,visualKey,screen:screen as Screen}))},
 {id:'electronics-promo',type:'promo',title:'Electronics & gadgets',subtitle:'Phones, computing, audio and home tech',slot:'HOME_ELECTRONICS_CAMPAIGN',priority:195,enabled:true,promo:promo('home-electronics-campaign','HOME_ELECTRONICS_CAMPAIGN','Electronics & gadgets','Discover useful tech for everyday life.',promotionalBannerAssets.home.electronicsGadgets,'Discover electronics','electronicsHome','photo')},
 {id:'electronics',type:'category-grid',title:'Electronics & gadgets',subtitle:'Phones, computing, audio, gaming and home tech',priority:190,enabled:true,cta:{label:'Discover electronics',screen:'electronicsHome'},items:[['phones','Phones','electronics.phones'],['accessories','Accessories','electronics.accessories'],['audio','Audio','electronics.audio'],['computers','Computers','electronics.computing'],['gaming','Gaming','electronics.gaming'],['tv','TV','electronics.tvs'],['appliances','Appliances','electronics.appliances'],['power','Charging & power','electronics.power']].map(([id,title,visualKey])=>({id,title,visualKey,screen:'electronicsHome'}))},
 {id:'retail-promo',type:'promo',slot:'HOME_RETAIL_CAMPAIGN',priority:180,enabled:true,promo:promo('home-retail-campaign','HOME_RETAIL_CAMPAIGN','A golden shopping experience','Explore fashion, beauty, electronics and home essentials.',promotionalBannerAssets.marketplace.secondary,'Browse Shops','shops','photo')},
 {id:'local-favourites',type:'discovery-rail',title:'Explore in {{city}}',subtitle:'Local picks for your city',priority:170,enabled:true,items:[
  {id:'local-food',title:'Local food favourites',subtitle:'Restaurants',image:art.food,screen:'food'},
  {id:'local-boda',title:'Move through the city',subtitle:'Boda',image:require('../../assets/kareebu-plus/lifestyle-cutouts/service-boda.png'),screen:'mobilityHome'},
  {id:'local-grocery',title:'Fresh essentials',subtitle:'Groceries',image:art.grocery,screen:'groceries'},
  {id:'local-care',title:'Help at home',subtitle:'Home & Care',image:art.care,screen:'serviceMarketplace'},
 ]},
 {id:'dineout',type:'dineout',title:'DineOut tonight',subtitle:'Plan an evening out in {{city}}',priority:160,enabled:true,cta:{label:'Find a table',screen:'dineOut'},items:[
  {id:'dine-city',title:'City dining',subtitle:'Contemporary · city centre',meta:'Restaurant confirms tables',image:require('../../assets/kareebu-plus/dineout/restaurant-kampala-bistro.jpg'),screen:'dineOut'},
  {id:'dine-lake',title:'Lakeside dining',subtitle:'Grill · relaxed',meta:'Plan your visit · availability confirmed separately',image:require('../../assets/kareebu-plus/dineout/restaurant-lakeside-grill.jpg'),screen:'dineOut'},
 ]},
 {id:'dineout-promo',type:'promo',slot:'HOME_DINEOUT_CAMPAIGN',priority:150,enabled:true,promo:promo('home-dineout-campaign','HOME_DINEOUT_CAMPAIGN','Kampala’s iconic spots','Discover restaurants and dining experiences worth going out for.',promotionalBannerAssets.home.dineOutIconicKampala,'Explore DineOut','dineOut','photo')},
 {id:'send-promo',type:'promo',title:'Send something',subtitle:'Across town for everyday and business needs',service:'send',slot:'HOME_SEND_HERO',priority:145,enabled:true,promo:promo('home-send-hero','HOME_SEND_HERO','Send it across town','Parcels, documents, gifts and business deliveries when you need them.',promotionalBannerAssets.send.page,'Start a delivery','parcel','photo')},
 {id:'send',type:'service-grid',title:'Send something',subtitle:'Across town for everyday and business needs',priority:140,enabled:true,cta:{label:'Start a delivery',screen:'parcel'},items:[['parcel','Send a parcel','send.parcel'],['documents','Send documents','send.documents'],['gift','Deliver a gift','send.gift'],['business','Business delivery','send.business']].map(([id,title,visualKey])=>({id,title,visualKey,screen:'parcel'}))},
 {id:'home-care-promo',type:'promo',title:'Home & Care',subtitle:'Trusted help for every home',service:'services',slot:'HOME_CARE_HERO',priority:135,enabled:true,promo:promo('home-care-hero','HOME_CARE_HERO','Trusted help for every home','Cleaning, repairs, moving and care services from one useful place.',promotionalBannerAssets.homeCare.secondary,'See all services','serviceMarketplace','photo')},
 {id:'home-care',type:'service-grid',title:'Home & Care',subtitle:'Tell us what you need help with',priority:130,enabled:true,cta:{label:'See all services',screen:'serviceMarketplace'},items:[['clean','Cleaning','home.cleaning'],['plumbing','Plumbing','services.plumbing'],['electrical','Electrical','services.electrical'],['ac','AC service','services.ac'],['moving','Moving','services.moving'],['beauty','Beauty at home','services.beauty-home']].map(([id,title,visualKey])=>({id,title,visualKey,screen:'serviceMarketplace'}))},
 {id:'plus',type:'membership',title:'More value with Kareebu+',subtitle:'Benefits are shown only where eligible',priority:120,enabled:true,cta:{label:'Explore benefits',screen:'plusManage'}},
 {id:'rewards',type:'rewards',title:'Earn & save',subtitle:'Your Kareebu Rewards',priority:110,enabled:true,cta:{label:'View rewards',screen:'rewards'}},
 {id:'global',type:'global',title:'The world is now on Kareebu',subtitle:'Shop international sources with a landed estimate in your local currency',slot:'HOME_GLOBAL_CAMPAIGN',priority:100,enabled:true,cta:{label:'Explore Global',screen:'globalHome'}},
 {id:'retention',type:'retention',title:'Buy again',subtitle:'Based on your completed Kareebu+ activity',priority:90,enabled:true,audience:'returning',cta:{label:'View Activity',screen:'activity'}},
];

export function homeFeedFor(input:{country:string;city:string;member?:boolean;returning?:boolean}){
 return HOME_FEED_MODULES
  .filter(module =>
    module.enabled &&
    (!module.country || module.country === input.country) &&
    (!module.city || module.city === input.city) &&
    (!module.membershipRequired || input.member) &&
    (module.audience !== 'returning' || input.returning),
  )
  .sort((a, b) => b.priority - a.priority)
  .map(module => ({
    ...module,
    title: module.title?.replace('{{city}}', input.city),
    subtitle: module.subtitle?.replace('{{city}}', input.city),
  }));
}

const appEngineType: Record<HomeModuleType, AppEngineSectionType> = {
  'merchant-rail': 'merchant-carousel',
  'category-grid': 'category-grid',
  'discovery-rail': 'recommendation-rail',
  promo: 'banner-carousel',
  'mobility-campaign': 'rich-cards',
  'service-grid': 'service-tile-grid',
  dineout: 'merchant-carousel',
  membership: 'kareebu-plus-banner',
  rewards: 'rewards-banner',
  global: 'rich-cards',
  retention: 'reorder-carousel',
};

function toAppEngineItem(item: HomeFeedItem): AppEngineItem {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    meta: item.meta,
    badge: item.badge,
    image: item.image,
    visualKey: item.visualKey,
    route: { screen: item.screen },
  };
}

function toAppEnginePromotion(module: HomeFeedModule): AppEnginePromotion | undefined {
  const campaign = module.promo;
  if (!campaign) return undefined;

  return {
    id: campaign.id,
    slot: module.slot ?? campaign.slot,
    campaign: campaign.campaign,
    headline: campaign.headline,
    body: campaign.body,
    badge: campaign.badge,
    creative: {
      image: campaign.image,
      alt: campaign.headline,
      aspectRatio: 2.2,
      recommendedPixels: { width: 1080, height: 490 },
      backgroundTreatment: campaign.backgroundTreatment,
    },
    cta: {
      id: `${campaign.id}-cta`,
      label: campaign.ctaLabel,
      route: { screen: campaign.ctaScreen },
    },
    priority: campaign.priority,
    enabled: campaign.enabled,
  };
}

function toAppEngineSection(module: HomeFeedModule): AppEngineSectionDefinition {
  const isTileSection = module.type === 'category-grid' || module.type === 'service-grid';

  return {
    id: module.id,
    type: appEngineType[module.type],
    title: module.title,
    subtitle: module.subtitle,
    service: module.service,
    slot: module.slot,
    layout: isTileSection ? 'carousel' : module.type === 'promo' ? 'full-width' : 'carousel',
    items: module.items?.map(toAppEngineItem),
    cta: module.cta
      ? {
          id: `${module.id}-cta`,
          label: module.cta.label,
          route: { screen: module.cta.screen },
        }
      : undefined,
    promo: toAppEnginePromotion(module),
    targeting: {
      countries: module.country ? [module.country] : undefined,
      cities: module.city ? [module.city] : undefined,
      audiences: module.audience
        ? [module.audience === 'returning' ? 'returning' : 'all']
        : undefined,
      membershipRequired: module.membershipRequired,
    },
    enabled: module.enabled,
    priority: module.priority,
    rendererKey: module.type,
    analytics: {
      impressionEvent: 'home_section_impression',
      interactionEvent: 'home_section_interaction',
      metadata: { moduleId: module.id },
    },
    data: { homeModule: module },
  };
}

export function homePageFor(input: {
  country: string;
  city: string;
  member?: boolean;
  returning?: boolean;
}): AppEnginePageDefinition {
  const sections = homeFeedFor(input).map(toAppEngineSection);

  return {
    id: 'kareebu-home',
    type: 'home',
    title: 'Home',
    version: '4.0.0',
    header: {
      type: 'brand',
      showLocation: true,
      showSearch: true,
      search: {
        enabled: true,
        scope: 'global',
        placeholder: 'Search Kareebu',
        market: input.country,
        city: input.city,
        suggestionsEnabled: true,
        recentSearchesEnabled: true,
      },
      showNotifications: true,
      showAccount: true,
    },
    navigation: {
      showBottomNavigation: true,
      activeTab: 'home',
      backBehaviour: 'none',
    },
    sections,
    footer: {
      type: 'links',
      message: `Everything you need, around ${input.city}.`,
    },
    targeting: { countries: ['Uganda', 'Kenya', 'Tanzania'] },
    experiment: { id: 'home-blueprint', variant: 'careem-parity-v1' },
    analytics: {
      impressionEvent: 'home_page_view',
      interactionEvent: 'home_interaction',
    },
    metadata: { source: 'local-fallback-blueprint', cmsReady: true },
    plugins: [
      { id: 'home-search', type: 'search', enabled: true },
      { id: 'home-location', type: 'location', enabled: true },
      { id: 'home-analytics', type: 'analytics', enabled: true },
    ],
  };
}
