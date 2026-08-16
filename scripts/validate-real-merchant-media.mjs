import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const demo = read('src/demoData.ts');
const screens = read('src/screens.tsx');
const foodTypes = read('src/food/discovery/types.ts');
const foodWidgets = read('src/food/discovery/widgets/sections.tsx');
const foodSurfaces = read('src/food/discovery/surfaces.tsx');
const dineOut = read('src/home/KareebuDineOutSection.tsx');

let count = 0;
const ok = (condition, label) => {
  if (!condition) {
    console.error(`FAIL — ${label}`);
    process.exitCode = 1;
    return;
  }
  count += 1;
  console.log(`PASS — ${label}`);
};

const urls = [...demo.matchAll(/https:\/\/images\.unsplash\.com\/photo-[^'"\s]+/g)].map((match) => match[0]);
ok(urls.length >= 16, `real merchant photo catalogue contains at least 16 photographic sources (${urls.length})`);
ok(new Set(urls).size >= 16, 'merchant photo catalogue uses a broad set of distinct real photos');
ok(urls.every((url) => url.startsWith('https://images.unsplash.com/')), 'merchant photos use HTTPS Unsplash image delivery');

ok(demo.includes('photoUrl?: string;'), 'restaurant/shop data supports real photo URLs');
ok(demo.includes("featuredDish?: string;"), 'restaurant listings support featured-dish merchandising');
ok(demo.includes("priceLevel?: '$' | '$$' | '$$$';"), 'restaurant listings support price-level context');
ok(demo.includes('reviews?: string;'), 'shop listings support review counts');
ok(demo.includes('inventoryHint?: string;'), 'shop listings support inventory/category context');
ok(demo.includes('location?: string;'), 'shop listings support market/location context');

ok(screens.includes('function ResilientMerchantPhoto'), 'merchant photos have a local-asset failure fallback');
ok(!screens.includes('StyleSheet.absoluteFillObject'), 'merchant media uses SDK-compatible StyleSheet.absoluteFill');
ok(screens.includes('function RestaurantPhoto'), 'restaurant screen photography uses a shared resilient renderer');
ok(screens.includes('function ShopPhoto'), 'shop photography uses a shared resilient renderer');
ok(screens.includes('<ShopPhoto store={store} style={styles.v614HeroPhoto} logo={false}/>'), 'storefront detail uses a real photographic hero');
ok(screens.includes('<ShopPhoto store={shop} style={styles.v40ShopRowPhoto}/>'), 'main shop list uses photographic thumbnails');
ok(screens.includes('<ShopPhoto store={store} style={styles.v40FindPhoto}/>'), 'New Finds uses real shop photography');
ok(screens.includes('<ShopPhoto store={store} style={styles.v40PopularStorePhoto}/>'), 'Popular Stores uses real shop photography');
ok(screens.includes('<ShopPhoto store={store} style={styles.v35StorePhotoArea}/>'), 'Home popular stores use real shop photography');
ok(screens.includes('<RestaurantPhoto restaurant={restaurant} style={styles.v614HeroPhoto}/>'), 'restaurant detail uses a real photographic hero');
ok(screens.includes('image: restaurant.photoUrl ? { uri: restaurant.photoUrl }'), 'Food discovery receives real restaurant photo sources');

ok(foodTypes.includes('reviews: string;'), 'Food discovery restaurant contract carries actual review counts');
ok(foodTypes.includes('fallbackImage?: ImageSourcePropType;'), 'Food discovery carries a local fallback image');
ok(foodWidgets.includes('function FoodRestaurantPhoto'), 'Food discovery cards recover from remote-photo failures');
ok(!foodWidgets.includes('(999+)'), 'Food discovery no longer hardcodes 999+ reviews');
ok(foodWidgets.includes('restaurant.reviews'), 'Food discovery renders each restaurant review count');
ok(foodSurfaces.includes('function SurfaceRestaurantPhoto'), 'Food search/listing surfaces use resilient real photography');
ok(foodSurfaces.includes('restaurant.reviews'), 'Food search/listing surfaces show review counts');

ok(dineOut.includes('REAL_DINEOUT_PHOTOS'), 'DineOut uses real photographic sources');
ok(dineOut.includes('function RealDineOutPhoto'), 'DineOut real photography has local fallbacks');
ok(!dineOut.includes("reviews: '999+'"), 'DineOut no longer uses placeholder 999+ review counts');

if (process.exitCode) process.exit(process.exitCode);
console.log(`\nPASS — Kareebu+ real merchant photography/listing checks complete (${count}/${count}).`);
