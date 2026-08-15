import type { DemoShop } from '../demoData';
import type { ProductMetadata } from '../catalog/types';

export type CommerceProduct = {
  id: string;
  name: string;
  detail: string;
  description: string;
  basePrice: number;
  category: string;
  icon: string;
  badge?: string;
  variants?: Array<{ id: string; label: string; priceDelta: number }>;
  prescriptionRequired?: boolean;
};

const pharmacyProducts: CommerceProduct[] = [
  { id:'vitamin-c', name:'Vitamin C 1000mg', detail:'30 tablets', description:'Daily vitamin C supplement for everyday wellness.', basePrice:18000, category:'Vitamins', icon:'medical-outline', badge:'Popular', variants:[{id:'30',label:'30 tablets',priceDelta:0},{id:'60',label:'60 tablets',priceDelta:14000}] },
  { id:'pain-relief', name:'Pain relief tablets', detail:'16 tablets', description:'Everyday over-the-counter pain relief.', basePrice:8500, category:'Medicines', icon:'medkit-outline', variants:[{id:'16',label:'16 tablets',priceDelta:0},{id:'32',label:'32 tablets',priceDelta:6500}] },
  { id:'first-aid', name:'First aid essentials', detail:'Home kit', description:'Bandages, wipes, gauze and everyday first-aid essentials.', basePrice:24000, category:'First aid', icon:'medkit-outline', badge:'Bundle' },
  { id:'prescription-request', name:'Prescription medicine request', detail:'Upload prescription at checkout', description:'Request a prescription-only medicine from the pharmacy team.', basePrice:12000, category:'Prescription', icon:'document-attach-outline', prescriptionRequired:true },
  { id:'baby-care', name:'Baby care essentials', detail:'Gentle everyday care', description:'Baby wash, wipes and skin-care essentials.', basePrice:28000, category:'Baby', icon:'heart-outline' },
  { id:'skin-care', name:'Skin care picks', detail:'Cleanse & moisturise', description:'Everyday cleansing and moisturising care.', basePrice:35000, category:'Skin care', icon:'water-outline' },
  { id:'oral-care', name:'Oral care pack', detail:'Brush, paste & rinse', description:'Complete everyday oral-care bundle.', basePrice:22000, category:'Personal care', icon:'medical-outline' },
];

const groceryProducts: CommerceProduct[] = [
  { id:'milk', name:'Fresh milk', detail:'1 litre', description:'Fresh full-cream milk.', basePrice:4500, category:'Dairy', icon:'water-outline', variants:[{id:'1l',label:'1 litre',priceDelta:0},{id:'2l',label:'2 litres',priceDelta:4000}] },
  { id:'bread', name:'Fresh bread', detail:'Family loaf', description:'Soft freshly baked family loaf.', basePrice:5500, category:'Bakery', icon:'restaurant-outline' },
  { id:'rice', name:'Premium rice', detail:'2 kg bag', description:'Long-grain premium rice.', basePrice:16000, category:'Pantry', icon:'basket-outline', variants:[{id:'2kg',label:'2 kg',priceDelta:0},{id:'5kg',label:'5 kg',priceDelta:19000}] },
  { id:'oil', name:'Cooking oil', detail:'2 litre bottle', description:'Vegetable cooking oil for everyday meals.', basePrice:18000, category:'Pantry', icon:'water-outline' },
  { id:'fruit', name:'Fresh fruit basket', detail:'Seasonal selection', description:'A mixed seasonal fruit basket selected fresh.', basePrice:24000, category:'Fresh produce', icon:'nutrition-outline', badge:'Fresh' },
  { id:'vegetables', name:'Vegetable basket', detail:'Mixed fresh produce', description:'Tomatoes, onions, greens, peppers and seasonal vegetables.', basePrice:22000, category:'Fresh produce', icon:'leaf-outline' },
  { id:'home', name:'Home essentials pack', detail:'Cleaning & household', description:'Cleaning and household basics in one basket.', basePrice:38000, category:'Household', icon:'home-outline' },
  { id:'water', name:'Drinking water', detail:'6 × 1.5L', description:'Six-pack of bottled drinking water.', basePrice:12000, category:'Drinks', icon:'water-outline' },
];

