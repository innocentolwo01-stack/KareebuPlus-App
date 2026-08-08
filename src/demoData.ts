export type FoodImageKey = 'cafeJavas' | 'chickenTonight' | 'tamaraThai';
export type RestaurantCategory = 'Burgers' | 'Chicken' | 'Pizza' | 'Local dishes' | 'Grills' | 'Healthy' | 'Desserts' | 'Coffee';

export type DemoMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: FoodImageKey;
  popular?: boolean;
  badge?: string;
};

export type DemoRestaurant = {
  id: string;
  name: string;
  cuisine: string;
  image: FoodImageKey;
  rating: number;
  reviews: string;
  eta: string;
  deliveryFee: number;
  distance: string;
  offer?: string;
  plus?: boolean;
  categories: RestaurantCategory[];
  menu: DemoMenuItem[];
};

const javasMenu: DemoMenuItem[] = [
  { id:'javas-breakfast', name:'Javas Big Breakfast', description:'Eggs, beef sausage, baked beans, potatoes, toast and fresh fruit.', price:18000, category:'Breakfast', image:'cafeJavas', popular:true, badge:'Popular' },
  { id:'javas-rolex', name:'Breakfast Rolex', description:'Two eggs, vegetables and avocado rolled in a warm chapati.', price:12000, category:'Breakfast', image:'cafeJavas' },
  { id:'javas-pancakes', name:'Banana Pancakes', description:'Fluffy pancakes with banana, honey and seasonal fruit.', price:14000, category:'Breakfast', image:'tamaraThai' },
  { id:'javas-chicken-sandwich', name:'Grilled Chicken Sandwich', description:'Grilled chicken breast, lettuce, tomato, cheese and house sauce.', price:18500, category:'Burgers & sandwiches', image:'chickenTonight', popular:true },
  { id:'javas-beef-burger', name:'Classic Beef Burger', description:'Beef patty, cheddar, caramelised onions, lettuce and fries.', price:22000, category:'Burgers & sandwiches', image:'cafeJavas', badge:'20% off' },
  { id:'javas-club', name:'Javas Club Sandwich', description:'Chicken, egg, beef bacon, tomato and lettuce with fries.', price:21500, category:'Burgers & sandwiches', image:'cafeJavas' },
  { id:'javas-chicken-curry', name:'Creamy Chicken Curry', description:'Chicken curry served with steamed rice and kachumbari.', price:24000, category:'Mains', image:'tamaraThai' },
  { id:'javas-tilapia', name:'Grilled Tilapia Fillet', description:'Tilapia fillet, lemon herb sauce, vegetables and chips.', price:28500, category:'Mains', image:'chickenTonight' },
  { id:'javas-goat', name:'Goat Stew & Matooke', description:'Slow-cooked goat stew with matooke and greens.', price:26000, category:'Local favourites', image:'chickenTonight', popular:true },
  { id:'javas-latte', name:'Iced Vanilla Latte', description:'Espresso, chilled milk, vanilla and ice.', price:9500, category:'Drinks', image:'tamaraThai' },
  { id:'javas-passion', name:'Fresh Passion Juice', description:'Freshly blended passion fruit juice.', price:7000, category:'Drinks', image:'tamaraThai' },
  { id:'javas-cake', name:'Chocolate Fudge Cake', description:'Rich chocolate sponge with warm fudge sauce.', price:11000, category:'Desserts', image:'cafeJavas' },
  { id:'javas-cheesecake', name:'Berry Cheesecake', description:'Creamy cheesecake with berry compote.', price:12500, category:'Desserts', image:'tamaraThai' },
];

