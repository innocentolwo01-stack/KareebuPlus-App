import type { DemoShop } from '../demoData';
import type { PromotionPlacement } from '../promotions/types';
import type { CommerceProduct } from './catalog';

export type MerchantType =
  | 'supermarket'
  | 'convenience-store'
  | 'pharmacy'
  | 'electronics'
  | 'beauty'
  | 'fashion'
  | 'pet-store'
  | 'home-kitchen'
  | 'specialty-store';

export type MerchandisingDensityProfile = 'VERY_HIGH' | 'HIGH' | 'MEDIUM_HIGH' | 'MEDIUM' | 'LOW';

export type MerchantCategory = {
  id: string;
  label: string;
  count: number;
  keywords: string[];
  visualSeed: string;
  priority: number;
};

export type MerchantBrowseFacet = {
  id: string;
  label: string;
  count: number;
  visualSeed: string;
  keywords: RegExp;
};

export type StorefrontProductRail = {
  id: string;
  type: 'product-rail';
  title: string;
  subtitle?: string;
  products: CommerceProduct[];
  categoryId?: string;
};

export type StorefrontPromotionModule = {
  id: string;
  type: 'promotion';
  placement: PromotionPlacement;
  categoryId?: string;
  layout: 'hero' | 'compact' | 'carousel';
};

export type StorefrontModule =
  | { id: string; type: 'merchant-campaign' }
  | { id: string; type: 'category-grid'; title: string; subtitle?: string }
  | { id: string; type: 'brand-rail'; title: string; subtitle?: string; brands: string[] }
  | StorefrontProductRail
  | StorefrontPromotionModule;

export type MerchantPageConfig = {
  schema: 'kareebu.merchant.page.v1';
  merchantId: string;
  merchantType: MerchantType;
  density: MerchandisingDensityProfile;
  categories: MerchantCategory[];
  modules: StorefrontModule[];
};

export type MerchantStorefrontPlan = MerchantPageConfig;

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function textFor(product: CommerceProduct) {
  return `${product.name} ${product.category} ${product.subcategory} ${product.detail} ${product.brand ?? ''}`.toLowerCase();
}

export function merchantTypeFor(shop: DemoShop): MerchantType {
  const value = `${shop.category} ${shop.name}`.toLowerCase();
  if (/grocery|groceries|supermarket|carrefour|naivas|quickmart|shoppers|village/.test(value)) return 'supermarket';
  if (/convenience/.test(value)) return 'convenience-store';
  if (/pharm|chemist|health|nutrition|eye care|vision/.test(value)) return 'pharmacy';
  if (/electronic|marketplace|techpoint|jumia/.test(value)) return 'electronics';
  if (/beauty/.test(value)) return 'beauty';
  if (/fashion|clothing|shoe/.test(value)) return 'fashion';
  if (/pet/.test(value)) return 'pet-store';
  if (/home|kitchen|furniture/.test(value)) return 'home-kitchen';
  return 'specialty-store';
}

export function merchandisingDensityFor(type: MerchantType): MerchandisingDensityProfile {
  if (type === 'supermarket') return 'VERY_HIGH';
  if (['electronics', 'beauty', 'fashion'].includes(type)) return 'HIGH';
  if (['pharmacy', 'home-kitchen'].includes(type)) return 'MEDIUM_HIGH';
  if (type === 'pet-store') return 'MEDIUM';
  return 'MEDIUM';
}

type Bucket = { id: string; label: string; keywords: RegExp; visualSeed: string; priority: number };

