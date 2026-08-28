import type { BrandIconSemantic } from '../components';
import type { KareebuDomainId } from '../catalog/master/kareebuUnifiedCatalog';
import type {
  KareebuDiscoveryFilter,
  KareebuDiscoveryPromo,
} from './types';

export type KareebuDiscoveryDomainConfig = {
  title:string;
  locationEyebrow:string;
  searchPlaceholder:string;
  semantic:BrandIconSemantic;
  verticalHeading:string;
  categoryHeading:string;
  subcategoryHeading:string;
  recommendedHeading:string;
  allHeading:string;
  filters:KareebuDiscoveryFilter[];
  promos:KareebuDiscoveryPromo[];
  photos:string[];
};

const PHOTOS = {
  food:[
    'https://images.unsplash.com/photo-1567121938596-6d9d015d348b?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=88',
  ],
  dineout:[
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1500&q=88',
  ],
  groceries:[
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1500&q=88',
  ],
  shops:[
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1500&q=88',
  ],
  electronics:[
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1500&q=88',
  ],
  homeCare:[
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1500&q=88',
  ],
  fix:[
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1500&q=88',
    'https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&w=1500&q=88',
  ],
} as const;

function promo(id:string,eyebrow:string,title:string,body:string,cta:string,chip:string,photo:string):KareebuDiscoveryPromo{
  return {id,eyebrow,title,body,cta,chip,photo};
}

const RETAIL_FILTERS: KareebuDiscoveryFilter[] = [
  {id:'delivery-details',label:'Delivery details',icon:'truck'},
];

const SERVICE_FILTERS: KareebuDiscoveryFilter[] = [
  {id:'delivery-details',label:'Availability details',icon:'calendar'},
];