const chickenMenu: DemoMenuItem[] = [
  { id:'ct-quarter', name:'Quarter Chicken Meal', description:'Flame-grilled chicken, chips, coleslaw and chilli sauce.', price:16500, category:'Chicken', image:'chickenTonight', popular:true, badge:'Best seller' },
  { id:'ct-half', name:'Half Chicken Meal', description:'Half flame-grilled chicken with your choice of two sides.', price:26000, category:'Chicken', image:'chickenTonight' },
  { id:'ct-family', name:'Family Chicken Feast', description:'Whole chicken, large chips, salad, four rolls and sauces.', price:52000, category:'Sharing', image:'chickenTonight', badge:'Save UGX 8,000' },
  { id:'ct-wings6', name:'6 Spicy Wings', description:'Crispy wings tossed in house chilli glaze.', price:14500, category:'Chicken', image:'chickenTonight' },
  { id:'ct-wings12', name:'12 Spicy Wings', description:'Twelve crispy wings with two dipping sauces.', price:26000, category:'Chicken', image:'chickenTonight' },
  { id:'ct-wrap', name:'Grilled Chicken Wrap', description:'Chicken strips, lettuce, tomato, slaw and garlic mayo.', price:15500, category:'Wraps', image:'cafeJavas' },
  { id:'ct-burger', name:'Crunchy Chicken Burger', description:'Crispy chicken fillet, cheese, slaw and spicy mayo.', price:17500, category:'Burgers', image:'cafeJavas', popular:true },
  { id:'ct-rice', name:'Chicken Pilau Bowl', description:'Spiced pilau rice, grilled chicken, kachumbari and avocado.', price:19000, category:'Bowls', image:'tamaraThai' },
  { id:'ct-chips', name:'Loaded Chicken Chips', description:'Chips topped with chopped chicken, cheese and house sauce.', price:16000, category:'Sides', image:'chickenTonight' },
  { id:'ct-salad', name:'Grilled Chicken Salad', description:'Greens, tomato, cucumber, avocado and grilled chicken.', price:17000, category:'Healthy', image:'tamaraThai' },
  { id:'ct-soda', name:'Cold Soda', description:'Coke, Fanta or Sprite.', price:3500, category:'Drinks', image:'tamaraThai' },
  { id:'ct-juice', name:'Mango Juice', description:'Fresh chilled mango juice.', price:6500, category:'Drinks', image:'tamaraThai' },
];

const pizzaMenu: DemoMenuItem[] = [
  { id:'pi-margherita', name:'Margherita', description:'Tomato sauce, mozzarella and fresh basil.', price:22000, category:'Pizza', image:'cafeJavas' },
  { id:'pi-chicken', name:'BBQ Chicken Pizza', description:'BBQ chicken, red onion, mozzarella and peppers.', price:28500, category:'Pizza', image:'chickenTonight', popular:true, badge:'25% off' },
  { id:'pi-meat', name:'Meat Deluxe Pizza', description:'Beef, chicken, sausage, peppers and mozzarella.', price:32000, category:'Pizza', image:'chickenTonight' },
  { id:'pi-veggie', name:'Garden Veggie Pizza', description:'Mushrooms, peppers, onion, olives and mozzarella.', price:26000, category:'Pizza', image:'tamaraThai' },
  { id:'pi-hawaiian', name:'Hawaiian Chicken Pizza', description:'Chicken, pineapple, mozzarella and tomato sauce.', price:29000, category:'Pizza', image:'cafeJavas' },
  { id:'pi-pepperoni', name:'Pepperoni Pizza', description:'Pepperoni, mozzarella and rich tomato sauce.', price:30000, category:'Pizza', image:'chickenTonight', popular:true },
  { id:'pi-garlic', name:'Garlic Bread', description:'Oven-baked garlic bread with herbs.', price:8500, category:'Sides', image:'cafeJavas' },
  { id:'pi-wedges', name:'Seasoned Wedges', description:'Crispy potato wedges with garlic dip.', price:9000, category:'Sides', image:'cafeJavas' },
  { id:'pi-wings', name:'BBQ Wings', description:'Eight sticky BBQ chicken wings.', price:17500, category:'Sides', image:'chickenTonight' },
  { id:'pi-coleslaw', name:'Fresh Coleslaw', description:'Crunchy cabbage, carrot and creamy dressing.', price:6000, category:'Sides', image:'tamaraThai' },
  { id:'pi-soda', name:'1L Soda', description:'Choice of Coke, Fanta or Sprite.', price:6000, category:'Drinks', image:'tamaraThai' },
  { id:'pi-brownie', name:'Chocolate Brownie', description:'Warm chocolate brownie with sauce.', price:9000, category:'Desserts', image:'cafeJavas' },
];

