import type { ImageSourcePropType } from 'react-native';

const A = {
  v9Appliances: require('../../assets/kareebu-plus/realistic-v9/appliances.jpg'),
  v9Audio: require('../../assets/kareebu-plus/realistic-v9/audio.jpg'),
  v9Baby: require('../../assets/kareebu-plus/realistic-v9/baby-child.jpg'),
  v9Beauty: require('../../assets/kareebu-plus/realistic-v9/beauty.jpg'),
  v9BeautyProducts: require('../../assets/kareebu-plus/realistic-v9/beauty-products.jpg'),
  v9ColdFlu: require('../../assets/kareebu-plus/realistic-v9/cold-flu.jpg'),
  v9Computing: require('../../assets/kareebu-plus/realistic-v9/computing.jpg'),
  v9Fashion: require('../../assets/kareebu-plus/realistic-v9/fashion.jpg'),
  v9FashionKids: require('../../assets/kareebu-plus/realistic-v9/fashion-kids.jpg'),
  v9FirstAid: require('../../assets/kareebu-plus/realistic-v9/first-aid.jpg'),
  v9Fragrance: require('../../assets/kareebu-plus/realistic-v9/fragrance.jpg'),
  v9Gaming: require('../../assets/kareebu-plus/realistic-v9/gaming.jpg'),
  v9Hair: require('../../assets/kareebu-plus/realistic-v9/haircare.jpg'),
  v9Medicines: require('../../assets/kareebu-plus/realistic-v9/medicines-health.jpg'),
  v9Pain: require('../../assets/kareebu-plus/realistic-v9/pain-relief.jpg'),
  v9Personal: require('../../assets/kareebu-plus/realistic-v9/personal-care.jpg'),
  v9Pets: require('../../assets/kareebu-plus/realistic-v9/pet-supplies.jpg'),
  v9Phones: require('../../assets/kareebu-plus/realistic-v9/phones.jpg'),
  v9Power: require('../../assets/kareebu-plus/realistic-v9/power.jpg'),
  v9Shoes: require('../../assets/kareebu-plus/realistic-v9/shoes.jpg'),
  v9Skincare: require('../../assets/kareebu-plus/realistic-v9/skincare.jpg'),
  v9Tvs: require('../../assets/kareebu-plus/realistic-v9/tvs.jpg'),
  v9Vitamins: require('../../assets/kareebu-plus/realistic-v9/vitamins-supplements.jpg'),
  v9Accessories: require('../../assets/kareebu-plus/realistic-v9/accessories.jpg'),
  v9Allergy: require('../../assets/kareebu-plus/realistic-v9/allergy.jpg'),
  v9Digestive: require('../../assets/kareebu-plus/realistic-v9/digestive-health.jpg'),
  v9HomeHealth: require('../../assets/kareebu-plus/realistic-v9/home-health.jpg'),
  v9Laundry: require('../../assets/kareebu-plus/realistic-v9/laundry.jpg'),
  v9Handyman: require('../../assets/kareebu-plus/realistic-v9/handyman.png'),
  v9Pest: require('../../assets/kareebu-plus/realistic-v9/pest-control.jpg'),
  v9HomeStorage: require('../../assets/kareebu-plus/realistic-v9/home-storage.png'),
  v9Sports: require('../../assets/kareebu-plus/realistic-v9/sports.jpg'),
  v9Automotive: require('../../assets/kareebu-plus/realistic-v9/automotive.png'),
  v9Books: require('../../assets/kareebu-plus/realistic-v9/books-stationery.jpg'),
  v9Kitchen: require('../../assets/kareebu-plus/realistic-v9/kitchen.jpg'),
  v9HomeDecor: require('../../assets/kareebu-plus/realistic-v9/home-decor.jpg'),
  v9Toys: require('../../assets/kareebu-plus/realistic-v9/toys.png'),
  shops: require('../../assets/kareebu-plus/lifestyle-cutouts/service-shops.png'),
  phones: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-phones.png'),
  computing: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-computing.png'),
  tv: require('../../assets/kareebu-plus/lifestyle-cutouts/electronics-tv.png'),
  groceries: require('../../assets/kareebu-plus/lifestyle-cutouts/service-groceries.png'),
  fresh: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fresh-food.png'),
  bananas: require('../../assets/kareebu-plus/top-picks/bananas.png'),
  tomatoes: require('../../assets/kareebu-plus/top-picks/tomatoes.png'),
  cucumber: require('../../assets/kareebu-plus/top-picks/cucumber.png'),
  chicken: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-chicken.png'),
  beef: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-beef.png'),
  goat: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-goat.png'),
  fish: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-fish.png'),
  seafood: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-seafood.png'),
  dairy: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-dairy-eggs.png'),
  bakery: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-bakery.png'),
  drinks: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-drinks.png'),
  snacks: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-snacks.png'),
  staples: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-cooking-staples.png'),
  cleaning: require('../../assets/kareebu-plus/lifestyle-cutouts/grocery-household-cleaning.png'),
  vitamins: require('../../assets/kareebu-plus/lifestyle-cutouts/pharmacy-vitamins.png'),
  fitness: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png'),
  toys: require('../../assets/kareebu-plus/global/products/building-set.png'),
  flowers: require('../../assets/kareebu-plus/top-offers/category-flowers.jpg'),
  kitchen: require('../../assets/kareebu-plus/top-offers/offer-kitchen.jpg'),
  homeKit: require('../../assets/kareebu-plus/global/products/home-organisation-kit.png'),
  trainers: require('../../assets/kareebu-plus/global/products/trainers.png'),
  headphones: require('../../assets/kareebu-plus/global/products/headphones.png'),
  skincare: require('../../assets/kareebu-plus/global/products/skincare-set.png'),
} as const;

