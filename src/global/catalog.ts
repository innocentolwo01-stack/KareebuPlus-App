import type { GlobalCategoryId, GlobalMarketplaceId, GlobalProduct } from './types';
import { GLOBAL_TAXONOMY } from './taxonomy';

const HEADPHONES = require('../../assets/kareebu-plus/global/products/headphones.png');
const TRAINERS = require('../../assets/kareebu-plus/global/products/trainers.png');
const SKINCARE = require('../../assets/kareebu-plus/global/products/skincare-set.png');
const HOME_KIT = require('../../assets/kareebu-plus/global/products/home-organisation-kit.png');
const BUILDING_SET = require('../../assets/kareebu-plus/global/products/building-set.png');
const HERO = require('../../assets/kareebu-plus/global/hero-global-shopping.png');

const E_PHONES = require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-phones.png');
const E_TV = require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png');
const E_COMPUTING = require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-computing.png');
const SERVICE_ELECTRONICS = require('../../assets/kareebu-plus/lifestyle-cutouts/service-electronics.png');
const SERVICE_GROCERIES = require('../../assets/kareebu-plus/lifestyle-cutouts/service-groceries.png');
const G_CLEANING = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png');
const G_PERSONAL = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png');
const G_BAKERY = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-bakery.png');
const G_DRINKS = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-drinks.png');
const G_SNACKS = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-snacks.png');
const PH_VITAMINS = require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png');
const EXP_WELLNESS = require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png');
const SERVICE_SHOPS = require('../../assets/kareebu-plus/lifestyle-cutouts/service-shops.png');

const DISC_BEAUTY = require('../../assets/kareebu-plus/global/products/skincare-set.png');
const DISC_ELECTRONICS = require('../../assets/kareebu-plus/lifestyle-cutouts/service-electronics.png');
const DISC_FASHION = require('../../assets/kareebu-plus/global/products/trainers.png');
const DISC_ACCESSORIES = require('../../assets/kareebu-plus/top-offers/category-essentials.jpg');
const DISC_TOYS = require('../../assets/kareebu-plus/global/products/building-set.png');
const DISC_PERSONAL = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-personal-care.png');
const DISC_CLEANING = require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png');
const DISC_FITNESS = require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png');
const DISC_SUPPLEMENTS = require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png');
const DISC_APPLIANCES = require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg');
const DISC_FLOWERS = require('../../assets/kareebu-plus/top-offers/category-flowers.jpg');

const TOP_VITAMINS = require('../../assets/kareebu-plus/top-offers/category-vitamins.jpg');
const TOP_FLOWERS = require('../../assets/kareebu-plus/top-offers/category-flowers.jpg');
const OFFER_WELLNESS = require('../../assets/kareebu-plus/top-offers/offer-wellness.jpg');
const OFFER_TOYS = require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg');
const OFFER_KITCHEN = require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg');
const CATEGORY_ESSENTIALS = require('../../assets/kareebu-plus/top-offers/category-essentials.jpg');

const cancellationNote = 'You can request cancellation until Kareebu completes the purchase from the overseas retailer. After that, source-marketplace rules apply.';
const MARKETPLACES: GlobalMarketplaceId[] = ['amazon', 'ebay', 'shein', 'temu', 'aliexpress', 'etsy'];

const CATEGORY_TARGETS: Record<GlobalCategoryId, number> = {electronics:300,fashion:500,beauty:250,home:250,kids:150,sports:150,automotive:100,books:100,pets:100,accessories:140};