function menuWithPrefix(prefix: string, base: DemoMenuItem[]): DemoMenuItem[] {
  return base.map((item) => ({ ...item, id: `${prefix}-${item.id}` }));
}

export const DEMO_RESTAURANTS: DemoRestaurant[] = [
  { id:'cafe-javas', name:'Café Javas', cuisine:'Café · Burgers · Local favourites', image:'cafeJavas', rating:4.7, reviews:'2.4k', eta:'20–30 min', deliveryFee:2000, distance:'1.3 km', offer:'30% off selected meals', plus:true, categories:['Burgers','Local dishes','Coffee','Desserts'], menu:javasMenu },
  { id:'chicken-tonight', name:'Chicken Tonight', cuisine:'Chicken · Grills · Fast food', image:'chickenTonight', rating:4.6, reviews:'1.9k', eta:'18–28 min', deliveryFee:2500, distance:'1.8 km', offer:'Free delivery over UGX 35,000', plus:true, categories:['Chicken','Grills','Healthy'], menu:chickenMenu },
  { id:'pizza-inn', name:'Pizza Inn', cuisine:'Pizza · Wings · Desserts', image:'cafeJavas', rating:4.5, reviews:'3.1k', eta:'25–35 min', deliveryFee:3000, distance:'2.4 km', offer:'25% off pizzas', categories:['Pizza','Desserts'], menu:pizzaMenu },
  { id:'tamarind-thai', name:'Tamarind Thai', cuisine:'Thai · Asian · Noodles', image:'tamaraThai', rating:4.8, reviews:'840', eta:'30–40 min', deliveryFee:3500, distance:'3.0 km', offer:'UGX 5,000 off over UGX 45,000', plus:true, categories:['Healthy','Grills'], menu:menuWithPrefix('thai', javasMenu.slice(5)) },
  { id:'rolex-stop', name:'The Rolex Stop', cuisine:'Rolex · Chapati · Local', image:'chickenTonight', rating:4.6, reviews:'1.2k', eta:'12–20 min', deliveryFee:1500, distance:'0.8 km', offer:'Buy 2, get 1 free', categories:['Local dishes'], menu:menuWithPrefix('rolex', chickenMenu.slice(0,8)) },
  { id:'kampala-grill', name:'Kampala Grill House', cuisine:'Grills · Steak · Local', image:'chickenTonight', rating:4.7, reviews:'960', eta:'28–38 min', deliveryFee:3000, distance:'2.7 km', offer:'20% off grills', categories:['Grills','Local dishes'], menu:menuWithPrefix('grill', javasMenu.slice(3,11)) },
  { id:'java-house', name:'Java House', cuisine:'Coffee · Breakfast · Café', image:'cafeJavas', rating:4.6, reviews:'1.6k', eta:'20–32 min', deliveryFee:2500, distance:'1.9 km', offer:'Coffee + pastry bundle', categories:['Coffee','Desserts','Burgers'], menu:menuWithPrefix('java', javasMenu) },
  { id:'urban-bowl', name:'Urban Bowl Kampala', cuisine:'Healthy · Bowls · Salads', image:'tamaraThai', rating:4.8, reviews:'620', eta:'18–25 min', deliveryFee:2000, distance:'1.5 km', offer:'Free delivery today', plus:true, categories:['Healthy'], menu:menuWithPrefix('bowl', chickenMenu.slice(6)) },
  { id:'kampala-bites', name:'Kampala Bites', cuisine:'Local · African · Grills', image:'chickenTonight', rating:4.5, reviews:'1.1k', eta:'22–34 min', deliveryFee:1800, distance:'2.1 km', offer:'15% off local favourites', categories:['Local dishes','Grills'], menu:menuWithPrefix('bites', javasMenu.slice(6)) },
  { id:'sweet-tooth', name:'Sweet Tooth', cuisine:'Desserts · Ice cream · Coffee', image:'tamaraThai', rating:4.7, reviews:'710', eta:'15–25 min', deliveryFee:2000, distance:'1.2 km', offer:'2 desserts for UGX 20,000', categories:['Desserts','Coffee'], menu:menuWithPrefix('sweet', javasMenu.slice(9)) },
  { id:'roast-rhyme', name:'Roast & Rhyme', cuisine:'Grills · Chicken · Local favourites', image:'chickenTonight', rating:4.7, reviews:'1.3k', eta:'22–32 min', deliveryFee:2500, distance:'2.2 km', offer:'20% off selected grills', plus:true, categories:['Chicken','Grills','Local dishes'], menu:menuWithPrefix('roast', chickenMenu) },
  { id:'smokery', name:'The Smokery', cuisine:'BBQ · Burgers · Grills', image:'chickenTonight', rating:4.8, reviews:'880', eta:'25–38 min', deliveryFee:3000, distance:'2.9 km', offer:'Free delivery over UGX 45,000', categories:['Burgers','Chicken','Grills'], menu:menuWithPrefix('smokery', [...chickenMenu.slice(0,8), ...javasMenu.slice(3,6)]) },
];