const SUPERMARKET_BUCKETS: Bucket[] = [
  { id:'fresh', label:'Fresh Food', keywords:/fresh|fruit|vegetable|produce|meat|chicken|fish|seafood/, visualSeed:'fresh fruit vegetables groceries', priority:100 },
  { id:'fruit', label:'Fruit', keywords:/fruit|banana|apple|orange|mango|berry/, visualSeed:'fresh fruit basket', priority:98 },
  { id:'vegetables', label:'Vegetables', keywords:/vegetable|tomato|onion|garlic|ginger|cucumber|greens|broccoli|carrot|spinach|lettuce|kale|cabbage|sukuma|pepper|chilli|chili|herb|coriander|parsley|basil|mint|mushroom|potato|yam|cassava|beet|root/, visualSeed:'fresh vegetables produce', priority:96 },
  { id:'dairy', label:'Milk & Yogurt', keywords:/dairy|milk|yogurt|yoghurt|cheese|cream/, visualSeed:'milk yogurt dairy', priority:94 },
  { id:'eggs', label:'Eggs', keywords:/egg/, visualSeed:'fresh eggs tray', priority:90 },
  { id:'bakery', label:'Bakery', keywords:/bakery|bread|cake|pastry/, visualSeed:'bread bakery pastry', priority:88 },
  { id:'pantry', label:'Rice, Pasta & Pulses', keywords:/pantry|rice|pasta|pulse|beans|lentil|grain|flour/, visualSeed:'rice pasta pantry staples', priority:86 },
  { id:'breakfast', label:'Breakfast', keywords:/breakfast|cereal|oat|spread|jam|honey/, visualSeed:'breakfast cereal pantry', priority:84 },
  { id:'coffee-tea', label:'Coffee & Tea', keywords:/coffee|tea|cocoa/, visualSeed:'coffee tea drinks', priority:82 },
  { id:'beverages', label:'Water & Beverages', keywords:/drink|water|beverage|juice|soda|soft drink/, visualSeed:'water beverages drinks', priority:80 },
  { id:'snacks', label:'Snacks & Sweets', keywords:/snack|sweet|chocolate|biscuit|crisps|chips|candy/, visualSeed:'snacks chocolate sweets', priority:78 },
  { id:'frozen', label:'Frozen', keywords:/frozen|ice cream/, visualSeed:'frozen food groceries', priority:76 },
  { id:'household', label:'Household', keywords:/household|clean|laundry|detergent|paper|storage/, visualSeed:'household cleaning essentials', priority:74 },
  { id:'personal-care', label:'Personal Care', keywords:/personal|toiletr|shampoo|soap|oral|skin|beauty|care/, visualSeed:'personal care toiletries', priority:72 },
  { id:'baby', label:'Baby', keywords:/baby|nappy|diaper|infant|toddler/, visualSeed:'baby care essentials', priority:70 },
  { id:'pets', label:'Pet Supplies', keywords:/pet|dog|cat/, visualSeed:'pet food care', priority:68 },
  { id:'flowers', label:'Flowers', keywords:/flower|bouquet|rose|carnation/, visualSeed:'fresh flowers bouquet', priority:66 },
];

const ELECTRONICS_BUCKETS: Bucket[] = [
  { id:'mobile', label:'Mobiles', keywords:/mobile|phone|smartphone/, visualSeed:'smartphone mobile phone', priority:100 },
  { id:'accessories', label:'Mobile Accessories', keywords:/charger|cable|case|power bank|adapter|accessor|power/, visualSeed:'phone charger accessories', priority:98 },
  { id:'audio', label:'Audio', keywords:/audio|earbud|headphone|speaker|soundbar/, visualSeed:'headphones earbuds audio', priority:96 },
  { id:'computing', label:'Laptops & Computing', keywords:/laptop|computer|monitor|keyboard|mouse|computing/, visualSeed:'laptop computer monitor', priority:94 },
  { id:'gaming', label:'Gaming', keywords:/gaming|console|controller|game|playstation|xbox|switch/, visualSeed:'gaming console controller', priority:92 },
  { id:'wearables', label:'Wearables', keywords:/wearable|watch|fitness band/, visualSeed:'smartwatch wearable', priority:90 },
  { id:'cameras', label:'Cameras', keywords:/camera|content|photo|video/, visualSeed:'camera photography', priority:88 },
  { id:'tv', label:'TV & Entertainment', keywords:/television|\btv\b|entertainment|projector/, visualSeed:'television entertainment', priority:86 },
  { id:'smart-home', label:'Smart Home', keywords:/smart home|security|network|router/, visualSeed:'smart home technology', priority:84 },
  { id:'storage', label:'Storage', keywords:/storage|ssd|hard drive|memory|usb/, visualSeed:'digital storage drive', priority:82 },
];

