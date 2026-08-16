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
  brand?: string;
  rating?: number;
  reviewCount?: number;
  stockLabel?: string;
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
  { id:'bananas', name:'Bananas', detail:'400–500 g', description:'Fresh ripe bananas selected for everyday snacking, breakfast and smoothies.', basePrice:4900, category:'Fresh produce', icon:'nutrition-outline', badge:'25% off' },
  { id:'cucumber', name:'Cucumber', detail:'400–500 g', description:'Fresh crisp cucumber, ideal for salads, sandwiches and everyday meals.', basePrice:5900, category:'Fresh produce', icon:'leaf-outline', badge:'17% off' },
  { id:'tomatoes', name:'Tomato Round', detail:'500 g', description:'Fresh round tomatoes for salads, sauces, stews and everyday cooking.', basePrice:3700, category:'Fresh produce', icon:'nutrition-outline', badge:'46% off' },

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

// KAREEBU_V6_REALISTIC_PRODUCTS
const kareebuExtraGroceryProducts: CommerceProduct[] = [
  { id:'jesa-milk-1l', name:'Jesa Fresh Milk', detail:'1 litre', description:'Fresh full-cream milk in a 1 litre pack.', basePrice:5200, category:'Dairy', icon:'water-outline', brand:'Jesa', rating:4.8, reviewCount:214, stockLabel:'In stock' },
  { id:'fresh-dairy-yoghurt', name:'Fresh Dairy Vanilla Yoghurt', detail:'500 ml', description:'Smooth vanilla yoghurt, chilled and ready to enjoy.', basePrice:7500, category:'Dairy', icon:'snow-outline', brand:'Fresh Dairy', rating:4.7, reviewCount:128, stockLabel:'In stock' },
  { id:'eggs-tray-30', name:'Grade A Eggs', detail:'Tray of 30', description:'Fresh Grade A eggs packed in a full tray.', basePrice:18000, category:'Fresh produce', icon:'ellipse-outline', rating:4.8, reviewCount:342, stockLabel:'Fresh today' },
  { id:'matooke-family', name:'Fresh Matooke', detail:'Family bunch · approx. 4–5 kg', description:'Fresh green matooke selected for everyday family meals.', basePrice:22000, category:'Fresh produce', icon:'leaf-outline', badge:'Local favourite', rating:4.9, reviewCount:267, stockLabel:'Fresh today' },
  { id:'tomatoes-1kg', name:'Fresh Tomatoes', detail:'1 kg', description:'Firm ripe tomatoes selected for cooking and salads.', basePrice:6500, category:'Fresh produce', icon:'nutrition-outline', rating:4.7, reviewCount:189, stockLabel:'Fresh today' },
  { id:'avocado-4pack', name:'Hass Avocados', detail:'Pack of 4', description:'Four ripe-ready avocados selected for quality.', basePrice:9000, category:'Fresh produce', icon:'leaf-outline', rating:4.8, reviewCount:156, stockLabel:'In stock' },
  { id:'rwenzori-water-6', name:'Rwenzori Mineral Water', detail:'6 × 1.5 litre', description:'Six large bottles of mineral water.', basePrice:14500, category:'Drinks', icon:'water-outline', brand:'Rwenzori', rating:4.9, reviewCount:411, stockLabel:'In stock' },
  { id:'mukwano-oil-3l', name:'Mukwano Vegetable Oil', detail:'3 litres', description:'Everyday vegetable cooking oil in a family-size bottle.', basePrice:28500, category:'Pantry', icon:'water-outline', brand:'Mukwano', rating:4.7, reviewCount:198, stockLabel:'In stock' },
  { id:'sugar-2kg', name:'White Sugar', detail:'2 kg', description:'Fine white granulated sugar for home use.', basePrice:11500, category:'Pantry', icon:'cube-outline', rating:4.6, reviewCount:94, stockLabel:'In stock' },
  { id:'maize-flour-2kg', name:'Premium Maize Flour', detail:'2 kg', description:'Fine maize flour for posho and everyday cooking.', basePrice:9800, category:'Pantry', icon:'basket-outline', rating:4.8, reviewCount:163, stockLabel:'In stock' },
];

const kareebuExtraPharmacyProducts: CommerceProduct[] = [
  { id:'oral-rehydration-10', name:'Oral Rehydration Salts', detail:'10 sachets', description:'Oral rehydration salts for replacing fluids and electrolytes. Use as directed.', basePrice:12000, category:'Medicines', icon:'medical-outline', rating:4.8, reviewCount:87, stockLabel:'In stock' },
  { id:'antiseptic-500', name:'Antiseptic Liquid', detail:'500 ml', description:'Multipurpose antiseptic liquid for household first-aid and hygiene use.', basePrice:18500, category:'First aid', icon:'medkit-outline', rating:4.7, reviewCount:132, stockLabel:'In stock' },
  { id:'digital-thermometer', name:'Digital Thermometer', detail:'Fast-read digital display', description:'Compact digital thermometer for home temperature checks.', basePrice:26000, category:'First aid', icon:'thermometer-outline', badge:'Useful at home', rating:4.6, reviewCount:74, stockLabel:'In stock' },
  { id:'mosquito-repellent', name:'Mosquito Repellent Spray', detail:'150 ml', description:'Everyday insect repellent spray for exposed skin and outdoor use.', basePrice:22000, category:'Personal care', icon:'shield-outline', rating:4.6, reviewCount:116, stockLabel:'In stock' },
  { id:'spf50-sunscreen', name:'SPF 50 Sunscreen', detail:'100 ml', description:'Broad-spectrum high-protection sunscreen for daily outdoor use.', basePrice:48000, category:'Skin care', icon:'sunny-outline', rating:4.7, reviewCount:91, stockLabel:'Low stock' },
  { id:'allergy-relief', name:'Allergy Relief Tablets', detail:'10 tablets', description:'Over-the-counter allergy relief. Check the pack and pharmacist advice before use.', basePrice:13500, category:'Medicines', icon:'medical-outline', rating:4.6, reviewCount:68, stockLabel:'In stock' },
];