export type DemoShop = {
  id: string;
  name: string;
  category: string;
  rating: number;
  eta: string;
  minOrder: number;
  deliveryFee: number;
  deal: string;
  icon: 'medical' | 'cart' | 'bag' | 'phone-portrait' | 'paw' | 'sparkles' | 'home';
  tone: 'black' | 'yellow' | 'red';
};

export const DEMO_SHOPS: DemoShop[] = [
  { id:'goodlife', name:'Goodlife Pharmacy', category:'Pharmacy', rating:4.8, eta:'12–20 min', minOrder:20000, deliveryFee:0, deal:'Kareebu+ wellness delivery', icon:'medical', tone:'black' },
  { id:'carrefour', name:'Carrefour Uganda', category:'Groceries', rating:4.7, eta:'25–35 min', minOrder:25000, deliveryFee:2500, deal:'Groceries, fresh food & household', icon:'cart', tone:'red' },
  { id:'capital', name:'Capital Shoppers', category:'Groceries', rating:4.7, eta:'20–30 min', minOrder:25000, deliveryFee:2000, deal:'Groceries & household shopping', icon:'cart', tone:'red' },
  { id:'quality', name:'Quality Supermarket', category:'Groceries', rating:4.5, eta:'25–35 min', minOrder:25000, deliveryFee:2500, deal:'Fresh produce & home essentials', icon:'cart', tone:'black' },
  { id:'jumia', name:'Jumia Uganda', category:'Marketplace', rating:4.6, eta:'30–45 min', minOrder:20000, deliveryFee:3000, deal:'Tech, home & everyday essentials', icon:'phone-portrait', tone:'yellow' },
  { id:'beautybasket', name:'Beauty Basket', category:'Beauty', rating:4.7, eta:'20–30 min', minOrder:20000, deliveryFee:2000, deal:'Up to 35% off beauty', icon:'sparkles', tone:'red' },
  { id:'techpoint', name:'TechPoint Kampala', category:'Electronics', rating:4.6, eta:'35–50 min', minOrder:40000, deliveryFee:5000, deal:'Accessories from UGX 15,000', icon:'phone-portrait', tone:'black' },
  { id:'homehub', name:'HomeHub Uganda', category:'Home', rating:4.5, eta:'35–55 min', minOrder:35000, deliveryFee:4500, deal:'20% off home basics', icon:'home', tone:'yellow' },
  { id:'petcare', name:'PetCare Kampala', category:'Pets', rating:4.8, eta:'25–40 min', minOrder:25000, deliveryFee:2500, deal:'Free delivery over UGX 60,000', icon:'paw', tone:'red' },
  { id:'kareebu-health', name:'Kareebu Health', category:'Pharmacy', rating:4.9, eta:'10–18 min', minOrder:15000, deliveryFee:0, deal:'Kareebu+ member prices', icon:'medical', tone:'yellow' },
  { id:'nutrition-hub', name:'Nutrition Hub', category:'Nutrition', rating:4.6, eta:'20–35 min', minOrder:25000, deliveryFee:2000, deal:'Protein & wellness bundles', icon:'bag', tone:'black' },
  { id:'eye-care', name:'Vision & Eye Care', category:'Eye care', rating:4.7, eta:'25–40 min', minOrder:30000, deliveryFee:3000, deal:'Save on contact lens care', icon:'bag', tone:'red' },
  { id:'healthplus', name:'HealthPlus Pharmacy', category:'Pharmacy', rating:4.7, eta:'20–35 min', minOrder:25000, deliveryFee:0, deal:'30% off selected wellness items', icon:'medical', tone:'yellow' },
  { id:'sunlife', name:'Sunlife Pharmacy', category:'Pharmacy', rating:4.5, eta:'20–35 min', minOrder:20000, deliveryFee:0, deal:'Up to 70% off selected lines', icon:'medical', tone:'red' },
  { id:'tyros', name:'Tyros Pharmacy', category:'Pharmacy', rating:4.6, eta:'20–35 min', minOrder:20000, deliveryFee:2000, deal:'Kareebu+ wellness picks', icon:'medical', tone:'black' },
  { id:'silverglow', name:'Silver Glow Pharma', category:'Pharmacy', rating:4.5, eta:'25–40 min', minOrder:20000, deliveryFee:2500, deal:'Beauty and wellness savings', icon:'medical', tone:'red' },
  { id:'lifecare', name:'LifeCare Pharmacy', category:'Pharmacy', rating:4.6, eta:'20–35 min', minOrder:20000, deliveryFee:0, deal:'Free delivery on selected baskets', icon:'medical', tone:'yellow' },
  { id:'rapid', name:'Rapid Chemist', category:'Pharmacy', rating:4.4, eta:'15–30 min', minOrder:15000, deliveryFee:0, deal:'Up to 50% off selected items', icon:'medical', tone:'black' },
  { id:'careplus', name:'Care Plus Pharmacy', category:'Pharmacy', rating:4.6, eta:'25–40 min', minOrder:20000, deliveryFee:0, deal:'Everyday health essentials', icon:'medical', tone:'yellow' },
  { id:'mediq', name:'MediQ Pharmacy', category:'Pharmacy', rating:4.5, eta:'20–35 min', minOrder:20000, deliveryFee:1500, deal:'Wellness and personal care offers', icon:'medical', tone:'red' },

  // Kenya locale catalogue
  { id:'naivas', name:'Naivas', category:'Groceries', rating:4.8, eta:'20–35 min', minOrder:1500, deliveryFee:150, deal:'Fresh groceries & household essentials', icon:'cart', tone:'yellow' },
  { id:'quickmart', name:'Quickmart', category:'Groceries', rating:4.7, eta:'20–35 min', minOrder:1500, deliveryFee:150, deal:'Everyday groceries & fresh food', icon:'cart', tone:'red' },

  // Tanzania locale catalogue
  { id:'shoppers-tz', name:'Shoppers Supermarket', category:'Groceries', rating:4.7, eta:'25–40 min', minOrder:15000, deliveryFee:3000, deal:'Groceries, fresh foods & household', icon:'cart', tone:'red' },
  { id:'village-tz', name:'Village Supermarket', category:'Groceries', rating:4.8, eta:'25–40 min', minOrder:20000, deliveryFee:3500, deal:'Fine foods, fresh produce & home', icon:'cart', tone:'black' },
  { id:'breeze-tz', name:'Breeze Pharmacy', category:'Pharmacy', rating:4.7, eta:'20–35 min', minOrder:15000, deliveryFee:2500, deal:'Health, wellness & personal care', icon:'medical', tone:'yellow' },
];