const CATEGORY_IMAGE_POOLS: Record<GlobalCategoryId, any[]> = {
  electronics: [HEADPHONES, E_PHONES, E_COMPUTING, E_TV, SERVICE_ELECTRONICS, DISC_ELECTRONICS, HERO],
  fashion: [TRAINERS, DISC_FASHION, DISC_ACCESSORIES, TOP_FLOWERS, HERO, SERVICE_SHOPS, DISC_FLOWERS],
  beauty: [SKINCARE, DISC_BEAUTY, G_PERSONAL, TOP_VITAMINS, EXP_WELLNESS, DISC_PERSONAL, OFFER_WELLNESS],
  home: [HOME_KIT, OFFER_KITCHEN, G_CLEANING, CATEGORY_ESSENTIALS, G_BAKERY, DISC_APPLIANCES, DISC_CLEANING],
  kids: [BUILDING_SET, DISC_TOYS, OFFER_TOYS, G_SNACKS, HERO, CATEGORY_ESSENTIALS, DISC_FLOWERS],
  sports: [TRAINERS, DISC_FITNESS, DISC_SUPPLEMENTS, EXP_WELLNESS, G_DRINKS, HERO, OFFER_WELLNESS],
  automotive: [HOME_KIT, DISC_APPLIANCES, E_PHONES, CATEGORY_ESSENTIALS, SERVICE_SHOPS, HERO, G_CLEANING],
  books: [CATEGORY_ESSENTIALS, BUILDING_SET, HERO, SERVICE_SHOPS, DISC_TOYS, OFFER_TOYS, E_COMPUTING],
  pets: [DISC_TOYS, OFFER_TOYS, G_SNACKS, G_CLEANING, SERVICE_GROCERIES, CATEGORY_ESSENTIALS, HERO],
  accessories: [TRAINERS, DISC_ACCESSORIES, DISC_FASHION, TOP_FLOWERS, SERVICE_SHOPS, HERO, E_PHONES],
};

const CATEGORY_CONFIG: Record<GlobalCategoryId, { brands: string[]; nouns: string[]; variants: string[]; price: [number, number]; weight: [number, number] }> = {
  electronics: { brands: ['Samsung', 'Apple', 'Google', 'Xiaomi', 'OnePlus', 'Motorola', 'Tecno', 'Infinix', 'Oppo', 'Vivo', 'Huawei', 'Sony', 'Anker', 'Logitech', 'JBL', 'Acer', 'Lenovo', 'Philips', 'SoundForm'], nouns: ['Smartphone', 'Smartphone', 'Smartphone', 'Wireless headphones', 'USB-C charger', 'Portable speaker', 'Gaming monitor', 'Laptop stand', 'Power bank', 'Smartwatch', 'Bluetooth earbuds', 'Mechanical keyboard'], variants: ['Black', 'Silver', 'Blue', '128GB', '256GB'], price: [18, 899], weight: [.12, 4.8] },
  fashion: { brands: ['ASOS Design', 'Northstar', 'Urban Edit', 'Everyday Studio', 'Mode Line', 'Core Wardrobe'], nouns: ['Midi dress', 'Relaxed shirt', 'Straight jeans', 'Lightweight jacket', 'Cotton T-shirt', 'Tailored trousers', 'Maxi dress', 'Active leggings', 'Overshirt', 'Casual knit'], variants: ['Black · M', 'Stone · L', 'Blue · S', 'Green · M', 'Cream · L'], price: [12, 180], weight: [.2, 1.2] },
  beauty: { brands: ['Glow Daily', 'The Ordinary', 'CeraVe', 'Beauty Lab', 'Skin Theory', 'Pure Routine'], nouns: ['Hydrating serum', 'Daily moisturiser', 'Gentle cleanser', 'Sunscreen SPF50', 'Lip colour', 'Hair repair mask', 'Fragrance set', 'Vitamin C serum', 'Face mask set', 'Body lotion'], variants: ['30ml', '50ml', '100ml', '4-piece set', '200ml'], price: [7, 145], weight: [.08, 1.1] },
  home: { brands: ['Neat Living', 'Home Edit', 'Kitchen Craft', 'Nord Home', 'Simple Living'], nouns: ['Storage organiser', 'Bedding set', 'Kitchen utensil set', 'LED lamp', 'Bathroom shelf', 'Cookware set', 'Cleaning kit', 'Drawer organiser', 'Desk lamp', 'Travel storage set'], variants: ['Natural', 'White', 'Charcoal', '12-piece', 'Large'], price: [9, 280], weight: [.25, 6] },
  kids: { brands: ['Maker Kids', 'Little Steps', 'Bright Play', 'Tiny Home', 'Learn & Build'], nouns: ['Creative building set', 'Learning toy', 'Baby feeding set', 'Nursery organiser', 'Travel activity kit', 'Bath toy set', 'Kids backpack', 'Puzzle set', 'Soft play mat', 'Drawing kit'], variants: ['120 pieces', '240 pieces', 'Blue', 'Pink', 'Neutral'], price: [8, 130], weight: [.15, 3] },
  sports: { brands: ['Adidas', 'Nike', 'Puma', 'FitCore', 'Trail Works', 'RunLab'], nouns: ['Running trainers', 'Training shorts', 'Yoga mat', 'Resistance set', 'Football', 'Gym bag', 'Cycling gloves', 'Water bottle', 'Training top', 'Fitness band'], variants: ['Black', 'Blue', 'EU 42', 'Medium', 'Large'], price: [8, 220], weight: [.1, 2.5] },
  automotive: { brands: ['AutoCore', 'DriveMate', 'Road Ready', 'Car Essentials'], nouns: ['Phone mount', 'Car charger', 'Seat organiser', 'Tyre inflator', 'Cleaning kit', 'Boot organiser', 'Dash holder', 'Emergency kit', 'USB adapter', 'Interior light kit'], variants: ['Universal', 'Black', '12V', 'Compact', 'Premium'], price: [7, 170], weight: [.1, 3.5] },
  books: { brands: ['Penguin', 'HarperCollins', 'Oxford', 'DK', 'Independent Press'], nouns: ['Business paperback', 'Children’s book', 'Cookbook', 'Study guide', 'Travel guide', 'Photography book', 'Leadership book', 'Personal finance book', 'Novel', 'Design handbook'], variants: ['Paperback', 'Hardback', 'Illustrated', '2026 edition', 'Gift edition'], price: [5, 70], weight: [.15, 1.8] },
  pets: { brands: ['Paw Life', 'Pet Essentials', 'Happy Tail', 'Cat & Co', 'Animal Home'], nouns: ['Pet toy set', 'Dog lead', 'Cat bed', 'Grooming brush', 'Pet bowl set', 'Travel carrier', 'Treat pouch', 'Pet blanket', 'Scratch toy', 'Pet storage bin'], variants: ['Small', 'Medium', 'Large', 'Blue', 'Natural'], price: [5, 120], weight: [.08, 4] },
  accessories: { brands: ['Fossil', 'Everyday Studio', 'Urban Edit', 'Carry Co', 'Time Line'], nouns: ['Crossbody bag', 'Watch', 'Sunglasses', 'Leather belt', 'Travel wallet', 'Tote bag', 'Jewellery set', 'Cap', 'Card holder', 'Backpack'], variants: ['Black', 'Tan', 'Silver', 'Gold tone', 'One size'], price: [7, 260], weight: [.05, 1.5] },
};