const marketplaceProducts: CommerceProduct[] = [
  { id:'power-bank', name:'20,000mAh power bank', detail:'Fast-charge portable battery', description:'High-capacity USB-C portable battery.', basePrice:85000, category:'Electronics', icon:'battery-charging-outline', badge:'Best seller' },
  { id:'earbuds', name:'Wireless earbuds', detail:'Compact everyday audio', description:'Bluetooth earbuds with charging case.', basePrice:72000, category:'Electronics', icon:'headset-outline', variants:[{id:'black',label:'Black',priceDelta:0},{id:'white',label:'White',priceDelta:0}] },
  { id:'charger', name:'Fast wall charger', detail:'USB-C charging adapter', description:'Fast USB-C wall charger.', basePrice:45000, category:'Electronics', icon:'flash-outline' },
  { id:'cable', name:'USB-C cable', detail:'Durable charging cable', description:'Braided USB-C charging/data cable.', basePrice:22000, category:'Electronics', icon:'link-outline' },
  { id:'phone-case', name:'Protective phone case', detail:'Shock-resistant cover', description:'Protective shock-resistant phone case.', basePrice:30000, category:'Accessories', icon:'phone-portrait-outline' },
  { id:'speaker', name:'Portable speaker', detail:'Bluetooth audio', description:'Compact portable Bluetooth speaker.', basePrice:95000, category:'Electronics', icon:'volume-high-outline' },
];

const beautyProducts: CommerceProduct[] = [
  { id:'cleanser', name:'Gentle face cleanser', detail:'200ml', description:'Daily gentle facial cleanser.', basePrice:28000, category:'Skin care', icon:'water-outline' },
  { id:'moisturiser', name:'Daily moisturiser', detail:'50ml', description:'Lightweight daily face moisturiser.', basePrice:36000, category:'Skin care', icon:'sparkles-outline' },
  { id:'body-care', name:'Body care bundle', detail:'Wash + lotion', description:'Body wash and moisturising lotion bundle.', basePrice:42000, category:'Body care', icon:'heart-outline', badge:'Bundle' },
  { id:'hair-care', name:'Hair care duo', detail:'Shampoo + conditioner', description:'Everyday shampoo and conditioner duo.', basePrice:39000, category:'Hair care', icon:'cut-outline' },
];

export function commerceProductsFor(store: DemoShop): CommerceProduct[] {
  if (store.category === 'Pharmacy' || store.category === 'Nutrition' || store.category === 'Eye care') return pharmacyProducts;
  if (store.category === 'Groceries') return groceryProducts;
  if (store.category === 'Marketplace' || store.category === 'Electronics') return marketplaceProducts;
  if (store.category === 'Beauty') return beautyProducts;
  return [...groceryProducts.slice(0,4), ...marketplaceProducts.slice(0,4)];
}

export function commerceProductFor(store: DemoShop, productId: string | null) {
  const products = commerceProductsFor(store);
  return products.find((item) => item.id === productId) ?? products[0]!;
}