export type DemoPromotion = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  tone: 'red' | 'yellow' | 'black';
  target: 'food' | 'shops' | 'whereTo' | 'wallet';
};

export const DEMO_PROMOTIONS: DemoPromotion[] = [
  { id:'weekend', eyebrow:'KAREEBU+ WEEKEND', title:'Up to 70% off', body:'Big savings across food, pharmacy and everyday essentials.', cta:'Shop offers', tone:'red', target:'shops' },
  { id:'black', eyebrow:'KAREEBU BLACK', title:'Member-only perks', body:'Priority support, better rewards and selected free deliveries.', cta:'See benefits', tone:'black', target:'wallet' },
  { id:'boda', eyebrow:'BODA HAPPY HOUR', title:'Save on quick trips', body:'Lower demo fares on selected Kampala Boda journeys.', cta:'Book Boda', tone:'yellow', target:'whereTo' },
  { id:'lunch', eyebrow:'LUNCH SORTED', title:'Meals from UGX 12,000', body:'Fast lunch picks from restaurants around Kampala.', cta:'Order lunch', tone:'red', target:'food' },
  { id:'delivery', eyebrow:'FREE DELIVERY', title:'Selected stores today', body:'Look for the Kareebu+ free-delivery badge in Shops.', cta:'Browse stores', tone:'yellow', target:'shops' },
  { id:'rewards', eyebrow:'KAREEBU REWARDS', title:'Every order counts', body:'Collect points on rides, food, shops and parcel deliveries.', cta:'View wallet', tone:'black', target:'wallet' },
];



