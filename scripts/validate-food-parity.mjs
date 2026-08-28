import fs from 'node:fs';

const screens = fs.readFileSync('src/screens.tsx', 'utf8');
const app = fs.readFileSync('App.tsx', 'utf8');
const feature = fs.readFileSync('src/food/screens.tsx', 'utf8');
const catalog = fs.readFileSync('src/food/catalog.ts', 'utf8');
const pricing = fs.readFileSync('src/food/pricing.ts', 'utf8');
const types = fs.readFileSync('src/types.ts', 'utf8');
const discoveryTypes = fs.readFileSync('src/food/discovery/types.ts', 'utf8');
const discoveryController = fs.readFileSync('src/food/discovery/controller.ts', 'utf8');
const discoveryHome = fs.readFileSync('src/food/discovery/FoodDiscoveryHome.tsx', 'utf8');
const discoverySurfaces = fs.readFileSync('src/food/discovery/surfaces.tsx', 'utf8');
const discoverySections = fs.readFileSync('src/food/discovery/widgets/sections.tsx', 'utf8');

const checks = [
  ['Food AppEngine-style document', discoveryTypes, "page: 'food-discovery-home'"],
  ['Food-specific search surface', discoverySurfaces, 'Search restaurants or dishes'],
  ['Search query state', discoveryController, "const [query, setQuery]"],
  ['Restaurant search results', discoveryController, 'restaurantSearchResults'],
  ['Dish search results', discoveryController, 'dishSearchResults'],
  ['Dish result deep-link handoff', discoverySurfaces, 'openFoodItem'],
  ['Filter and sort surface', discoverySurfaces, 'Filter & sort'],
  ['Rating filter', discoveryController, 'minRating'],
  ['Offer filter', discoveryController, 'offersOnly'],
  ['Kareebu+ filter', discoveryController, 'plusOnly'],
  ['Free delivery filter', discoveryController, 'freeDeliveryOnly'],
  ['Fastest sort', discoveryController, "filters.sort === 'Fastest'"],
  ['Category listing navigation', discoveryController, 'openCategory'],
  ['Nearby listing navigation', discoveryController, 'openNearby'],
  ['Best seller listing navigation', discoveryController, 'openBestSellers'],
  ['Promo-specific navigation', discoveryController, 'openPromo'],
  ['Popular brand navigation', discoverySections, 'controller.openBrand'],
  ['Dismissible membership banner', discoveryHome, 'setMembershipVisible(false)'],
  ['Restaurant menu search', screens, 'Search ${restaurant.name}'],
  ['Restaurant category filtering', screens, 'activeMenuCategory'],
  ['Restaurant share', screens, 'Share.share'],
  ['Restaurant item opens details', screens, "actions.go('foodItem')"],
  ['Item details route', types, "| 'foodItem'"],
  ['Checkout route', types, "| 'foodCheckout'"],
  ['Order success route', types, "| 'foodOrderSuccess'"],
  ['Required option groups', catalog, 'required: true'],
  ['Add-ons supported', catalog, 'addons:'],
  ['Configured pricing', pricing, 'configuredUnitPrice'],
  ['Distinct cart-line configuration key', pricing, 'foodCartLineId'],
  ['Food cart state', app, 'foodCartLines'],
  ['Checkout state', app, 'foodCheckout'],
  ['Last food order state', app, 'lastFoodOrder'],
  ['Item special instructions', feature, 'Special instructions'],
  ['Delivery and pickup', feature, "['delivery', 'takeaway']"],
  ['Scheduled delivery', feature, 'Tomorrow · 12:30'],
  ['Delivery instructions', feature, 'Leave at door'],
  ['Coupon calculation', pricing, "couponCode === 'SAVE10'"],
  ['Free delivery coupon', pricing, "couponCode === 'PLUSFREE'"],
  ['Courier tip', feature, 'Tip your courier'],
  ['Mobile money payment', feature, "'mtn', 'airtel'"],
  ['Card payment', feature, "'visa'"],
  ['Cash on delivery', feature, "'cash'"],
  ['Order confirmation', feature, 'Order placed'],
  ['Track order handoff', screens, "actions.go('orderTracking')"],
];

const missing = checks.filter(([, haystack, needle]) => !haystack.includes(needle));
if (missing.length) {
  for (const [label, , needle] of missing) console.error(`Missing Food functional parity requirement: ${label} (${needle})`);
  process.exit(1);
}

console.log(`Food functional parity validation passed: ${checks.length}/${checks.length} implementation checks present.`);
console.log('Scope: discovery/search/filter/listing -> restaurant/menu search -> item customisation -> cart -> checkout -> confirmation -> tracking handoff.');