const PHARMACY_BUCKETS: Bucket[] = [
  { id:'wellness', label:'Vitamins & Wellness', keywords:/vitamin|supplement|wellness|nutrition|protein/, visualSeed:'vitamins supplements wellness', priority:100 },
  { id:'first-aid', label:'First Aid', keywords:/first aid|bandage|plaster|antiseptic|wound/, visualSeed:'first aid medical essentials', priority:96 },
  { id:'personal-care', label:'Personal Care', keywords:/personal|oral|soap|shampoo|deodorant|care/, visualSeed:'personal care toiletries', priority:94 },
  { id:'baby-care', label:'Baby Care', keywords:/baby|infant|nappy|diaper/, visualSeed:'baby care essentials', priority:92 },
  { id:'skincare', label:'Skincare', keywords:/skin|moistur|cleanser|serum|sunscreen/, visualSeed:'skincare serum moisturizer', priority:90 },
  { id:'everyday-health', label:'Everyday Health', keywords:/pain|cold|flu|allergy|digest|health|pharmacy|medicine/, visualSeed:'pharmacy medicines wellness', priority:88 },
];

const BEAUTY_BUCKETS: Bucket[] = [
  { id:'skincare', label:'Skincare', keywords:/skin|cleanser|serum|moistur|sunscreen|mask/, visualSeed:'skincare beauty serum', priority:100 },
  { id:'makeup', label:'Makeup', keywords:/makeup|foundation|lip|mascara|blush|cosmetic/, visualSeed:'makeup cosmetics beauty', priority:96 },
  { id:'hair', label:'Hair', keywords:/hair|shampoo|conditioner|styling/, visualSeed:'hair care products', priority:94 },
  { id:'fragrance', label:'Fragrance', keywords:/fragrance|perfume|scent/, visualSeed:'perfume fragrance beauty', priority:92 },
  { id:'personal-care', label:'Personal Care', keywords:/personal|body|care|deodorant|bath/, visualSeed:'personal care beauty', priority:90 },
];

const PET_BUCKETS: Bucket[] = [
  { id:'dog', label:'Dogs', keywords:/dog|puppy/, visualSeed:'dog pet food', priority:100 },
  { id:'cat', label:'Cats', keywords:/cat|kitten/, visualSeed:'cat pet supplies', priority:98 },
  { id:'food', label:'Food & Treats', keywords:/food|treat|nutrition|feed/, visualSeed:'pet food treats', priority:96 },
  { id:'toys', label:'Toys', keywords:/toy|play/, visualSeed:'pet toys', priority:92 },
  { id:'grooming', label:'Grooming & Care', keywords:/groom|health|care|shampoo|flea/, visualSeed:'pet grooming care', priority:90 },
  { id:'beds', label:'Beds & Home', keywords:/bed|home|litter|crate/, visualSeed:'pet bed home', priority:88 },
];

const HOME_BUCKETS: Bucket[] = [
  { id:'kitchen', label:'Kitchen', keywords:/kitchen|cook|pan|pot|kettle|utensil/, visualSeed:'kitchen cookware appliances', priority:100 },
  { id:'storage', label:'Storage', keywords:/storage|organis|basket|container/, visualSeed:'home storage organisation', priority:96 },
  { id:'cleaning', label:'Cleaning', keywords:/clean|laundry|detergent/, visualSeed:'home cleaning products', priority:94 },
  { id:'decor', label:'Home Decor', keywords:/decor|light|lamp|cushion|rug/, visualSeed:'home decor lighting', priority:92 },
  { id:'appliances', label:'Appliances', keywords:/appliance|kettle|blender|iron|fan/, visualSeed:'home appliances', priority:90 },
  { id:'furniture', label:'Furniture', keywords:/furniture|chair|table|sofa|desk/, visualSeed:'home furniture', priority:88 },
];