const productBrands: Record<string, { name: string; manufacturer?: string; origin?: string }> = {
  'vitamin-c': { name:'NutriCare', manufacturer:'NutriCare Health Labs', origin:'United Kingdom' },
  'pain-relief': { name:'MediChoice', manufacturer:'MediChoice Healthcare', origin:'Kenya' },
  'first-aid': { name:'SafeHome', manufacturer:'SafeHome Medical Supplies', origin:'Kenya' },
  'prescription-request': { name:'Pharmacy fulfilment', manufacturer:'Dispensed by selected pharmacy', origin:'Varies by medicine' },
  'baby-care': { name:'LittleCare', manufacturer:'LittleCare Consumer Health', origin:'South Africa' },
  'skin-care': { name:'DermaDaily', manufacturer:'DermaDaily Laboratories', origin:'South Africa' },
  'oral-care': { name:'BrightSmile', manufacturer:'BrightSmile Consumer Care', origin:'Kenya' },
  milk: { name:'FreshFields', manufacturer:'FreshFields Dairy', origin:'Uganda' },
  bread: { name:'Daily Bake', manufacturer:'Daily Bake Foods', origin:'Uganda' },
  rice: { name:'Kareebu Select', manufacturer:'Kareebu Select Foods', origin:'Tanzania' },
  oil: { name:'Golden Drop', manufacturer:'Golden Drop Foods', origin:'Uganda' },
  fruit: { name:'Fresh Market', manufacturer:'Local produce partners', origin:'Uganda' },
  vegetables: { name:'Fresh Market', manufacturer:'Local produce partners', origin:'Uganda' },
  home: { name:'HomePlus', manufacturer:'HomePlus Consumer Goods', origin:'Kenya' },
  water: { name:'ClearSpring', manufacturer:'ClearSpring Beverages', origin:'Uganda' },
  'power-bank': { name:'VoltEdge', manufacturer:'VoltEdge Electronics', origin:'China' },
  earbuds: { name:'VoltEdge', manufacturer:'VoltEdge Electronics', origin:'China' },
  charger: { name:'VoltEdge', manufacturer:'VoltEdge Electronics', origin:'China' },
  cable: { name:'VoltEdge', manufacturer:'VoltEdge Electronics', origin:'China' },
  'phone-case': { name:'CaseWorks', manufacturer:'CaseWorks Accessories', origin:'China' },
  speaker: { name:'SoundArc', manufacturer:'SoundArc Electronics', origin:'China' },
  cleanser: { name:'GlowLab', manufacturer:'GlowLab Skin Science', origin:'South Africa' },
  moisturiser: { name:'GlowLab', manufacturer:'GlowLab Skin Science', origin:'South Africa' },
  'body-care': { name:'GlowLab', manufacturer:'GlowLab Skin Science', origin:'South Africa' },
  'hair-care': { name:'Root & Bloom', manufacturer:'Root & Bloom Beauty', origin:'South Africa' },
};

const longDescriptions: Record<string, string> = {
  'vitamin-c':'A high-strength vitamin C food supplement designed for convenient daily use. The tablet format makes it easy to keep a consistent routine, with pack sizes selectable before adding to basket.',
  'pain-relief':'An everyday over-the-counter pain-relief product supplied in sealed retail packaging. Always read the label and follow the dosing instructions supplied with the medicine.',
  'first-aid':'A practical home first-aid bundle containing commonly used dressing and cleaning essentials for minor everyday incidents. Contents are packed together for convenient storage.',
  'prescription-request':'Use this listing to request a prescription-only medicine from a participating pharmacy. The final medicine, manufacturer, dosage, price and availability are confirmed after a valid prescription is reviewed.',
  milk:'Fresh full-cream dairy milk for drinking, breakfast and cooking. Keep refrigerated and use by the date printed on the pack.',
  bread:'A soft family loaf baked for everyday sandwiches, toast and breakfast. Store sealed in a cool, dry place after opening.',
  rice:'Long-grain rice suitable for everyday meals, pilau, curries and side dishes. Available in multiple pack sizes so the basket price follows the selected weight.',
  oil:'Refined vegetable cooking oil for frying, roasting and general food preparation. Supplied in a sealed bottle with the pack size shown before purchase.',
  'power-bank':'A high-capacity portable USB-C battery designed for phones and compatible mobile devices. The product page includes capacity, dimensions, warranty and charging information before checkout.',
  earbuds:'Compact Bluetooth earbuds supplied with a charging case. Choose the available finish before adding to basket and review compatibility, warranty and package information below.',
  cleanser:'A gentle everyday facial cleanser designed to remove surface oil, dirt and daily build-up without an abrasive scrub. Review the ingredient and care information before purchase.',
  moisturiser:'A lightweight daily facial moisturiser intended for routine skin hydration. Pack size, ingredients and care information are shown below for easier comparison.',
};

function codeFor(prefix: string, id: string) {
  return `${prefix}-${id.toUpperCase().replace(/[^A-Z0-9]+/g,'-')}`;
}

export function commerceLongDescriptionFor(product: CommerceProduct) {
  return longDescriptions[product.id] ?? `${product.description} This listing includes the product's brand, pack information, seller details, availability and relevant product specifications so you can review them before adding it to your basket.`;
}

