import fs from 'node:fs';

const requested = process.argv[2] ?? 'all';

const DOMAIN_ALIASES = new Map([
  ['all','all'],
  ['baseline','all'],
  ['brand','brand'],
  ['ui','ui'],
  ['uxui','ui'],
  ['navigation','navigation'],
  ['functionality','navigation'],
  ['marketplace','marketplace'],
  ['frontend','marketplace'],
  ['category','marketplace'],
  ['food','food'],
  ['mobility','mobility'],
  ['boda','mobility'],
  ['captain','mobility'],
  ['merchant','merchant'],
  ['commerce','commerce'],
  ['products','commerce'],
  ['demand','commerce'],
  ['routes','routes'],
  ['parity','routes'],
  ['interactions','interactions'],
]);

const domain = DOMAIN_ALIASES.get(requested);
if (!domain) {
  console.error(`Unknown baseline validation domain: ${requested}`);
  process.exit(2);
}

function read(file, required = true) {
  if (!fs.existsSync(file)) {
    if (required) throw new Error(`Missing required file: ${file}`);
    return '';
  }
  return fs.readFileSync(file,'utf8');
}

const files = {
  app: read('App.tsx'),
  package: read('package.json'),
  types: read('src/types.ts'),
  components: read('src/components.tsx'),
  theme: read('src/theme.ts'),
  screens: read('src/screens.tsx'),
  navigation: read('src/navigation/AppNavigation.tsx', false),
  marketplace: read('src/marketplace/MarketplaceCategoryChrome.tsx', false),
  frontend: read('src/v41/frontend.tsx', false),
  foodHome: read('src/food/discovery/FoodDiscoveryHome.tsx', false),
  foodSurfaces: read('src/food/discovery/surfaces.tsx', false),
  foodTypes: read('src/food/discovery/types.ts', false),
  foodController: read('src/food/discovery/controller.ts', false),
  foodRenderer: read('src/food/discovery/renderer.tsx', false),
  boda: read('src/ride/kareebuBodaHome.tsx', false),
  rides: read('src/ride/kareebuRidesHome.tsx', false),
  mobilityScreens: read('src/ride/mobilityScreens.tsx', false),
};

let passed = 0;
let failed = 0;
let warned = 0;

function active(checkDomain) {
  return domain === 'all' || domain === checkDomain;
}

function check(checkDomain, label, condition, detail = '') {
  if (!active(checkDomain)) return;
  if (condition) {
    passed++;
    console.log(`PASS — ${label}`);
  } else {
    failed++;
    console.log(`FAIL — ${label}${detail ? ` · ${detail}` : ''}`);
  }
}

function warn(checkDomain, label, condition, detail = '') {
  if (!active(checkDomain)) return;
  if (condition) return;
  warned++;
  console.log(`WARN — ${label}${detail ? ` · ${detail}` : ''}`);
}

function hasAll(source, values) {
  return values.every((value) => source.includes(value));
}

function functionSlice(source, name, nextName = null) {
  const start = source.indexOf(`export function ${name}(`);
  if (start < 0) return '';
  if (!nextName) return source.slice(start);
  const end = source.indexOf(`\nexport function ${nextName}(`, start + 1);
  return end > start ? source.slice(start,end) : source.slice(start);
}

// Navigation
check('navigation','root navigation provider is installed', files.app.includes('AppNavigationProvider'));
check('navigation','universal Back fallback is installed', files.app.includes('UniversalBackButton'));
check('navigation','Android hardware Back is wired', files.app.includes('BackHandler.addEventListener'));
check('navigation','persistent branded bottom navigation is root-owned', files.app.includes('<BottomNav') && files.app.includes('persistent'));
check('navigation','root navigation contains route history', files.app.includes('navigationHistoryRef'));
check('navigation','navigation module exports Back-control registration', hasAll(files.navigation,['export function useRegisterBackControl','export function UniversalBackButton']));
check('navigation','shared Header can inherit global Back', files.components.includes('resolvedBack') && files.components.includes('useAppNavigation'));
check('navigation','BottomNav has persistent-shell mode', files.components.includes('persistent?: boolean') && files.components.includes('if (!persistent) return null'));
check('navigation','primary navigation keeps five customer tabs', hasAll(files.components,["label: 'Home'","label: 'Explore'","label: 'Activity'","label: 'Wallet'","label: 'Account'"]));

