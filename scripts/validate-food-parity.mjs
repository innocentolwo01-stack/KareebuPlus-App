import fs from 'node:fs';

const screens = fs.readFileSync('src/screens.tsx', 'utf8');
const app = fs.readFileSync('App.tsx', 'utf8');
const feature = fs.readFileSync('src/food/screens.tsx', 'utf8');
const catalog = fs.readFileSync('src/food/catalog.ts', 'utf8');
const pricing = fs.readFileSync('src/food/pricing.ts', 'utf8');
const types = fs.readFileSync('src/types.ts', 'utf8');

const checks = [
  ['Food module: Find your food', screens, 'Find your food'],
  ['Food module: Featured restaurants', screens, 'Featured restaurants'],
  ['Food module: Just for you', screens, 'Just for you'],
  ['Food module: Quick delivery', screens, 'Quick delivery'],
  ['Food module: Trending dishes', screens, 'Trending dishes'],
  ['Food module: Explore restaurants', screens, 'Explore restaurants'],
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
  for (const [label, , needle] of missing) console.error(`Missing Food parity requirement: ${label} (${needle})`);
  process.exit(1);
}

console.log(`Food parity validation passed: ${checks.length}/${checks.length} implementation checks present.`);
console.log('Scope: Food discovery -> restaurant -> item customisation -> cart -> checkout -> confirmation -> tracking handoff.');