export const KAREEBU_DISCOVERY_DOMAIN_CONFIG: Record<KareebuDomainId,KareebuDiscoveryDomainConfig> = {
  food:{
    title:'Food',
    locationEyebrow:'Deliver to',
    searchPlaceholder:'Search restaurants, dishes and cuisines',
    semantic:'food',
    verticalHeading:'What are you craving?',
    categoryHeading:'Explore food',
    subcategoryHeading:'Browse by dish',
    recommendedHeading:'Restaurants to explore',
    allHeading:'Restaurants and dishes',
    filters:RETAIL_FILTERS,
    promos:[
      promo('food-offers','KAREEBU+ FOOD','Food around you','Explore restaurants, dishes and local food categories in your area.','Explore food','DISCOVER',PHOTOS.food[0]),
      promo('food-fast','MEAL GUIDE','Browse by craving','Move through cuisines, dishes and restaurant categories without assuming a delivery time.','Browse food','EXPLORE',PHOTOS.food[1]),
      promo('food-plus','KAREEBU+','Food discovery','Browse the food experience. Any member benefit is shown only from configured campaign data.','Explore Kareebu+','GUIDE',PHOTOS.food[2]),
    ],
    photos:[...PHOTOS.food],
  },
  dineout:{
    title:'DineOut',
    locationEyebrow:'Near',
    searchPlaceholder:'Search restaurants, cuisines and experiences',
    semantic:'dineout',
    verticalHeading:'Find your table',
    categoryHeading:'Browse dining',
    subcategoryHeading:'Choose the occasion',
    recommendedHeading:'Recommended restaurants',
    allHeading:'Places to dine',
    filters:SERVICE_FILTERS,
    promos:[
      promo('dine-save','KAREEBU DINEOUT','Plan a meal out','Discover restaurant styles, cuisines and dining experiences around you.','Find a table','DINEOUT',PHOTOS.dineout[0]),
      promo('dine-date','TONIGHT','Choose the occasion','Explore date-night, rooftop and premium dining categories around the city.','Explore tonight','DINING GUIDE',PHOTOS.dineout[1]),
      promo('dine-brunch','WEEKEND','Brunch, lunch and more','Explore weekend dining and group-friendly restaurant categories.','Browse brunch','WEEKEND GUIDE',PHOTOS.dineout[2]),
    ],
    photos:[...PHOTOS.dineout],
  },
  groceries:{
    title:'Groceries',
    locationEyebrow:'Deliver to',
    searchPlaceholder:'Search groceries and everyday essentials',
    semantic:'groceries',
    verticalHeading:'Shop groceries',
    categoryHeading:'Departments',
    subcategoryHeading:'Browse the aisle',
    recommendedHeading:'Grocery picks',
    allHeading:'Groceries for you',
    filters:RETAIL_FILTERS,
    promos:[
      promo('grocery-fresh','FRESH FOOD','Build the weekly basket','Fresh food, pantry and everyday household categories around you.','Start shopping','FRESH PICKS',PHOTOS.groceries[0]),
      promo('grocery-save','GROCERY GUIDE','Stock up by category','Move through pantry, household, personal care and family essentials.','Browse categories','GUIDE',PHOTOS.groceries[1]),
      promo('grocery-fast','QUICK BASKET','Forgot something?','Browse everyday essentials for a smaller top-up basket.','Shop essentials','TOP-UP',PHOTOS.groceries[2]),
    ],
    photos:[...PHOTOS.groceries],
  },
  shops:{
    title:'Shops',
    locationEyebrow:'Deliver to',
    searchPlaceholder:'Search shops, products and brands',
    semantic:'shops',
    verticalHeading:'Shop by vertical',
    categoryHeading:'Browse categories',
    subcategoryHeading:'Shop by subcategory',
    recommendedHeading:'Shops to explore',
    allHeading:'Products around you',
    filters:RETAIL_FILTERS,
    promos:[
      promo('shops-local','KAREEBU+ SHOPS','Everything around you','Pharmacies, beauty, gifts, fashion, home and specialist shops in one place.','Explore shops','LOCAL FAVOURITES',PHOTOS.shops[0]),
      promo('shops-offer','STORE GUIDE','Browse by seller','Discover named merchants and useful everyday product categories.','See stores','DISCOVER',PHOTOS.shops[1]),
      promo('shops-plus','SHOP BY VERTICAL','Find the right store faster','Enter Pharmacy, Pets, Gifts, Electronics, Beauty, Fashion or Home directly.','Browse verticals','VERTICALS',PHOTOS.shops[2]),
    ],
    photos:[...PHOTOS.shops],
  },
  electronics:{
    title:'Electronics',
    locationEyebrow:'Deliver to',
    searchPlaceholder:'Search phones, computing, audio and tech',
    semantic:'electronics',
    verticalHeading:'Explore electronics',
    categoryHeading:'Shop tech',
    subcategoryHeading:'Choose a category',
    recommendedHeading:'Tech picks',
    allHeading:'Electronics for you',
    filters:RETAIL_FILTERS,
    promos:[
      promo('tech-main','KAREEBU TECH','Explore everyday tech','Phones, laptops, charging, audio, gaming and smart-home categories.','Shop electronics','TECH',PHOTOS.electronics[0]),
      promo('tech-power','POWER & ACCESSORIES','Charging and accessories','Power banks, chargers, cables and everyday mobile accessories.','Shop accessories','ACCESSORIES',PHOTOS.electronics[1]),
      promo('tech-home','SMARTER HOME','Upgrade your setup','TV, networking, security and connected-home essentials.','Explore home tech','SMART HOME',PHOTOS.electronics[2]),
    ],
    photos:[...PHOTOS.electronics],
  },
  'home-care':{
    title:'Home & Care',
    locationEyebrow:'Available in',
    searchPlaceholder:'Search cleaning, laundry, salon and home services',
    semantic:'homeCare',
    verticalHeading:'What can we help with?',
    categoryHeading:'Choose a service',
    subcategoryHeading:'Select what you need',
    recommendedHeading:'Services to explore',
    allHeading:'Available services',
    filters:SERVICE_FILTERS,
    promos:[
      promo('care-home','KAREEBU HOME & CARE','Help at home','Explore cleaning, laundry, salon, pest control, moving and care categories.','Browse services','AT-HOME SERVICES',PHOTOS.homeCare[0]),
      promo('care-clean','HOME RESET','Cleaning options','Explore regular, deep and furniture-cleaning categories around you.','Browse cleaning','CLEANING',PHOTOS.homeCare[1]),
      promo('care-wellness','CARE AT HOME','Wellness comes to you','Selected at-home wellness and diagnostic services.','Explore care','HOME VISITS',PHOTOS.homeCare[2]),
    ],
    photos:[...PHOTOS.homeCare],
  },
  fix:{
    title:'Fix',
    locationEyebrow:'Available in',
    searchPlaceholder:'Search plumbing, electrical, AC and repairs',
    semantic:'fix',
    verticalHeading:'What needs fixing?',
    categoryHeading:'Choose a repair',
    subcategoryHeading:'Tell us the problem',
    recommendedHeading:'Repair categories',
    allHeading:'Repair services',
    filters:SERVICE_FILTERS,
    promos:[
      promo('fix-main','KAREEBU FIX','Choose what needs fixing','Browse plumbing, electrical, AC, appliance and repair categories.','Explore repairs','REPAIRS',PHOTOS.fix[0]),
      promo('fix-today','PROVIDER DISCOVERY','Find the right repair category','Provider availability is checked in the service flow rather than assumed by this card.','Browse providers','CHECK AVAILABILITY',PHOTOS.fix[1]),
      promo('fix-smart','HOME TECH','Smart home and tech repair','CCTV, Wi-Fi, phones, computers and connected-home support.','Explore tech repair','TECH HELP',PHOTOS.fix[2]),
    ],
    photos:[...PHOTOS.fix],
  },
};