function bucketsFor(type: MerchantType): Bucket[] {
  if (type === 'supermarket' || type === 'convenience-store') return SUPERMARKET_BUCKETS;
  if (type === 'electronics') return ELECTRONICS_BUCKETS;
  if (type === 'pharmacy') return PHARMACY_BUCKETS;
  if (type === 'beauty') return BEAUTY_BUCKETS;
  if (type === 'pet-store') return PET_BUCKETS;
  if (type === 'home-kitchen') return HOME_BUCKETS;
  return [];
}

export function deriveMerchantCategories(shop: DemoShop, products: CommerceProduct[]): MerchantCategory[] {
  const type = merchantTypeFor(shop);
  const buckets = bucketsFor(type);
  if (buckets.length) {
    return buckets
      .map(bucket => {
        const matches = products.filter(product => bucket.keywords.test(textFor(product)));
        return {
          id: bucket.id,
          label: bucket.label,
          count: matches.length,
          keywords: [bucket.keywords.source],
          visualSeed: bucket.visualSeed,
          priority: bucket.priority,
        };
      })
      .filter(category => category.count >= 2)
      .sort((a, b) => (b.priority + Math.min(20, b.count)) - (a.priority + Math.min(20, a.count)))
      .slice(0, type === 'supermarket' ? 16 : 12);
  }

  const grouped = new Map<string, MerchantCategory>();
  products.forEach(product => {
    const raw = product.category || product.subcategory || 'Other';
    const id = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const current = grouped.get(id);
    grouped.set(id, {
      id,
      label: raw.replace(/\b\w/g, value => value.toUpperCase()),
      count: (current?.count ?? 0) + 1,
      keywords: [raw.toLowerCase()],
      visualSeed: `${raw} products`,
      priority: current?.priority ?? 60,
    });
  });
  return [...grouped.values()].filter(category => category.count >= 2).sort((a, b) => b.count - a.count).slice(0, 12);
}

