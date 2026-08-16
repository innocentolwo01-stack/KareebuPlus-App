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
  {id:'offers',label:'Offers',icon:'tag'},
  {id:'fast',label:'Under 30 min',icon:'clock'},
  {id:'free-delivery',label:'Free delivery',icon:'truck'},
  {id:'rating',label:'4.5+ rated',icon:'star'},
  {id:'price',label:'Best price',icon:'dollar-sign'},
];

const SERVICE_FILTERS: KareebuDiscoveryFilter[] = [
  {id:'today',label:'Available today',icon:'calendar'},
  {id:'rating',label:'4.5+ rated',icon:'star'},
  {id:'nearby',label:'Nearby',icon:'map-pin'},
  {id:'verified',label:'Verified',icon:'check-circle'},
  {id:'price',label:'Best price',icon:'dollar-sign'},
];

export const KAREEBU_DISCOVERY_DOMAIN_CONFIG: Record<KareebuDomainId,KareebuDiscoveryDomainConfig> = {
  food:{
    title:'Food',
    locationEyebrow:'Deliver to',
    searchPlaceholder:'Search restaurants, dishes and cuisines',
    semantic:'food',
    verticalHeading:'What are you craving?',
    categoryHeading:'Explore food',
    subcategoryHeading:'Popular right now',
    recommendedHeading:'Recommended for you',
    allHeading:'Restaurants and dishes',
    filters:[
      {id:'offers',label:'Offers',icon:'tag'},
      {id:'fast',label:'Fast delivery',icon:'clock'},
      {id:'free-delivery',label:'Free delivery',icon:'truck'},
      {id:'rating',label:'4.5+ rated',icon:'star'},
      {id:'member',label:'Kareebu+',icon:'award'},
    ],
    promos:[
      promo('food-offers','KAREEBU+ FOOD','Great food around you','Popular restaurants, dishes and local favourites selected for your area.','Order now','UP TO 30% OFF',PHOTOS.food[0]),
      promo('food-fast','FAST DELIVERY','Dinner without the wait','Find highly rated restaurants delivering quickly nearby.','Find fast food','UNDER 30 MIN',PHOTOS.food[1]),
      promo('food-plus','KAREEBU+','Member delivery favourites','Selected free-delivery restaurants and member savings.','See member picks','MEMBER PICKS',PHOTOS.food[2]),
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
    filters:[
      {id:'available-now',label:'Available now',icon:'calendar'},
      {id:'offers',label:'Offers',icon:'tag'},
      {id:'rating',label:'4.5+ rated',icon:'star'},
      {id:'nearby',label:'Nearby',icon:'map-pin'},
      {id:'price',label:'Price',icon:'dollar-sign'},
    ],
    promos:[
      promo('dine-save','KAREEBU DINEOUT','Save when you dine out','Discover restaurant offers, experiences and member savings around you.','Find a table','DINEOUT OFFERS',PHOTOS.dineout[0]),
      promo('dine-date','TONIGHT','Make tonight special','Date-night, rooftop and premium dining picks around the city.','Explore tonight','CURATED PICKS',PHOTOS.dineout[1]),
      promo('dine-brunch','WEEKEND','Brunch, lunch and more','Find popular weekend dining experiences and group-friendly restaurants.','Browse brunch','WEEKEND PICKS',PHOTOS.dineout[2]),
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
    recommendedHeading:'Popular grocery picks',
    allHeading:'Groceries for you',
    filters:RETAIL_FILTERS,
    promos:[
      promo('grocery-fresh','FRESH TODAY','Groceries in minutes','Fresh food, pantry and everyday household essentials around you.','Start shopping','FRESH PICKS',PHOTOS.groceries[0]),
      promo('grocery-save','KAREEBU+','Stock up for less','Find grocery offers and member delivery savings.','See offers','SAVE MORE',PHOTOS.groceries[1]),
      promo('grocery-fast','QUICK BASKET','Forgot something?','Quick everyday essentials for the last-minute basket.','Shop quick','FAST DELIVERY',PHOTOS.groceries[2]),
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
    recommendedHeading:'Recommended Shops',
    allHeading:'Products around you',
    filters:RETAIL_FILTERS,
    promos:[
      promo('shops-local','KAREEBU+ SHOPS','Everything around you','Pharmacies, beauty, gifts, fashion, home and specialist shops in one place.','Explore shops','LOCAL FAVOURITES',PHOTOS.shops[0]),
      promo('shops-offer','TODAY','Offers worth opening','Discover merchant promotions and useful everyday finds.','See offers','UP TO 30% OFF',PHOTOS.shops[1]),
      promo('shops-plus','KAREEBU+','More shops, less delivery','Member delivery savings across selected stores.','See member shops','MEMBER DELIVERY',PHOTOS.shops[2]),
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
    recommendedHeading:'Top tech picks',
    allHeading:'Electronics for you',
    filters:[
      {id:'offers',label:'Offers',icon:'tag'},
      {id:'fast',label:'Same day',icon:'clock'},
      {id:'rating',label:'4.5+ rated',icon:'star'},
      {id:'price',label:'Price',icon:'dollar-sign'},
      {id:'verified',label:'Verified seller',icon:'check-circle'},
    ],
    promos:[
      promo('tech-main','KAREEBU TECH','Tech delivered today','Phones, laptops, charging, audio, gaming and smart-home products.','Shop electronics','TOP TECH',PHOTOS.electronics[0]),
      promo('tech-power','POWER UP','Charging and accessories','Power banks, fast chargers, cables and everyday mobile accessories.','Shop accessories','FAST CHARGE',PHOTOS.electronics[1]),
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
    recommendedHeading:'Popular services',
    allHeading:'Available services',
    filters:SERVICE_FILTERS,
    promos:[
      promo('care-home','KAREEBU HOME & CARE','Trusted help at home','Cleaning, laundry, salon, pest control, moving and care services.','Book a service','AT-HOME SERVICES',PHOTOS.homeCare[0]),
      promo('care-clean','HOME RESET','A cleaner home, sorted','Regular, deep and furniture cleaning services around you.','Book cleaning','POPULAR TODAY',PHOTOS.homeCare[1]),
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
    recommendedHeading:'Popular fixes',
    allHeading:'Repair services',
    filters:[
      {id:'today',label:'Available today',icon:'calendar'},
      {id:'emergency',label:'Urgent',icon:'alert-circle'},
      {id:'rating',label:'4.5+ rated',icon:'star'},
      {id:'nearby',label:'Nearby',icon:'map-pin'},
      {id:'verified',label:'Verified',icon:'check-circle'},
    ],
    promos:[
      promo('fix-main','KAREEBU FIX','Get it fixed','Book trusted help for plumbing, electrical, AC, appliances and more.','Find a pro','VERIFIED PROS',PHOTOS.fix[0]),
      promo('fix-today','AVAILABLE TODAY','Help when you need it','Find repair professionals available around your area today.','See availability','TODAY',PHOTOS.fix[1]),
      promo('fix-smart','HOME TECH','Smart home and tech repair','CCTV, Wi-Fi, phones, computers and connected-home support.','Explore tech repair','TECH HELP',PHOTOS.fix[2]),
    ],
    photos:[...PHOTOS.fix],
  },
};