const seeded = (n: number) => { const x = Math.sin(n * 999.91) * 43758.5453; return x - Math.floor(x); };
const pick = <T,>(items: T[], seed: number) => items[Math.floor(seeded(seed) * items.length)]!;
const range = (r: [number, number], seed: number) => r[0] + seeded(seed) * (r[1] - r[0]);
const rotate = <T,>(items: T[], shift: number): T[] => items.map((_, index) => items[(index + shift) % items.length]!);

function semanticProductPool(category: GlobalCategoryId, noun: string): any[] {
  const value = noun.toLowerCase();
  if (category === 'electronics') {
    if (/headphone|earbud/.test(value)) return [HEADPHONES, SERVICE_ELECTRONICS, DISC_ELECTRONICS];
    if (/smartphone|charger|power bank|smartwatch/.test(value)) return [E_PHONES, SERVICE_ELECTRONICS, DISC_ELECTRONICS];
    if (/monitor|keyboard|laptop/.test(value)) return [E_COMPUTING, DISC_ELECTRONICS, SERVICE_ELECTRONICS];
    if (/speaker/.test(value)) return [SERVICE_ELECTRONICS, HEADPHONES, DISC_ELECTRONICS];
  }
  if (category === 'fashion') {
    if (/dress|shirt|jean|jacket|trouser|legging|overshirt|knit/.test(value)) return [DISC_FASHION, SERVICE_SHOPS, DISC_ACCESSORIES];
    return [TRAINERS, DISC_ACCESSORIES, DISC_FASHION];
  }
  if (category === 'beauty') {
    if (/serum|moisturiser|cleanser|sunscreen|mask/.test(value)) return [SKINCARE, DISC_BEAUTY, EXP_WELLNESS];
    if (/hair|body/.test(value)) return [G_PERSONAL, DISC_PERSONAL, DISC_BEAUTY];
    return [DISC_BEAUTY, SKINCARE, G_PERSONAL];
  }
  if (category === 'home') {
    if (/storage|organiser/.test(value)) return [HOME_KIT, CATEGORY_ESSENTIALS, G_CLEANING];
    if (/kitchen|cookware/.test(value)) return [OFFER_KITCHEN, DISC_APPLIANCES, HOME_KIT];
    if (/cleaning/.test(value)) return [G_CLEANING, DISC_CLEANING, HOME_KIT];
    if (/lamp/.test(value)) return [DISC_APPLIANCES, HOME_KIT, OFFER_KITCHEN];
  }
  if (category === 'kids') {
    if (/building/.test(value)) return [BUILDING_SET, DISC_TOYS, OFFER_TOYS];
    if (/baby|nursery/.test(value)) return [DISC_PERSONAL, BUILDING_SET, DISC_TOYS];
    return [DISC_TOYS, OFFER_TOYS, BUILDING_SET];
  }
  if (category === 'sports') {
    if (/trainer/.test(value)) return [TRAINERS, DISC_FITNESS, EXP_WELLNESS];
    if (/bottle/.test(value)) return [G_DRINKS, DISC_FITNESS, TRAINERS];
    return [DISC_FITNESS, TRAINERS, DISC_SUPPLEMENTS];
  }
  if (category === 'automotive') return [E_PHONES, DISC_APPLIANCES, CATEGORY_ESSENTIALS];
  if (category === 'books') return [CATEGORY_ESSENTIALS, E_COMPUTING, BUILDING_SET];
  if (category === 'pets') return [DISC_TOYS, OFFER_TOYS, CATEGORY_ESSENTIALS];
  if (category === 'accessories') return [DISC_ACCESSORIES, TRAINERS, DISC_FASHION];
  return CATEGORY_IMAGE_POOLS[category];
}

