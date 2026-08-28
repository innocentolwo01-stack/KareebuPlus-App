import type { ImageSourcePropType } from 'react-native';
import type { Screen } from '../types';
import { marketContent } from '../content/markets';
import { VERTICAL_CONFIGS, type VerticalCategory, type VerticalId } from './verticals';
import type { PromotionCampaign } from '../promotions/types';
import type { SearchContext } from '../search/context';
import { searchContextForVertical } from '../search/context';
import {
  promotionalAssetsFor,
  type KareebuBannerAsset,
} from '../promotions/promotionalContentRegistry';

export type VerticalSectionType =
  | 'hero_promo'
  | 'promo_carousel'
  | 'seller_carousel'
  | 'category_grid'
  | 'category_carousel'
  | 'square_promotion'
  | 'product_carousel'
  | 'bestseller_carousel'
  | 'most_ordered'
  | 'brand_carousel'
  | 'nearby'
  | 'reorder'
  | 'offer_carousel'
  | 'editorial_banner'
  | 'all_results';

export type ReferenceState = {
  referenceFixture: true;
  partnerStatus: 'unknown';
  liveAvailability: false;
  livePrice: false;
  source: string;
  lastVerifiedAt?: string;
};

export type VerticalSeller = ReferenceState & {
  id: string;
  name: string;
  vertical: VerticalId;
  market: string;
  image?: ImageSourcePropType;
  imageUrl?: string;
  rating?: number;
  distance?: string;
  deliveryEstimate?: string;
  kareebuPlusEligible?: boolean;
  availabilityStatus?: 'open' | 'closed' | 'temporarily-unavailable' | 'unknown';
};

export type VerticalProduct = ReferenceState & {
  id: string;
  name: string;
  brand?: string;
  pack?: string;
  seller?: string;
  image?: ImageSourcePropType;
  imageUrl?: string;
  referencePrice?: number;
  currency?: string;
};

export type VerticalSection = {
  id: string;
  type: VerticalSectionType;
  title?: string;
  subtitle?: string;
  categories?: VerticalCategory[];
  sellers?: VerticalSeller[];
  products?: VerticalProduct[];
  promos?: PromotionCampaign[];
  promotionalAssets?: KareebuBannerAsset[];
  route?: Screen;
  ctaLabel?: string;
  priority: number;
  enabled: boolean;
  country?: string;
  city?: string;
  membershipRequired?: boolean;
};

export type VerticalLandingBlueprint = {
  id: string;
  service: VerticalId;
  market: string;
  city: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  search: SearchContext;
  sections: VerticalSection[];
  version: string;
};

const REFERENCE_STATE: ReferenceState = {
  referenceFixture: true,
  partnerStatus: 'unknown',
  liveAvailability: false,
  livePrice: false,
  source: 'Kareebu market reference fixture',
};

const PRODUCT_NAMES: Record<VerticalId, string[]> = {
  groceries: ['Fresh produce selection', 'Dairy & eggs essentials', 'Breakfast staples', 'Household cleaning essentials'],
  pharmacy: ['Pain relief essentials', 'Cold and flu care', 'Allergy care', 'Everyday first-aid kit', 'Vitamin supplement pack', 'Baby-care essentials', 'Personal-care essentials', 'Home health essentials'],
  butchery: ['Fresh beef cuts', 'Chicken portions', 'Whole tilapia', 'Seafood selection'],
  electronics: ['Android smartphone', 'USB-C fast charger', 'Wireless headphones', 'Rechargeable power bank'],
  pets: ['Complete dog food', 'Cat food pouch pack', 'Pet grooming kit', 'Durable pet toy'],
  gifts: ['Fresh flower bouquet', 'Chocolate gift hamper', 'Celebration cake', 'Greeting card'],
  beauty: ['Daily facial cleanser', 'Body moisturiser', 'Hair-care treatment', 'Eau de parfum'],
  fashion: ['Everyday trainers', 'Cotton T-shirt', 'Crossbody bag', 'Sportswear set'],
  home: ['Kitchen storage set', 'Laundry essentials', 'Home cleaning kit', 'Soft furnishing'],
};