const BACKGROUNDS = ['#F7F3EA', '#FFF8DD', '#F4F7F3', '#F6F3F8', '#EEF4FA', '#FFF1EE'] as const;

type ProductVisualPool = { images: readonly ImageSourcePropType[] };

function stableHash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function choose<T>(items: readonly T[], seed: string): T | undefined {
  return items.length ? items[stableHash(seed) % items.length] : undefined;
}

/**
 * Product media is deliberately conservative. A missing semantic asset becomes
 * a vector fallback; it never borrows a photograph from a neighbouring family.
 */
function poolFor(haystack: string): ProductVisualPool {
  const value = haystack.toLowerCase();

  if (/headphone|earbud|audio|speaker|soundbar/.test(value)) return { images:[A.v9Audio] };
  if (/phone|smartphone|charger|cable|power bank|powerbank|mobile/.test(value)) return { images:[A.v9Phones] };
  if (/laptop|computer|monitor|keyboard|mouse|storage|ssd|desktop|printer|office tech/.test(value)) return { images:[A.v9Computing] };
  if (/tv|television|projector|streaming/.test(value)) return { images:[A.v9Tvs] };
  if (/appliance|microwave|kettle|cooker|iron|fan|home tech/.test(value)) return { images:[A.v9Appliances] };

  if (/beef|steak|meat|butcher/.test(value)) return { images:[A.beef] };
  if (/goat|mutton|lamb/.test(value)) return { images:[A.goat] };
  if (/chicken|poultry/.test(value)) return { images:[A.chicken] };
  if (/fish|tilapia/.test(value)) return { images:[A.fish] };
  if (/seafood|prawn|shrimp/.test(value)) return { images:[A.seafood] };
  if (/dairy|milk|egg|cheese|yoghurt|yogurt/.test(value)) return { images:[A.dairy] };
  if (/bread|bakery|pastry|cake|cereal|breakfast/.test(value)) return { images:[A.bakery] };
  if (/drink|water|juice|soda|coffee|tea/.test(value)) return { images:[A.drinks] };
  if (/snack|sweet|chocolate|crisps|biscuit/.test(value)) return { images:[A.snacks] };
  if (/rice|pasta|flour|oil|spice|cooking|pantry|staple/.test(value)) return { images:[A.staples] };
  if (/tomato/.test(value)) return { images:[A.tomatoes] };
  if (/banana|plantain/.test(value)) return { images:[A.bananas] };
  if (/cucumber|courgette|zucchini/.test(value)) return { images:[A.cucumber] };
  if (/spinach|lettuce|kale|greens|cabbage|sukuma|herb|coriander|parsley|basil|mint/.test(value)) return { images:[A.fresh] };
  if (/onion|garlic|ginger|carrot|potato|yam|cassava|beet|root/.test(value)) return { images:[A.staples] };
  if (/pepper|chilli|chili/.test(value)) return { images:[A.tomatoes] };
  if (/mushroom/.test(value)) return { images:[A.fresh] };
  if (/fruit|vegetable|produce|fresh/.test(value)) return { images:[A.fresh] };
  if (/laundry|washing powder|fabric care/.test(value)) return { images:[A.v9Laundry] };
  if (/clean|detergent|household/.test(value)) return { images:[A.cleaning] };
  if (/grocery|groceries|supermarket/.test(value)) return { images:[A.groceries] };

  if (/allergy|antihistamine|hay fever/.test(value)) return { images:[A.v9Allergy] };
  if (/digestive|indigestion|heartburn|stomach|probiotic/.test(value)) return { images:[A.v9Digestive] };
  if (/home health|monitor|thermometer|blood pressure/.test(value)) return { images:[A.v9HomeHealth] };
  if (/vitamin|mineral|supplement|protein|nutrition|wellness/.test(value)) return { images:[A.v9Vitamins] };
  if (/pain|analgesic|ibuprofen|paracetamol/.test(value)) return { images:[A.v9Pain] };
  if (/cold|flu|cough|decongest/.test(value)) return { images:[A.v9ColdFlu] };
  if (/first aid|bandage|plaster|antiseptic/.test(value)) return { images:[A.v9FirstAid] };
  if (/medicine|tablet|capsule|prescription|pharmacy/.test(value)) return { images:[A.v9Medicines] };
  if (/makeup|cosmetic/.test(value)) return { images:[A.v9Beauty] };
  if (/fragrance|perfume|cologne/.test(value)) return { images:[A.v9Fragrance] };
  if (/hair|groom/.test(value)) return { images:[A.v9Hair] };
  if (/skin|serum|moistur|sunscreen|beauty/.test(value)) return { images:[A.v9Skincare] };
  if (/tooth|oral|personal care|body care/.test(value)) return { images:[A.v9Personal] };
  if (/baby|nappy|diaper|nursery|feeding/.test(value)) return { images:[A.v9Baby] };

  if (/(kids|children).*(dress|shirt|jean|trouser|jacket|fashion|clothing|apparel)|(dress|shirt|jean|trouser|jacket|fashion|clothing|apparel).*(kids|children)/.test(value)) return { images:[A.v9FashionKids] };
  if (/dress|shirt|jean|trouser|jacket|fashion|clothing|apparel/.test(value)) return { images:[A.v9Fashion] };
  if (/shoe|trainer|sneaker|running/.test(value)) return { images:[A.v9Shoes] };
  if (/bag|watch|jewell|sunglass|belt|accessor|wearable/.test(value)) return { images:[A.v9Accessories] };
  if (/sport|fitness|gym|football|cycling|yoga/.test(value)) return { images:[A.v9Sports] };
  if (/toy|game|puzzle|play/.test(value)) return { images:[A.v9Toys] };
  if (/flower/.test(value)) return { images:[A.flowers] };
  if (/gift|hamper|occasion/.test(value)) return { images:[A.v9Accessories] };
  if (/kitchen|cookware|utensil/.test(value)) return { images:[A.v9Kitchen] };
  if (/storage|organisation|organizer/.test(value)) return { images:[A.v9HomeStorage] };
  if (/decor|furniture|bedding|bathroom|home/.test(value)) return { images:[A.v9HomeDecor] };
  if (/pet|dog|cat|animal/.test(value)) return { images:[A.v9Pets] };
  if (/book|stationery|school|pen|notebook|study|office/.test(value)) return { images:[A.v9Books] };
  if (/automotive|car care|vehicle|motor/.test(value)) return { images:[A.v9Automotive] };

  return { images:[] };
}

export type ProductVisualInput = {
  id?: string;
  name: string;
  category?: string;
  subcategory?: string;
  detail?: string;
  brand?: string;
  imageKey?: string;
  storeCategory?: string;
};

export type ProductVisual = {
  image?: ImageSourcePropType;
  background: string;
  visualSeed: number;
  qualityStatus: 'production-ready' | 'temporary-fallback';
};

export function commerceProductVisual(input: ProductVisualInput): ProductVisual {
  const identity = `${input.id ?? ''} ${input.name} ${input.category ?? ''} ${input.subcategory ?? ''} ${input.detail ?? ''} ${input.brand ?? ''} ${input.imageKey ?? ''} ${input.storeCategory ?? ''}`;
  const pool = poolFor(identity);
  const hash = stableHash(identity);
  const image = choose(pool.images, identity);
  return {
    image,
    background: BACKGROUNDS[hash % BACKGROUNDS.length]!,
    visualSeed: hash,
    qualityStatus: image ? 'production-ready' : 'temporary-fallback',
  };
}