function semanticProductImage(category: GlobalCategoryId, noun: string, seed: number) {
  const pool = semanticProductPool(category, noun);
  return pool[Math.abs(seed) % pool.length]!;
}

function relevantFixtureGallery(category: GlobalCategoryId, noun: string, image: any, seed: number) {
  // Fixture galleries are merchandising media, not claimed source-marketplace photos.
  // Keep every slot semantically tied to the product type while varying the media
  // enough that discovery does not look like one repeated placeholder image.
  const pool=[image,...semanticProductPool(category,noun),...CATEGORY_IMAGE_POOLS[category]].filter((item,index,items)=>items.indexOf(item)===index);
  const rotated=rotate(pool,Math.abs(seed)%Math.max(1,pool.length));
  const ordered=[image,...rotated.filter(item=>item!==image)];
  while(ordered.length<5) ordered.push(image);
  return ordered.slice(0,5);
}

const taxonomyFor = (category: GlobalCategoryId, index: number) => {
  const candidates = GLOBAL_TAXONOMY.filter(node => node.category === category && node.parentId);
  const node = candidates[index % candidates.length];
  if (!node) return [category];
  return node.id.split('.');
};

const SMARTPHONE_BRANDS=['Apple','Samsung','Google','Xiaomi','OnePlus','Motorola','Nokia','Tecno','Infinix','Oppo','Vivo','Huawei'] as const;
const AUDIO_BRANDS=['Sony','JBL','Anker','SoundForm','Philips','Samsung'] as const;
const COMPUTING_BRANDS=['Lenovo','Acer','Logitech','Samsung','Philips'] as const;
const POWER_BRANDS=['Anker','Samsung','Philips','SoundForm'] as const;