const MERCHANT_CATEGORY_FACETS: Record<string, Array<Omit<MerchantBrowseFacet,'count'>>> = {
  vegetables:[
    {id:'leafy-greens',label:'Leafy greens',visualSeed:'spinach leafy greens',keywords:/spinach|lettuce|kale|greens|cabbage|sukuma/},
    {id:'roots',label:'Root vegetables',visualSeed:'carrots root vegetables',keywords:/carrot|potato|yam|cassava|beet|root/},
    {id:'tomatoes',label:'Tomatoes',visualSeed:'fresh tomatoes',keywords:/tomato/},
    {id:'onions-garlic',label:'Onions, garlic & ginger',visualSeed:'onion garlic ginger',keywords:/onion|garlic|ginger/},
    {id:'peppers',label:'Peppers & chillies',visualSeed:'peppers chillies',keywords:/pepper|chilli|chili/},
    {id:'salad-veg',label:'Salad vegetables',visualSeed:'cucumber salad vegetables',keywords:/cucumber|lettuce|salad|courgette|zucchini/},
    {id:'herbs',label:'Fresh herbs',visualSeed:'fresh herbs coriander',keywords:/herb|coriander|parsley|basil|mint/},
    {id:'mushrooms',label:'Mushrooms',visualSeed:'fresh mushrooms',keywords:/mushroom/},
    {id:'ready-to-cook',label:'Ready-to-cook vegetables',visualSeed:'prepared vegetables meal prep',keywords:/prepared|chopped|mixed vegetables|stir fry|stir-fry|soup pack|vegetable pack/},
  ],
  fruit:[
    {id:'bananas',label:'Bananas',visualSeed:'fresh bananas',keywords:/banana|plantain/},
    {id:'citrus',label:'Citrus',visualSeed:'oranges citrus fruit',keywords:/orange|lemon|lime|citrus/},
    {id:'tropical',label:'Tropical fruit',visualSeed:'mango pineapple tropical fruit',keywords:/mango|pineapple|papaya|passion|avocado/},
    {id:'apples-pears',label:'Apples & pears',visualSeed:'apples pears',keywords:/apple|pear/},
    {id:'berries',label:'Berries',visualSeed:'berries fruit',keywords:/berry|berries|strawberry|blueberry/},
  ],
  fresh:[
    {id:'fruit',label:'Fruit',visualSeed:'fresh fruit basket',keywords:/fruit|banana|orange|mango|apple|pineapple/},
    {id:'vegetables',label:'Vegetables',visualSeed:'fresh vegetables produce',keywords:/vegetable|tomato|onion|cucumber|greens|carrot|spinach/},
    {id:'meat',label:'Meat',visualSeed:'fresh meat cuts',keywords:/beef|goat|lamb|chicken|meat/},
    {id:'fish',label:'Fish & seafood',visualSeed:'fresh fish seafood',keywords:/fish|seafood|tilapia|perch|prawn/},
  ],
  mobile:[
    {id:'smartphones',label:'Smartphones',visualSeed:'smartphone mobile phone',keywords:/smartphone|phone/},
    {id:'chargers',label:'Chargers & power',visualSeed:'phone charger power bank',keywords:/charger|power bank|adapter/},
    {id:'cases',label:'Cases & protection',visualSeed:'phone case accessories',keywords:/case|screen protector/},
  ],
  skincare:[
    {id:'cleansers',label:'Cleansers',visualSeed:'skincare cleanser',keywords:/cleanser|wash/},
    {id:'moisturisers',label:'Moisturisers',visualSeed:'skincare moisturiser',keywords:/moistur|cream|lotion/},
    {id:'serums',label:'Serums',visualSeed:'skincare serum',keywords:/serum/},
    {id:'sun-care',label:'Sun care',visualSeed:'sunscreen skincare',keywords:/sunscreen|spf|sun/},
  ],
};

export function merchantBrowseFacets(category: MerchantCategory, products: CommerceProduct[]): MerchantBrowseFacet[] {
  const definitions=MERCHANT_CATEGORY_FACETS[category.id]??[];
  const scoped=productsForMerchantCategory(products,category);
  return definitions.map(definition=>({
    ...definition,
    count:scoped.filter(product=>definition.keywords.test(textFor(product))).length,
  })).filter(facet=>facet.count>0);
}

export function productsForMerchantFacet(products: CommerceProduct[], category: MerchantCategory, facet?: MerchantBrowseFacet) {
  const scoped=productsForMerchantCategory(products,category);
  if(!facet)return scoped;
  return scoped.filter(product=>facet.keywords.test(textFor(product)));
}

export function productsForMerchantCategory(products: CommerceProduct[], category: MerchantCategory) {
  const bucket = bucketsForCategory(category);
  if (bucket) return products.filter(product => bucket.keywords.test(textFor(product)));
  return products.filter(product => category.keywords.some(keyword => textFor(product).includes(keyword)));
}

function bucketsForCategory(category: MerchantCategory) {
  return [...SUPERMARKET_BUCKETS, ...ELECTRONICS_BUCKETS, ...PHARMACY_BUCKETS, ...BEAUTY_BUCKETS, ...PET_BUCKETS, ...HOME_BUCKETS]
    .find(bucket => bucket.id === category.id && bucket.label === category.label);
}