export function commerceProductMetadataFor(product: CommerceProduct): ProductMetadata {
  const brand = productBrands[product.id] ?? { name:'Kareebu Marketplace', manufacturer:'Marketplace seller', origin:'Varies by seller' };
  const isFood = ['Dairy','Bakery','Pantry','Fresh produce','Drinks'].includes(product.category);
  const isMedicine = ['Vitamins','Medicines','Prescription','First aid'].includes(product.category);
  const isElectronic = product.category === 'Electronics' || product.category === 'Accessories';
  const isBeauty = ['Skin care','Body care','Hair care','Personal care','Baby'].includes(product.category);
  const stock = product.id === 'prescription-request' ? undefined : isFood ? 34 : isElectronic ? 12 : 21;
  const common: ProductMetadata = {
    brand:{ id:`brand-${brand.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`, name:brand.name },
    manufacturer:brand.manufacturer,
    countryOfOrigin:brand.origin,
    sku:codeFor('KRB',product.id),
    barcode:`600${String(product.id.split('').reduce((n,c)=>n+c.charCodeAt(0),0)).padStart(10,'0')}`.slice(0,13),
    unitValue:product.detail,
    unitType:isFood ? (product.detail.toLowerCase().includes('kg') ? 'kg' : product.detail.toLowerCase().includes('litre') || product.detail.toLowerCase().includes('ml') ? 'volume' : 'pack') : 'item',
    stock,
    maximumCartQuantity:isMedicine ? 4 : isElectronic ? 5 : 12,
    averageRating:isElectronic ? 4.5 : isMedicine ? 4.7 : 4.6,
    ratingCount:isElectronic ? 184 : isMedicine ? 92 : 236,
    verifiedSeller:true,
    freeDelivery:product.basePrice >= 60000,
    taxRatePercent:18,
    prescriptionRequired:product.prescriptionRequired,
    returnPolicy:isFood || isMedicine ? 'Return eligibility depends on product condition and safety rules.' : 'Eligible unused items can be returned under the seller return policy.',
  };
  if (isElectronic) return {
    ...common,
    netWeight:product.id === 'power-bank' ? '420 g' : product.id === 'speaker' ? '610 g' : '95 g',
    dimensions:product.id === 'power-bank' ? {length:15.2,width:7.1,height:2.8,unit:'cm'} : {length:10.2,width:8.4,height:4.1,unit:'cm'},
    warranty:'12-month seller/manufacturer warranty',
    careInstructions:'Keep dry. Use compatible charging accessories and follow the supplied safety instructions.',
  };
  if (isMedicine) return {
    ...common,
    genericNames:product.id === 'vitamin-c' ? ['Ascorbic acid'] : product.id === 'pain-relief' ? ['Analgesic / pain relief medicine'] : undefined,
    storageInstructions:'Store in a cool, dry place away from direct sunlight and out of reach of children.',
    allergens:product.id === 'vitamin-c' ? ['Check pack for excipients and allergen declarations'] : undefined,
  };
  if (isBeauty) return {
    ...common,
    netWeight:product.detail,
    ingredients:['See full ingredient declaration on the retail pack','Fragrance and preservative content varies by selected product'],
    allergens:['Patch-test if you have known skin sensitivities'],
    careInstructions:'For external use only. Follow the directions printed on the product packaging.',
  };
  if (isFood) {
    const facts = product.id === 'milk'
      ? [{label:'Energy',value:'~64 kcal / 100 ml'},{label:'Protein',value:'~3.3 g'},{label:'Fat',value:'~3.6 g'},{label:'Carbohydrate',value:'~4.7 g'}]
      : product.id === 'rice'
      ? [{label:'Energy',value:'~350 kcal / 100 g'},{label:'Protein',value:'~7 g'},{label:'Carbohydrate',value:'~78 g'},{label:'Fat',value:'<1 g'}]
      : undefined;
    return {
      ...common,
      organic:['fruit','vegetables'].includes(product.id),
      vegetarian:true,
      nutritionFacts:facts,
      nutritionSummary:facts ? undefined : ['Nutrition varies by pack and supplier; see the retail label for the final declaration.'],
      ingredients:product.id === 'bread' ? ['Wheat flour','Water','Yeast','Salt'] : product.id === 'oil' ? ['Refined vegetable oil'] : undefined,
      allergens:product.id === 'milk' ? ['Milk'] : product.id === 'bread' ? ['Wheat / gluten'] : undefined,
      storageInstructions:['milk'].includes(product.id) ? 'Keep refrigerated.' : 'Store in a cool, dry place unless the pack says otherwise.',
    };
  }
  return common;
}