// Marketplace/category
for (const exportName of [
  'MarketplaceCategoryHeader',
  'MarketplacePromoBanner',
  'MarketplaceRecommendedRail',
  'MarketplaceCategoryGrid',
  'MarketplacePromoGrid',
  'MarketplaceMembershipStrip',
]) {
  check('marketplace',`${exportName} is exported`, files.marketplace.includes(`export function ${exportName}`));
}
check('marketplace','category header has delivery hierarchy', files.marketplace.includes('Deliver to'));
check('marketplace','category grid uses semantic Kareebu 3D art', /<BrandIcon\s+semantic=\{tile\.semantic\}/.test(files.marketplace));
check('marketplace','promotions use photographic media', files.marketplace.includes('ImageBackground'));
check('marketplace','category layout uses two-row eight-tile model', /tiles\.slice\(0,\s*8\)/.test(files.marketplace));
check('marketplace','Shops consumes shared category chrome',
  hasAll(functionSlice(files.screens,'ShopsScreen','ParcelScreen'),[
    'MarketplaceCategoryHeader','MarketplacePromoBanner','MarketplaceRecommendedRail','MarketplaceCategoryGrid','MarketplacePromoGrid'
  ]));
for (const [name,next] of [
  ['CategoriesScreen','CategoryItemsScreen'],
  ['CategoryItemsScreen','BrandsScreen'],
  ['BrandsScreen','BrandItemsScreen'],
  ['BrandItemsScreen','CampaignsScreen'],
  ['AllStoresScreen','ItemViewAllScreen'],
  ['ItemViewAllScreen','SearchFiltersScreen'],
]) {
  const body = functionSlice(files.frontend,name,next);
  check('marketplace',`${name} consumes shared delivery/search header`, body.includes('MarketplaceCategoryHeader'));
  check('marketplace',`${name} contains a promotion`, body.includes('MarketplacePromoBanner'));
}
check('marketplace','Food listing consumes shared category chrome',
  hasAll(functionSlice(files.foodSurfaces,'FoodListingSurface','FoodFiltersSurface'),[
    'MarketplaceCategoryHeader','MarketplacePromoBanner','MarketplaceRecommendedRail','MarketplacePromoGrid'
  ]));
check('marketplace','marketplace category header exposes a white content-sheet transition',
  files.marketplace.includes('whiteSheetBridge'));
check('marketplace','marketplace hero supports multiple promotions',
  files.marketplace.includes('promotions=[theme.hero,theme.secondary,theme.member]'));
check('marketplace','marketplace promotions expose carousel position affordance',
  files.marketplace.includes('heroDots') && files.marketplace.includes('heroDotActive'));
check('marketplace','marketplace category grid has its own discovery heading',
  files.marketplace.includes('Shop by category'));
check('marketplace','marketplace promo grid has its own offers heading',
  files.marketplace.includes('Offers for you'));
check('marketplace','generated category files contain no escaped template delimiters',
  !files.screens.includes('\\`') && !files.frontend.includes('\\`') && !files.foodSurfaces.includes('\\`'));