const kareebuExtraMarketplaceProducts: CommerceProduct[] = [
  { id:'usb-c-65w', name:'65W USB-C Fast Charger', detail:'USB-C PD wall adapter', description:'Compact 65W Power Delivery charger for compatible phones, tablets and laptops.', basePrice:125000, category:'Electronics', icon:'flash-outline', badge:'Fast charge', rating:4.7, reviewCount:182, stockLabel:'In stock' },
  { id:'smartwatch-active', name:'Active Smartwatch', detail:'1.8-inch display · fitness tracking', description:'Everyday smartwatch with activity, sleep and notification features.', basePrice:165000, category:'Electronics', icon:'watch-outline', rating:4.5, reviewCount:143, stockLabel:'In stock' },
  { id:'wireless-mouse', name:'Silent Wireless Mouse', detail:'2.4 GHz · USB receiver', description:'Compact wireless mouse with quiet clicks and adjustable sensitivity.', basePrice:55000, category:'Accessories', icon:'hardware-chip-outline', rating:4.6, reviewCount:201, stockLabel:'In stock' },
  { id:'laptop-sleeve-14', name:'14-inch Laptop Sleeve', detail:'Padded water-resistant sleeve', description:'Soft-lined protective sleeve for 13–14 inch laptops.', basePrice:72000, category:'Accessories', icon:'briefcase-outline', rating:4.7, reviewCount:96, stockLabel:'In stock' },
  { id:'hdmi-2m', name:'High-Speed HDMI Cable', detail:'2 metres', description:'High-speed HDMI cable for TVs, monitors and game consoles.', basePrice:32000, category:'Accessories', icon:'link-outline', rating:4.6, reviewCount:118, stockLabel:'In stock' },
  { id:'mini-fan-rechargeable', name:'Rechargeable Mini Fan', detail:'USB-C · 3 speeds', description:'Portable rechargeable fan with three speed settings.', basePrice:68000, category:'Electronics', icon:'sync-circle-outline', rating:4.5, reviewCount:84, stockLabel:'In stock' },
];

const kareebuExtraBeautyProducts: CommerceProduct[] = [
  { id:'body-lotion-400', name:'Deep Moisture Body Lotion', detail:'400 ml', description:'Everyday body lotion for long-lasting moisturisation.', basePrice:36000, category:'Body care', icon:'water-outline', rating:4.8, reviewCount:224, stockLabel:'In stock' },
  { id:'gentle-shampoo-400', name:'Gentle Daily Shampoo', detail:'400 ml', description:'Everyday cleansing shampoo for regular hair care.', basePrice:32000, category:'Hair care', icon:'sparkles-outline', rating:4.6, reviewCount:138, stockLabel:'In stock' },
  { id:'conditioner-400', name:'Moisture Conditioner', detail:'400 ml', description:'Conditioning care for softer, easier-to-manage hair.', basePrice:34000, category:'Hair care', icon:'water-outline', rating:4.6, reviewCount:112, stockLabel:'In stock' },
  { id:'lip-balm-spf', name:'Moisture Lip Balm', detail:'4.8 g', description:'Pocket-size moisturising lip care for everyday use.', basePrice:12000, category:'Personal care', icon:'heart-outline', rating:4.7, reviewCount:173, stockLabel:'In stock' },
  { id:'roll-on-deodorant', name:'Fresh Roll-on Deodorant', detail:'50 ml', description:'Everyday roll-on deodorant with a clean fresh scent.', basePrice:15500, category:'Personal care', icon:'sparkles-outline', rating:4.6, reviewCount:154, stockLabel:'In stock' },
  { id:'face-spf-moisturiser', name:'Daily Face Moisturiser SPF 30', detail:'50 ml', description:'Light daily facial moisturiser with broad-spectrum sun protection.', basePrice:52000, category:'Skin care', icon:'sunny-outline', badge:'Daily essential', rating:4.8, reviewCount:119, stockLabel:'In stock' },
];

export function commerceProductsFor(store: DemoShop): CommerceProduct[] {
  if (store.category === 'Pharmacy' || store.category === 'Nutrition' || store.category === 'Eye care') return [...pharmacyProducts, ...kareebuExtraPharmacyProducts];
  if (store.category === 'Groceries') return [...groceryProducts, ...kareebuExtraGroceryProducts];
  if (store.category === 'Marketplace' || store.category === 'Electronics') return [...marketplaceProducts, ...kareebuExtraMarketplaceProducts];
  if (store.category === 'Beauty') return [...beautyProducts, ...kareebuExtraBeautyProducts];
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
  const brand = productBrands[product.id] ?? (product.brand ? { name:product.brand, manufacturer:product.brand, origin:'As labelled on product' } : { name:'Kareebu Marketplace', manufacturer:'Marketplace seller', origin:'Varies by seller' });
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
    averageRating:product.rating ?? (isElectronic ? 4.5 : isMedicine ? 4.7 : 4.6),
    ratingCount:product.reviewCount ?? (isElectronic ? 184 : isMedicine ? 92 : 236),
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