export type HomeRetailPromotion = {
  id: string;
  brand: string;
  eyebrow: string;
  headline: string;
  detail: string;
  priceLine?: string;
  cta: string;
  target: 'food' | 'shops';
  visual: 'food' | 'groceries' | 'pharmacy' | 'tech';
  accent: 'black' | 'red' | 'yellow' | 'green';
  demoLabel?: string;
};

// Partner-style demo creatives use real Uganda-facing retailers/brands, while
// Kareebu+ owns the offer framing. This keeps the prototype realistic without
// pretending unsynchronised merchant promotions are live production offers.
export const HOME_RETAIL_PROMOTIONS: HomeRetailPromotion[] = [
  {
    id: 'glovo-daily-deals',
    brand: 'Glovo',
    eyebrow: 'DAILY DEALS',
    headline: 'Up to 30% OFF',
    detail: 'On groceries',
    cta: 'Order now',
    target: 'shops',
    visual: 'groceries',
    accent: 'black',
    demoLabel: 'Reference creative',
  },
  {
    id: 'carrefour-weekend-deals',
    brand: 'Carrefour',
    eyebrow: 'WEEKEND DEALS',
    headline: 'UP TO 30% OFF',
    detail: 'On selected items',
    cta: 'Shop now',
    target: 'shops',
    visual: 'groceries',
    accent: 'red',
    demoLabel: 'Reference creative',
  },
  {
    id: 'goodlife-stay-well',
    brand: 'Goodlife Pharmacy',
    eyebrow: 'STAY WELL',
    headline: 'THIS SEASON',
    detail: 'Up to 20% OFF healthcare essentials',
    cta: 'Shop now',
    target: 'shops',
    visual: 'pharmacy',
    accent: 'green',
    demoLabel: 'Reference creative',
  },
  {
    id: 'jumia-tech-week',
    brand: 'Jumia',
    eyebrow: 'TECH WEEK',
    headline: 'UP TO 20% OFF',
    detail: 'Phones & accessories',
    cta: 'Shop now',
    target: 'shops',
    visual: 'tech',
    accent: 'yellow',
    demoLabel: 'Reference creative',
  },
  {
    id: 'capital-shoppers-basket',
    brand: 'Capital Shoppers',
    eyebrow: 'FRESH BASKET',
    headline: 'Groceries made easy',
    detail: 'Fresh produce, pantry staples and household shopping.',
    priceLine: 'Delivery from UGX 2,000',
    cta: 'Browse',
    target: 'shops',
    visual: 'groceries',
    accent: 'red',
    demoLabel: 'Demo partner offer',
  },
  {
    id: 'quality-home',
    brand: 'Quality Supermarket',
    eyebrow: 'HOME ESSENTIALS',
    headline: 'Stock up this week',
    detail: 'Groceries, fresh produce and household basics in one basket.',
    priceLine: 'Kampala delivery available',
    cta: 'Browse',
    target: 'shops',
    visual: 'groceries',
    accent: 'black',
    demoLabel: 'Demo partner offer',
  },
];