function compatibleBrand(category:GlobalCategoryId,noun:string,seed:number,defaultBrands:string[]) {
  if(category!=='electronics')return pick(defaultBrands,seed);
  const value=noun.toLowerCase();
  if(/smartphone/.test(value))return pick([...SMARTPHONE_BRANDS],seed);
  if(/headphone|earbud|speaker/.test(value))return pick([...AUDIO_BRANDS],seed);
  if(/monitor|keyboard|laptop/.test(value))return pick([...COMPUTING_BRANDS],seed);
  if(/charger|power bank/.test(value))return pick([...POWER_BRANDS],seed);
  if(/smartwatch/.test(value))return pick(['Apple','Samsung','Google','Huawei','Xiaomi'],seed);
  return pick(defaultBrands,seed);
}

const SMARTPHONE_MODELS:Record<string,string[]>={
  Apple:['iPhone 16 Pro','iPhone 16','iPhone 15 Pro','iPhone 15','iPhone 14','iPhone SE'],
  Samsung:['Galaxy S25','Galaxy S24','Galaxy A56','Galaxy A36','Galaxy Z Flip6','Galaxy Z Fold6'],
  Google:['Pixel 9 Pro','Pixel 9','Pixel 8a'],
  Xiaomi:['14T Pro','14T','Redmi Note 14 Pro','Redmi Note 14'],
  OnePlus:['13','12R','Nord 4'],
  Motorola:['Edge 50 Pro','Moto G85','Razr 50'],
  Nokia:['G42 5G','C32','XR21'],
  Tecno:['Camon 30 Pro','Spark 30','Phantom V Flip'],
  Infinix:['Note 40 Pro','Hot 50','Zero 40'],
  Oppo:['Reno 12 Pro','Reno 12','A80'],
  Vivo:['V40 Pro','V40','Y28'],
  Huawei:['Pura 70','Nova 12','Mate X5'],
};

function smartphoneModelFor(brand:string,seed:number){
  const models=SMARTPHONE_MODELS[brand]??['Smartphone'];
  return pick(models,seed);
}

function productTitleFor(category:GlobalCategoryId,brand:string,noun:string,seed:number) {
  if(category==='electronics'&&noun==='Smartphone') return `${brand} ${smartphoneModelFor(brand,seed)}`;
  return `${brand} ${noun}`;
}

function variantsFor(category:GlobalCategoryId,noun:string,configVariants:string[]) {
  if(category==='electronics'&&noun==='Smartphone')return ['128GB','256GB','512GB'];
  if(category==='electronics'&&/smartwatch/.test(noun.toLowerCase()))return ['40mm','44mm','Black'];
  return configVariants;
}