// Food
check('food','Food home uses controller architecture', files.foodHome.includes('useKareebuFoodHomeController'));
check('food','Food home renders typed widgets', files.foodHome.includes('renderKareebuFoodWidget'));
check('food','Food document contract exists', files.foodTypes.includes('export type FoodHomeDocument'));
check('food','Food controller contract exists', files.foodTypes.includes('export type FoodHomeController'));
check('food','Food search surface exists', files.foodSurfaces.includes('export function FoodSearchSurface'));
check('food','Food listing surface exists', files.foodSurfaces.includes('export function FoodListingSurface'));
check('food','Food filters surface exists', files.foodSurfaces.includes('export function FoodFiltersSurface'));
check('food','Food sorting helper is preserved', files.foodSurfaces.includes('const SORTS'));
check('food','Food rating helper is preserved', files.foodSurfaces.includes('const RATINGS'));
check('food','Food filter toggle helper is preserved', files.foodSurfaces.includes('function ToggleRow'));
check('food','Food controller implementation exists', files.foodController.includes('useKareebuFoodHomeController'));
check('food','Food renderer implementation exists', files.foodRenderer.includes('renderKareebuFoodWidget'));

// Mobility
check('mobility','dedicated Boda home exists', files.boda.includes('KareebuBodaHomeScreen'));
check('mobility','Boda explicitly locks BODA mode', files.boda.includes("selectMode('BODA')"));
check('mobility','Boda explicitly selects boda product', files.boda.includes("selectRide('boda')"));
check('mobility','Boda map uses motorcycle markers', files.boda.includes('motorbike'));
check('mobility','Boda does not use the car marker asset', !files.boda.includes('map-car.png'));
check('mobility','Boda provides safety flow', files.boda.includes("go('rideSafety')"));
check('mobility','dedicated Rides home exists', files.rides.includes('KareebuRidesHomeScreen'));
check('mobility','Rides retains map-first home', files.rides.includes('MapView'));
check('mobility','BODA mode delegates through mobility home', files.mobilityScreens.includes('KAREEBU_BODA_RIDES_PARITY_V1'));

// Merchant
const restaurantBody = functionSlice(files.screens,'RestaurantScreen');
const storefrontBody = functionSlice(files.screens,'StorefrontScreen','RestaurantScreen');
check('merchant','restaurant detail screen exists', restaurantBody.length > 0);
check('merchant','storefront detail screen exists', storefrontBody.length > 0);
check('merchant','restaurant detail contains image media', /<Image|ImageBackground/.test(restaurantBody));
check('merchant','storefront detail contains image media', /<Image|ImageBackground/.test(storefrontBody));
check('merchant','restaurant detail retains custom Back registration', restaurantBody.includes('useRegisterBackControl'));
check('merchant','storefront detail retains custom Back registration', storefrontBody.includes('useRegisterBackControl'));

// Brand/UI
check('brand','Kareebu yellow theme role exists', /yellow\s*:/.test(files.theme));
check('brand','Kareebu charcoal/black theme role exists', /black\s*:/.test(files.theme));
check('brand','Kareebu red theme role exists', /red\s*:/.test(files.theme));
check('brand','Kareebu green theme role exists', /green\s*:/.test(files.theme));
check('brand','shared semantic BrandIcon renderer exists', files.components.includes('export function BrandIcon'));
check('brand','bottom navigation uses BrandIcon', functionSlice(files.components,'BottomNav').includes('BrandIcon'));
check('brand','shop/category system uses BrandIcon', files.marketplace.includes('BrandIcon'));

check('ui','Android bottom system safe area remains reserved', /paddingBottom\s*:\s*24/.test(files.components));
check('ui','shared Header component exists', files.components.includes('export function Header'));
check('ui','shared ScreenShell component exists', files.components.includes('export function ScreenShell'));
check('ui','shared PrimaryButton component exists', files.components.includes('export function PrimaryButton'));

// Careem-style discovery parity
const discoveryScreen=read('src/discovery/KareebuCareemDiscoveryScreen.tsx', false);
const discoveryDocument=read('src/discovery/document.ts', false);
const discoveryRenderer=read('src/discovery/renderer.tsx', false);
const discoveryConfig=read('src/discovery/domainConfig.ts', false);
check('marketplace','Careem-style discovery renderer is modular',
  discoveryScreen.includes('useKareebuDiscoveryController') &&
  discoveryDocument.includes('buildKareebuDiscoveryDocument') &&
  discoveryRenderer.includes('renderKareebuDiscoveryWidget'));