const PRODUCT_IMAGES: Record<VerticalId, ImageSourcePropType[]> = {
  groceries: [
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fresh-food.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-dairy-eggs.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-cooking-staples.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'),
  ],
  pharmacy: [
    require('../../assets/kareebu-plus/realistic-v9/pain-relief.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/cold-flu.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/allergy.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/first-aid.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/vitamins-supplements.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/baby-child.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/personal-care.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/home-health.jpg'),
  ],
  butchery: [
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-beef.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-chicken.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fish.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-seafood.png'),
  ],
  electronics: [
    require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-phones.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-computing.png'),
    require('../../assets/kareebu-plus/global/products/headphones.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png'),
  ],
  pets: [
    require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-snacks.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'),
    require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
  ],
  gifts: [
    require('../../assets/kareebu-plus/top-offers/category-flowers.jpg'),
    require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
    require('../../assets/kareebu-plus/food-exact/categories/dessert.png'),
    require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
  ],
  beauty: [
    require('../../assets/kareebu-plus/global/products/skincare-set.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png'),
    require('../../assets/kareebu-plus/top-offers/category-vitamins.jpg'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png'),
  ],
  fashion: [
    require('../../assets/kareebu-plus/global/products/trainers.png'),
    require('../../assets/kareebu-plus/top-offers/category-essentials.jpg'),
    require('../../assets/kareebu-plus/global/products/trainers.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/explore-things-to-do.png'),
  ],
  home: [
    require('../../assets/kareebu-plus/global/products/home-organisation-kit.png'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'),
    require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg'),
    require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png'),
  ],
};

const SECTION_LABELS: Record<VerticalId, { sellers: string; products: string; best: string; all: string }> = {
  groceries: { sellers: 'Supermarkets to shop', products: 'Browse grocery essentials', best: 'More grocery essentials', all: 'All grocery products & stores' },
  pharmacy: { sellers: 'Pharmacies to shop', products: 'Browse wellness essentials', best: 'More wellness essentials', all: 'All pharmacy products & categories' },
  butchery: { sellers: 'Butchers & fishmongers', products: 'Browse fresh cuts & seafood', best: 'More fresh cuts & seafood', all: 'All butchery & seafood shops' },
  electronics: { sellers: 'Electronics stores', products: 'Browse technology', best: 'More technology', all: 'All electronics sellers & products' },
  pets: { sellers: 'Pet stores', products: 'Browse pet supplies', best: 'More pet supplies', all: 'All pet supplies' },
  gifts: { sellers: 'Gift & flower stores', products: 'Browse gifts', best: 'More gift ideas', all: 'All gift & flower sellers' },
  beauty: { sellers: 'Beauty stores', products: 'Browse beauty', best: 'More beauty', all: 'All beauty' },
  fashion: { sellers: 'Fashion stores', products: 'Browse fashion', best: 'More fashion', all: 'All fashion' },
  home: { sellers: 'Home stores', products: 'Browse home essentials', best: 'More for home', all: 'All home products' },
};

const MERCHANDISING_LABELS:Partial<Record<VerticalId,{first:string;second:string;collection:string;collectionSubtitle:string}>>={
  fashion:{first:'Editor’s picks',second:'Explore more style',collection:'Shop by collection',collectionSubtitle:'Clothing, footwear and beauty destinations'},
  pharmacy:{first:'Vitamins & everyday wellness',second:'Personal & family care',collection:'Shop by need',collectionSubtitle:'Browse familiar health and care departments without diagnostic claims'},
  electronics:{first:'Devices to explore',second:'Work, play & home tech',collection:'Build your setup',collectionSubtitle:'Phones, computing, gaming, entertainment and accessories'},
  groceries:{first:'Fresh picks',second:'Cooking & household essentials',collection:'Shop by mission',collectionSubtitle:'Breakfast, dinner, fresh food and the weekly household shop'},
  beauty:{first:'Build your routine',second:'Explore more beauty',collection:'Shop by routine',collectionSubtitle:'Skincare, hair, fragrance and personal care'},
  home:{first:'Refresh your space',second:'Practical home essentials',collection:'Shop by room & task',collectionSubtitle:'Kitchen, storage, cleaning and comfortable living'},
};

function sellerFixtures(verticalId: VerticalId, country: string): VerticalSeller[] {
  const content = marketContent(country);
  const editorialNames:Partial<Record<VerticalId,string[]>>={
    pharmacy: country==='Tanzania'?['Breeze Pharmacy']:country==='Kenya'?['Goodlife Pharmacy']:['Goodlife Pharmacy',"Gentleman's Pharmacy"],
    butchery:[`${content.cities[0]} Fresh Cuts`,`${content.cities[0]} Fish Market`,'Neighbourhood Butchery'],
    pets:[`${content.cities[0]} Pet Supplies`],gifts:[`${content.cities[0]} Flowers & Gifts`],
  };
  const names=editorialNames[verticalId]??(content.storeReferences.length?content.storeReferences:[`${content.cities[0]} ${VERTICAL_CONFIGS[verticalId].title} sellers`]);
  return names.slice(0, 5).map((name, index) => ({
    ...REFERENCE_STATE,
    id: `${verticalId}-${country}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name,
    vertical: verticalId,
    market: country,
    availabilityStatus: verticalId==='butchery'&&index===1?'closed':'unknown',
  }));
}

function productFixtures(verticalId: VerticalId, country: string): VerticalProduct[] {
  return PRODUCT_NAMES[verticalId].map((name, index) => ({
    ...REFERENCE_STATE,
    id: `${verticalId}-product-${index}`,
    name,
    pack: index % 2 ? 'Standard pack' : '1 item',
    source: `${country} merchandising reference fixture`,
    image: PRODUCT_IMAGES[verticalId][index % PRODUCT_IMAGES[verticalId].length],
  }));
}

export function verticalLandingBlueprint(verticalId: VerticalId, country: string, city: string, sellerOverrides?: VerticalSeller[]): VerticalLandingBlueprint {
  const base = VERTICAL_CONFIGS[verticalId];
  const override = base.countryOverrides?.[country];
  const config = { ...base, ...override };
  const labels = SECTION_LABELS[verticalId];
  const sellers = sellerOverrides?.length ? sellerOverrides : sellerFixtures(verticalId, country);
  const products = productFixtures(verticalId, country);
  const categories = [...config.categories, ...(config.secondaryCategories ?? [])];
  const merchandising=MERCHANDISING_LABELS[verticalId];
  const collectionCategories=verticalId==='pharmacy'?categories.slice(6):verticalId==='groceries'?categories.filter(category=>['breakfast','fresh-produce','rice-pasta-pulses','household','baby','pet'].includes(category.id)):verticalId==='electronics'?categories.filter(category=>['computers','gaming','tv','power','wearables','smart-home'].includes(category.id)):categories.slice(0,Math.min(6,categories.length));
  const squarePromotions=promotionalAssetsFor({type:'square-promotion',category:verticalId,placement:'category-landing'});
  const sections: VerticalSection[] = [
    { id: `${verticalId}-categories`, type: 'category_grid', title: verticalId === 'pharmacy' ? 'Shop medicines & health by need' : verticalId === 'gifts' ? 'Shop by occasion & category' : verticalId === 'pets' ? 'Shop by pet & need' : 'Shop by category', categories, priority: 80, enabled: true, country, city },
    { id: `${verticalId}-square-promotions`, type: 'square_promotion', title: 'Fresh picks', promotionalAssets:squarePromotions, priority: 78, enabled: squarePromotions.length > 0, country, city },
    { id: `${verticalId}-sellers`, type: 'seller_carousel', title: verticalId==='pharmacy'?'Pharmacies to shop':labels.sellers, subtitle: verticalId==='pharmacy'?'Choose a pharmacy and keep shopping within that store.':`Browse relevant stores serving ${city}`, sellers, route: 'allStores', ctaLabel: 'See all', priority: 75, enabled: true, country, city },
    { id: `${verticalId}-featured`, type: 'product_carousel', title: verticalId === 'pharmacy' ? 'Health products' : merchandising?.first??labels.products, subtitle: 'Open a product to review seller details and availability', products, route: 'categoryItems', ctaLabel: 'See all', priority: 80, enabled: true, country, city },
    { id: `${verticalId}-collections`, type: 'category_carousel', title: merchandising?.collection??'Explore collections', subtitle: merchandising?.collectionSubtitle, categories:collectionCategories, priority: 55, enabled: collectionCategories.length>2, country, city },
    { id: `${verticalId}-more-products`, type: 'product_carousel', title: merchandising?.second??labels.best, subtitle: 'Explore more products in this department', products: products.slice().reverse(), priority: 50, enabled: true, country, city },
    { id: `${verticalId}-more-sellers`, type: verticalId === 'electronics' || verticalId === 'beauty' || verticalId === 'fashion' ? 'brand_carousel' : 'seller_carousel', title: verticalId === 'electronics' ? 'Tech stores & sellers' : verticalId === 'beauty' ? 'Beauty retailers' : verticalId === 'fashion' ? 'Fashion stores' : verticalId === 'pharmacy' ? 'More pharmacies' : 'More relevant sellers', sellers: sellers.slice().reverse(), route: 'allStores', ctaLabel: 'See all', priority: 25, enabled: sellers.length > 3, country, city },
    { id: `${verticalId}-all`, type: 'all_results', title: labels.all, route: 'allStores', ctaLabel: 'Browse all', priority: 20, enabled: true, country, city },
  ];
  return { id: `${verticalId}-${country.toLowerCase()}-landing`, service: verticalId, market: country, city, title: config.title, subtitle: config.subtitle, searchPlaceholder: config.searchPlaceholder, search: searchContextForVertical(verticalId,config.searchPlaceholder,{market:country,city}), sections, version: '1.1.0' };
}