function generatedProduct(category: GlobalCategoryId, index: number, globalIndex: number): GlobalProduct {
  const config = CATEGORY_CONFIG[category];
  const marketplace = MARKETPLACES[globalIndex % MARKETPLACES.length]!;
  const noun = pick(config.nouns, globalIndex + 23);
  const brand = compatibleBrand(category,noun,globalIndex + 11,config.brands);
  const productVariants=variantsFor(category,noun,config.variants);
  const variant = pick(productVariants, globalIndex + 37);
  const sourcePrice = Number(range(config.price, globalIndex + 41).toFixed(2));
  const weightKg = Number(range(config.weight, globalIndex + 59).toFixed(2));
  const path = taxonomyFor(category, index);
  const image = semanticProductImage(category, noun, globalIndex);
  const gallery = relevantFixtureGallery(category, noun, image, globalIndex);
  const deliveryBase = 7 + (globalIndex % 7);

  return {
    id: `global-${category}-${String(index + 1).padStart(4, '0')}`,
    marketplace,
    seller: `${marketplace.toUpperCase()} marketplace seller`,
    retailer: marketplace,
    sourceRegion: `${marketplace.toUpperCase()} marketplace source`,
    sourceReference: `${marketplace.toUpperCase()}-FIX-${globalIndex + 1000}`,
    sourceCurrency: globalIndex % 7 === 0 ? 'EUR' : globalIndex % 5 === 0 ? 'GBP' : 'USD',
    sourcePrice,
    title: productTitleFor(category,brand,noun,globalIndex + 71),
    subtitle: `${brand} · ${variant}`,
    brand,
    category,
    subcategory: path[path.length - 1],
    taxonomyPath: path,
    image,
    images: gallery,
    variant,
    variants: Array.from(new Set([variant, ...productVariants.slice(0, 4)])),
    colours: category === 'fashion' || category === 'accessories' || category === 'sports' ? ['Black', 'Stone', 'Blue', 'Green'] : undefined,
    sizes: category === 'fashion' || category === 'sports' ? ['S', 'M', 'L', 'XL'] : undefined,
    description: `Catalogue preview for ${noun.toLowerCase()}. Source price, availability, specifications and delivery details are refreshed before payment.`,
    specifications: [
      { label: 'Brand', value: brand },
      { label: 'Category', value: category },
      { label: 'Source status', value: 'Verified before payment' },
      { label: 'Marketplace', value: marketplace.toUpperCase() },
    ],
    weightKg,
    dimensionsCm: { length: Math.round(10 + seeded(globalIndex + 3) * 30), width: Math.round(8 + seeded(globalIndex + 4) * 20), height: Math.round(4 + seeded(globalIndex + 5) * 18) },
    rating: Number((3.8 + seeded(globalIndex + 61) * 1.2).toFixed(1)),
    reviewCount: Math.round(20 + seeded(globalIndex + 67) * 4800),
    deliveryDays: [deliveryBase, deliveryBase + 6 + (globalIndex % 5)],
    restriction: category === 'beauty' && index % 41 === 0 ? 'requires_regulatory_clearance' : 'eligible',
    stock: 'check_at_quote',
    lastVerifiedAt: '2026-08-23T09:00:00Z',
    priceExpiresAt: '2026-08-24T09:00:00Z',
    availabilityExpiresAt: '2026-08-24T09:00:00Z',
    live: false,
    dataSource: 'fixture',
    referenceFixture: true,
    priceStatus: 'reference',
    partnerStatus: 'unknown',
    returnEligibility: category === 'beauty' ? 'conditional' : 'eligible',
    cancellationNote,
    returnNote: 'Return eligibility is reconfirmed from the source listing before payment. International return shipping may apply.',
    warrantyNote: category === 'electronics' ? 'Manufacturer/marketplace warranty coverage can vary by destination country and must be confirmed from the live source listing.' : undefined,
  };
}

export const GLOBAL_PRODUCTS: GlobalProduct[] = (() => {
  const items: GlobalProduct[] = [];
  let globalIndex = 0;
  for (const [category, count] of Object.entries(CATEGORY_TARGETS) as Array<[GlobalCategoryId, number]>) {
    for (let index = 0; index < count; index += 1) items.push(generatedProduct(category, index, globalIndex++));
  }
  return items;
})();

export function globalProducts(input: { query?: string; marketplace?: string; category?: string; taxonomyId?: string; offset?: number; limit?: number }) {
  const query = input.query?.trim().toLowerCase();
  const filtered = GLOBAL_PRODUCTS.filter(product =>
    (!input.marketplace || product.marketplace === input.marketplace) &&
    (!input.category || product.category === input.category) &&
    (!input.taxonomyId || product.taxonomyPath?.join('.').startsWith(input.taxonomyId)) &&
    (!query || `${product.title} ${product.brand} ${product.marketplace} ${product.category} ${product.subcategory ?? ''} ${(product.taxonomyPath ?? []).join(' ')} ${product.variant}`.toLowerCase().includes(query))
  );
  const offset = input.offset ?? 0;
  const limit = input.limit ?? filtered.length;
  return filtered.slice(offset, offset + limit);
}

export const GLOBAL_CATALOG_STATS = { total: GLOBAL_PRODUCTS.length, marketplaces: MARKETPLACES.length, categories: Object.keys(CATEGORY_TARGETS).length, distribution: CATEGORY_TARGETS };

