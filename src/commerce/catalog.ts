import type { DemoShop } from '../demoData';

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