export type HomeRealBrand = {
  id: string;
  name: string;
  category: string;
  eta: string;
  target: 'food' | 'shops';
  accent: 'black' | 'red' | 'yellow' | 'green';
};

export const HOME_REAL_BRANDS: HomeRealBrand[] = [
  { id:'carrefour-uganda', name:'Carrefour', category:'Supermarket', eta:'25–35 min', target:'shops', accent:'red' },
  { id:'jumia-uganda', name:'Jumia', category:'Marketplace', eta:'30–45 min', target:'shops', accent:'yellow' },
  { id:'glovo', name:'Glovo', category:'Delivery marketplace', eta:'20–30 min', target:'food', accent:'yellow' },
  { id:'goodlife-pharmacy', name:'Goodlife Pharmacy', category:'Pharmacy', eta:'15–25 min', target:'shops', accent:'green' },
  { id:'pizza-hut', name:'Pizza Hut', category:'Restaurant', eta:'30–40 min', target:'food', accent:'red' },
];

export type DemoDirectionStep = {
  icon: 'arrow-up' | 'arrow-forward' | 'return-up-forward' | 'flag';
  instruction: string;
  distance: string;
};

export function demoDirections(mode: 'RIDE' | 'BODA', destinationName: string) {
  if (mode === 'BODA') {
    return {
      routeName: `Fast Boda route to ${destinationName}`,
      traffic: 'Light traffic',
      summary: 'Via Yusuf Lule Rd · demo guidance',
      steps: [
        { icon:'arrow-up', instruction:'Head north towards Yusuf Lule Road', distance:'450 m' },
        { icon:'arrow-forward', instruction:'Turn right onto Yusuf Lule Road', distance:'1.2 km' },
        { icon:'return-up-forward', instruction:'Keep left at the Kisementi junction', distance:'650 m' },
        { icon:'flag', instruction:`Arrive at ${destinationName}`, distance:'120 m' },
      ] as DemoDirectionStep[],
    };
  }
  return {
    routeName: `Recommended route to ${destinationName}`,
    traffic: 'Moderate traffic',
    summary: 'Via Kampala Rd & Yusuf Lule Rd · demo guidance',
    steps: [
      { icon:'arrow-up', instruction:'Continue towards Kampala Road', distance:'700 m' },
      { icon:'arrow-forward', instruction:'Turn right onto Yusuf Lule Road', distance:'1.6 km' },
      { icon:'return-up-forward', instruction:'Continue past Garden City towards Kisementi', distance:'950 m' },
      { icon:'flag', instruction:`Arrive at ${destinationName}`, distance:'180 m' },
    ] as DemoDirectionStep[],
  };
}

export function formatUgx(value: number) {
  return `UGX ${Math.round(value).toLocaleString()}`;
}