export const GLOBAL_DEPARTMENTS: Array<{ id: string; category: GlobalCategoryId; title: string; subtitle: string; image: any }> = [
  { id: 'beauty', category: 'beauty', title: 'Beauty', subtitle: 'Skincare, fragrance and personal care', image: SKINCARE },
  { id: 'health-fitness', category: 'sports', title: 'Health & Fitness', subtitle: 'Training, wellness and recovery', image: DISC_FITNESS },
  { id: 'fashion', category: 'fashion', title: 'Fashion', subtitle: 'Clothing, shoes and style', image: TRAINERS },
  { id: 'electronics', category: 'electronics', title: 'PC & Electronics', subtitle: 'Tech, devices and accessories', image: E_COMPUTING },
  { id: 'home', category: 'home', title: 'Home & Kitchen', subtitle: 'Storage, cleaning and essentials', image: HOME_KIT },
  { id: 'office-school', category: 'books', title: 'Office & School', subtitle: 'Books, study and desk essentials', image: CATEGORY_ESSENTIALS },
  { id: 'personal-care', category: 'beauty', title: 'Personal Care', subtitle: 'Everyday care and self-care', image: G_PERSONAL },
  { id: 'pet-supplies', category: 'pets', title: 'Pet Supplies', subtitle: 'Food, care and pet essentials', image: DISC_TOYS },
  { id: 'toys-games', category: 'kids', title: 'Toys & Games', subtitle: 'Creative play and gifting', image: BUILDING_SET },
  { id: 'baby', category: 'kids', title: 'Baby', subtitle: 'Feeding, nursery and travel', image: DISC_PERSONAL },
  { id: 'automotive', category: 'automotive', title: 'Automotive', subtitle: 'Car tech and everyday accessories', image: E_PHONES },
  { id: 'accessories', category: 'accessories', title: 'Accessories', subtitle: 'Bags, watches and everyday extras', image: DISC_ACCESSORIES },
];

export type GlobalPromoPanel = {
  id: string;
  title: string;
  body: string;
  tone: string;
  image: any;
  marketplace?: GlobalMarketplaceId;
  category?: GlobalCategoryId;
};

export const GLOBAL_PROMO_PANELS: GlobalPromoPanel[] = [
  { id: 'first-order', title: 'Explore your first Global order', body: 'Use Kareebu Global to review a landed estimate in your local currency before ordering.', tone: '#F97316', image: HERO, marketplace: 'amazon' },
  { id: 'deals-ending', title: 'Explore Home & Tech', body: 'Browse beauty, home, tech and school categories from supported global marketplaces.', tone: '#5ACA7C', image: OFFER_KITCHEN, category: 'home' },
  { id: 'beauty-deals', title: 'Discover Beauty', body: 'Skincare, personal care and beauty categories from supported global sources.', tone: '#9FE7B3', image: SKINCARE, category: 'beauty' },
  { id: 'school-deals', title: 'Explore Office & School', body: 'Books, study and desk essentials from supported global sources.', tone: '#9FE7B3', image: CATEGORY_ESSENTIALS, category: 'books' },
  { id: 'cleaning-deals', title: 'Explore Household Cleaning', body: 'Home care, cleaning and storage categories with landed-price estimates.', tone: '#9FE7B3', image: G_CLEANING, category: 'home' },
  { id: 'care-deals', title: 'Explore Personal Care', body: 'Self-care, grooming and everyday personal-care categories.', tone: '#9FE7B3', image: DISC_PERSONAL, category: 'beauty' },
  { id: 'pet-deals', title: 'Explore Pet Supplies', body: 'Pet care, toys and everyday pet essentials.', tone: '#9FE7B3', image: DISC_TOYS, category: 'pets' },
  { id: 'tech-promo', title: 'Explore Global Tech', body: 'Phones, computing, audio and accessories across supported Global sources.', tone: '#A7E8C0', image: E_PHONES, category: 'electronics' },
];

export const GLOBAL_EDITORIAL_GROUPS: Array<{ id: string; title: string; cta: string; category: GlobalCategoryId; image: any }> = [
  { id: 'japan-store', title: 'Japan Store', cta: 'Explore the collection', category: 'home', image: HOME_KIT },
  { id: 'gifts', title: 'Gifts by interest', cta: 'Find the perfect pick', category: 'kids', image: TOP_FLOWERS },
  { id: 'artist-merch', title: 'Artist merch', cta: 'Limited and collectible picks', category: 'fashion', image: DISC_FASHION },
  { id: 'curated-finds', title: 'Curated finds', cta: 'Explore useful accessories and everyday extras', category: 'accessories', image: TRAINERS },
];
