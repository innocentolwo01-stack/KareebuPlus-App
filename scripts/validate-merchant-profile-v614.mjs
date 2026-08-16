import fs from 'node:fs';

const source = fs.readFileSync('src/screens.tsx', 'utf8');
let passed = 0;
const checks = [];
function ok(condition, label) {
  checks.push({ condition, label });
  if (condition) passed += 1;
  console.log(`${condition ? 'PASS' : 'FAIL'} — ${label}`);
}

function between(start, end) {
  const a = source.indexOf(start);
  const b = source.indexOf(end, a + start.length);
  return a >= 0 && b > a ? source.slice(a, b) : '';
}

const restaurant = between('export function RestaurantScreen(', '\nexport function FoodItemScreen(');
const store = between('export function StorefrontScreen(', '\nexport function LocationPickerScreen(');

ok(source.includes('height*0.59'), 'reference hero consumes the dominant first viewport');
ok(source.includes('width:56,height:56'), 'floating utility buttons use the larger reference geometry');
ok(source.includes('width:104,height:104'), 'merchant logo card uses the larger overlapping reference geometry');
ok(source.includes('fontSize:31'), 'merchant name uses reference-scale headline typography');
ok(source.includes('function RestaurantIdentityLogo'), 'restaurant identity has a dedicated logo renderer');
ok(source.includes('google.com/s2/favicons'), 'known real merchant domains can supply brand marks');
ok(source.includes('function RestaurantDishPhoto'), 'restaurant menu uses real dish photography');
ok(source.includes('function StoreProductPhoto'), 'store product rows use real product/retail photography');
ok(source.includes('V614_DISH_PHOTOS'), 'real dish-photo library is present');
ok(source.includes('V614_PRODUCT_PHOTOS'), 'real product-photo library is present');

ok(restaurant.includes('styles.v614Hero'), 'restaurant uses hard-rebuild hero');
ok(restaurant.includes('styles.v614LogoCard'), 'restaurant uses overlapping merchant logo card');
ok(restaurant.includes('styles.v614IdentityRow'), 'restaurant uses reference identity hierarchy');
ok(restaurant.includes('MerchantRatingPanel'), 'restaurant uses right-side rating panel');
ok(restaurant.includes('styles.v614MenuRow'), 'restaurant menu uses flat reference-specific rows');
ok(restaurant.includes('RestaurantDishPhoto'), 'restaurant rows display real dish photography');
ok(!restaurant.includes('styles.v30MenuItem'), 'restaurant no longer reuses old v30 menu-card layout');
ok(!restaurant.includes('styles.v30RestaurantHeroWrap'), 'restaurant no longer reuses old v30 hero');
ok(!restaurant.includes('styles.v613'), 'restaurant no longer uses V6.13 visual wrappers');

ok(store.includes('styles.v614Hero'), 'store uses hard-rebuild hero');
ok(store.includes('styles.v614LogoCard'), 'store uses overlapping merchant logo card');
ok(store.includes('styles.v614IdentityRow'), 'store uses same reference identity hierarchy');
ok(store.includes('MerchantRatingPanel'), 'store uses same right-side rating panel');
ok(store.includes('styles.v614ProductRow'), 'store products use flat reference-specific rows');
ok(store.includes('StoreProductPhoto'), 'store rows display real product photography');
ok(!store.includes('styles.v38ProductGrid'), 'store no longer reuses old v38 product grid');
ok(!store.includes('styles.v613'), 'store no longer uses V6.13 visual wrappers');

ok(!source.includes('StyleSheet.absoluteFillObject'), 'unsupported React Native StyleSheet API remains absent');

console.log(`Kareebu+ V6.14 merchant-profile hard-rebuild checks complete: ${passed}/${checks.length}.`);
if (checks.some((item) => !item.condition)) process.exit(1);