check('marketplace','discovery supports Careem-style filter and sort sheet',
  discoveryScreen.includes('Filters & sorting') && discoveryScreen.includes('Show results'));
check('marketplace','discovery uses vertical → category → subcategory hierarchy',
  discoveryDocument.includes("type:'vertical-grid'") &&
  discoveryDocument.includes("type:'category-rail'") &&
  discoveryDocument.includes("type:'subcategory-grid'"));
check('marketplace','discovery includes hero promotion carousel',
  discoveryDocument.includes("type:'hero-carousel'"));
check('marketplace','discovery includes recommended and all-item sections',
  discoveryDocument.includes("type:'item-rail'") && discoveryDocument.includes("type:'item-list'"));
check('marketplace','all five new customer discovery routes render',
  ['dineOut','groceries','electronics','homeCare','fix'].every((route)=>files.types.includes("'" + route + "'")) &&
  ['dineOut','groceries','electronics','homeCare','fix'].every((route)=>files.screens.includes("case '" + route + "'")));
check('marketplace','domain configuration covers Food DineOut Groceries Shops Electronics Home & Care and Fix',
  discoveryConfig.includes("'home-care':") &&
  discoveryConfig.includes('dineout:') &&
  discoveryConfig.includes('electronics:') &&
  discoveryConfig.includes('groceries:') &&
  discoveryConfig.includes('shops:') &&
  discoveryConfig.includes('fix:') &&
  discoveryConfig.includes('food:'));

// Commerce
check('commerce','Food cart route UI exists', files.screens.includes('export function CartScreen'));
check('commerce','Food checkout route UI exists', files.screens.includes('export function FoodCheckoutScreen'));
check('commerce','Food order success route UI exists', files.screens.includes('export function FoodOrderSuccessScreen'));
check('commerce','commerce checkout state is represented', files.app.includes('CommerceCheckoutDraft'));
check('commerce','parcel order state is represented', files.app.includes('ParcelOrder'));
check('commerce','service booking state is represented', files.app.includes('ServiceBooking'));

// Routes
const screenMatch = files.types.match(/export type Screen\s*=\s*([\s\S]*?);/);
const screenNames = screenMatch ? [...screenMatch[1].matchAll(/'([^']+)'/g)].map((m)=>m[1]) : [];
const routeCases = [...files.screens.matchAll(/case\s+'([^']+)'\s*:/g)].map((m)=>m[1]);
check('routes','Screen union remains comprehensive', screenNames.length >= 140, `found ${screenNames.length}`);
check('routes','renderScreen retains comprehensive route coverage', routeCases.length >= 140, `found ${routeCases.length}`);
const missingRouteCases = screenNames.filter((name)=>!routeCases.includes(name));
check('routes','every Screen route has a renderScreen case', missingRouteCases.length === 0,
  missingRouteCases.length ? `missing: ${missingRouteCases.join(', ')}` : '');

// Interaction warnings are non-blocking.
const pressablePattern = /<Pressable\b([\s\S]*?)>/g;
let pressables = 0;
let passivePressables = 0;
for (const source of [files.screens,files.frontend,files.foodSurfaces,files.marketplace,files.boda,files.rides]) {
  for (const match of source.matchAll(pressablePattern)) {
    pressables++;
    const attrs = match[1];
    if (!/\bonPress\s*=/.test(attrs) && !/\bdisabled\s*=/.test(attrs)) passivePressables++;
  }
}
warn('interactions','review passive Pressables if their count grows unexpectedly',
  passivePressables <= 30, `${passivePressables} passive of ${pressables} total`);
check('interactions','persistent navigation makes all customer routes escapable',
  files.app.includes('<BottomNav') && files.app.includes('UniversalBackButton'));
check('interactions','shared Header can always resolve a Back action', files.components.includes('resolvedBack'));

console.log('');
console.log(`Kareebu+ V7 baseline contracts: ${passed} passed, ${failed} failed, ${warned} warnings.`);
if (failed > 0) process.exit(1);