function ranked(products: CommerceProduct[], seed: string) {
  return [...products].sort((a, b) => {
    const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
    if (Math.abs(ratingDelta) > 0.05) return ratingDelta;
    const reviewDelta = (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    if (reviewDelta) return reviewDelta;
    return (stableHash(`${seed}:${a.id}`) % 10000) - (stableHash(`${seed}:${b.id}`) % 10000);
  });
}

function themed(products: CommerceProduct[], expression: RegExp, limit = 10) {
  return products.filter(product => expression.test(textFor(product))).slice(0, limit);
}

function rail(id: string, title: string, products: CommerceProduct[], subtitle?: string, categoryId?: string): StorefrontProductRail | null {
  if (products.length < 2) return null;
  return { id, type:'product-rail', title, subtitle, products:products.slice(0, 10), categoryId };
}

function push<T>(target: T[], item: T | null | undefined) { if (item) target.push(item); }

export function buildMerchantStorefrontPlan(shop: DemoShop, products: CommerceProduct[]): MerchantStorefrontPlan {
  const merchantType = merchantTypeFor(shop);
  const density = merchandisingDensityFor(merchantType);
  const categories = deriveMerchantCategories(shop, products);
  const modules: StorefrontModule[] = [];
  const best = ranked(products, `${shop.id}:best`).slice(0, 10);
  const weekly = ranked(products, `${shop.id}:weekly`).slice(7, 17);
  const liveMerchandising = Boolean(shop.contentTrust?.liveAvailability);
  const featuredTitle = liveMerchandising ? 'Popular picks' : 'Featured picks';
  const featuredSubtitle = liveMerchandising ? 'Products currently attracting attention in this store' : 'A curated selection from this store';
  const brands = Array.from(new Set(products.map(product => product.brand).filter((value): value is string => Boolean(value)))).slice(0, 10);


  if (merchantType === 'supermarket' || merchantType === 'convenience-store') {
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop departments', subtitle:'Fresh food, pantry, household and everyday essentials' });
    push(modules, rail('best-sellers',featuredTitle,best,featuredSubtitle));
    modules.push({ id:'supermarket-hero', type:'promotion', placement:'SUPERMARKET_HERO', layout:'hero' });

    const fresh = themed(products,/fresh|fruit|vegetable|produce|meat|chicken|fish|seafood/,10);
    push(modules, rail('fresh-finds','Fresh Finds',fresh,'Fresh food and produce from this store','fresh'));
    if (fresh.length >= 2) modules.push({ id:'fresh-promo', type:'promotion', placement:'SUPERMARKET_FRESH', categoryId:'fresh', layout:'compact' });

    push(modules, rail('coffee-tea','Coffee & Tea',themed(products,/coffee|tea|cocoa/,10),'Coffee, tea and cupboard favourites','coffee-tea'));
    push(modules, rail('weekly-highlights','More to explore',weekly,'A broader mix from across the store'));

    const household = themed(products,/household|clean|laundry|detergent|paper|storage/,10);
    push(modules, rail('household','Household Essentials',household,'Cleaning, laundry and home basics','household'));
    if (household.length >= 2) modules.push({ id:'household-promo', type:'promotion', placement:'SUPERMARKET_HOUSEHOLD', categoryId:'household', layout:'compact' });

    push(modules, rail('personal-care','Health & Personal Care',themed(products,/personal|toiletr|shampoo|soap|oral|skin|beauty|care/,10),'Everyday personal-care essentials','personal-care'));
    push(modules, rail('family','Family & Baby',themed(products,/baby|infant|toddler|nappy|diaper/,10),'Family essentials when available','baby'));
    if (brands.length >= 4) modules.push({ id:'brands', type:'brand-rail', title:'Brands in this store', subtitle:'Browse brands available in this store', brands });
  } else if (merchantType === 'electronics') {
    modules.push({ id:'electronics-hero', type:'promotion', placement:'ELECTRONICS_HERO', layout:'hero' });
    push(modules, rail('best-tech',liveMerchandising?'Popular tech':'Featured tech',best,featuredSubtitle));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category', subtitle:'Phones, accessories, audio, computing and more' });
    push(modules, rail('mobile-accessories','Mobile Accessories Must-Haves',themed(products,/charger|cable|case|power bank|adapter|accessor|power/,10),'Everyday charging and mobile essentials','accessories'));
    modules.push({ id:'gaming-promo', type:'promotion', placement:'ELECTRONICS_GAMING', categoryId:'gaming', layout:'hero' });
    push(modules, rail('gaming','Gaming essentials',themed(products,/gaming|console|controller|game|playstation|xbox|switch/,10),'Consoles, games and accessories','gaming'));
    if (brands.length >= 4) modules.push({ id:'brands', type:'brand-rail', title:'Shop by Brand', brands });
  } else if (merchantType === 'pharmacy') {
    modules.push({ id:'store-hero', type:'promotion', placement:'STORE_HERO', layout:'hero' });
    push(modules, rail('best-wellness',liveMerchandising?'Popular wellness':'Wellness picks',best,'Health, wellness and personal care'));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category', subtitle:'Categories reflect this pharmacy’s assortment' });
    modules.push({ id:'wellness-promo', type:'promotion', placement:'PHARMACY_WELLNESS', categoryId:'wellness', layout:'compact' });
    push(modules, rail('wellness','Vitamins & Wellness',themed(products,/vitamin|supplement|wellness|nutrition|protein/,10),undefined,'wellness'));
    push(modules, rail('personal-care','Personal Care',themed(products,/personal|oral|skin|soap|shampoo|care/,10),undefined,'personal-care'));
  } else if (merchantType === 'beauty') {
    modules.push({ id:'store-hero', type:'promotion', placement:'STORE_HERO', layout:'hero' });
    push(modules, rail('best-beauty',liveMerchandising?'Beauty favourites':'Beauty picks',best,'Skincare, hair and personal care'));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category' });
    push(modules, rail('skincare','Skincare',themed(products,/skin|cleanser|serum|moistur|sunscreen|mask/,10),undefined,'skincare'));
    push(modules, rail('hair','Hair Care',themed(products,/hair|shampoo|conditioner|styling/,10),undefined,'hair'));
  } else if (merchantType === 'pet-store') {
    modules.push({ id:'store-hero', type:'promotion', placement:'STORE_HERO', layout:'hero' });
    push(modules, rail('pet-favourites',liveMerchandising?'Pet favourites':'Pet essentials',best,'Food, care and everyday pet essentials'));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category' });
    push(modules, rail('pet-food','Food & Treats',themed(products,/food|treat|nutrition|feed/,10),undefined,'food'));
    push(modules, rail('pet-care','Grooming & Care',themed(products,/groom|health|care|shampoo|flea/,10),undefined,'grooming'));
  } else if (merchantType === 'home-kitchen') {
    modules.push({ id:'store-hero', type:'promotion', placement:'STORE_HERO', layout:'hero' });
    push(modules, rail('home-favourites',liveMerchandising?'Home favourites':'Home picks',best,'Kitchen, storage and household'));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category' });
    push(modules, rail('kitchen','Kitchen',themed(products,/kitchen|cook|pan|pot|kettle|utensil/,10),undefined,'kitchen'));
    push(modules, rail('storage','Storage & Organisation',themed(products,/storage|organis|basket|container/,10),undefined,'storage'));
  } else {
    modules.push({ id:'store-hero', type:'promotion', placement:'STORE_HERO', layout:'hero' });
    push(modules, rail('popular',liveMerchandising?'Popular in this store':'Featured in this store',best,featuredSubtitle));
    modules.push({ id:'category-grid', type:'category-grid', title:'Shop by Category' });
  }

  return { schema:'kareebu.merchant.page.v1', merchantId:shop.id, merchantType, density, categories, modules };
}

export function storefrontCategoryById(plan: MerchantStorefrontPlan, id?: string | null) {
  if (!id) return undefined;
  return plan.categories.find(category => category.id === id || category.label.toLowerCase() === id.toLowerCase());
}
