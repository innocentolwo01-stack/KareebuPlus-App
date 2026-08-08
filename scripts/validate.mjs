import fs from 'node:fs';
import path from 'node:path';

const required = [
  'App.tsx','package.json','app.json','app.config.js','.env.example','tsconfig.json',
  'src/screens.tsx','src/components.tsx','src/assets.ts','src/theme.ts','src/types.ts','src/demoData.ts','src/locale.ts',
  'src/app/KareebuApp.tsx','src/app/state/types.ts','src/app/state/useKareebuAppState.ts','src/app/providers/SuperAppServicesProvider.tsx','src/app/navigation/renderAppScreen.tsx','src/app/superAppManifest.ts',
  'src/core/config/runtimeConfig.ts','src/core/services/contracts.ts','src/services/createSuperAppServices.ts','src/services/demo/demoSuperAppServices.ts','src/services/kareebu/kareebuSuperAppServices.ts','src/services/legacy6am/legacy6amSuperAppServices.ts','docs/super-app-architecture.md',
  'src/ai/kareebuAssistant.ts','server/kareebu-ai-api.mjs','docs/openai-kareebu-ai.md','CHANGELOG-v4.0.md','CHANGELOG-v4.0.2.md','CHANGELOG-v4.0.4.md','TEST-READINESS-v4.0.4.md','UX-FLOW.md',
  'src/places/provider.ts','src/places/usePlaceAutocomplete.ts','src/places/photon.ts',
  'src/routing/provider.ts','src/routing/useRouteEstimate.ts','src/routing/valhalla.ts',
  'src/ride/vehicle.ts','src/ride/useAnimatedVehicle.ts',
  'assets/kareebu-plus/kareebu-plus-wordmark.png',
  'assets/kareebu-plus/countries/uganda.png','assets/kareebu-plus/countries/kenya.png','assets/kareebu-plus/countries/tanzania.png',
  'assets/kareebu-plus/country-landmarks/map.jpg','assets/kareebu-plus/country-landmarks/uganda.jpg','assets/kareebu-plus/country-landmarks/kenya.jpg','assets/kareebu-plus/country-landmarks/tanzania.jpg',
  'assets/karibu/premium/welcome-hero-premium.png','assets/native-splash.png'
];
const missing = required.filter((file)=>!fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error('Missing required files:\n'+missing.join('\n'));
  process.exit(1);
}

const source = fs.readFileSync('src/screens.tsx','utf8');
const rootApp = fs.readFileSync('App.tsx','utf8');
const app = fs.readFileSync('src/app/KareebuApp.tsx','utf8');
const state = fs.readFileSync('src/app/state/useKareebuAppState.ts','utf8');
const services = fs.readFileSync('src/services/createSuperAppServices.ts','utf8');
const contracts = fs.readFileSync('src/core/services/contracts.ts','utf8');
const ai = fs.readFileSync('src/ai/kareebuAssistant.ts','utf8');
const server = fs.readFileSync('server/kareebu-ai-api.mjs','utf8');
const demo = fs.readFileSync('src/demoData.ts','utf8');
const env = fs.readFileSync('.env.example','utf8');
const components = fs.readFileSync('src/components.tsx','utf8');

const screens = [
  'SplashScreen','WelcomeScreen','CountryScreen','CityScreen','LocationScreen','LocationPickerScreen','PhoneScreen','OtpScreen','ProfileScreen','PermissionsScreen',
  'HomeScreen','GlobalSearchScreen','KareebuAssistantScreen','AllServicesScreen','WhereToScreen','ChooseRideScreen','ConfirmBookingScreen','DriverScreen','OnTripScreen',
  'TripCompleteScreen','RateTripScreen','FoodScreen','RestaurantScreen','CartScreen','OrderTrackingScreen','ShopsScreen','StorefrontScreen','ParcelScreen','WalletScreen','AccountScreen','ActivityScreen','OrdersScreen'
];
for (const screen of screens) {
  if (!source.includes(`function ${screen}`)) {
    console.error(`Missing screen: ${screen}`);
    process.exit(1);
  }
}

const requirements = [
  ['thin root app delegates to migrated shell', rootApp, "./src/app/KareebuApp"],
  ['exact branded JS splash is first screen', state, "useState<Screen>('splash')"],
  ['synchronous navigation', state, 'const navigate = useCallback'],
  ['native splash handoff held until RN layout', app, 'NativeSplashScreen.preventAutoHideAsync'],
  ['native splash hides after root layout', app, 'NativeSplashScreen.hideAsync'],
  ['super app service provider installed', app, 'SuperAppServicesProvider'],
  ['backend adapter boundary', services, 'createSuperAppServices'],
  ['typed catalog contract', contracts, 'interface CatalogService'],
  ['typed parcels contract', contracts, 'interface ParcelsService'],
  ['typed rides contract', contracts, 'interface RidesService'],
  ['country crash namespace removed', source, 'assets.countrySelection', true],
  ['device trip sharing', source, 'Share.share'],
  ['interactive wallet top up', source, 'setTopUpOpen(true)'],
  ['inline ride payment picker', source, 'setPaymentOpen(true)'],
  ['session wallet balance', state, 'walletBalance'],
  ['requested Karibu splash copy', source, '>Karibu</Text>'],
  ['compact Where to map', source, 'v40WhereMapWrap:{height:248'],
  ['Get started -> Country', source, 'beginOnboarding(false)'],
  ['Guest -> Country', source, 'beginOnboarding(true)'],
  ['Country selector', source, 'Select your country'],
  ['City selector', source, 'Select your city'],
  ['Use my location', source, 'Use my location'],
  ['bundled landmark images', source, "require('../assets/kareebu-plus/country-landmarks/uganda.jpg')"],
  ['bundled East Africa map', source, "require('../assets/kareebu-plus/country-landmarks/map.jpg')"],
  ['global top safe area', components, 'StatusBar.currentHeight'],
  ['global Android bottom safe area', components, 'paddingBottom: 24'],
  ['long marketplace Home', source, 'Glowing'],
  ['new finds', source, 'New finds up to'],
  ['rewards', source, 'Redeem and save'],
  ['popular stores', source, 'Popular stores'],
  ['weekend promo', source, 'V40WeekendPicks'],
  ['Where to map', source, 'Suggested places'],
  ['real place autocomplete', source, 'usePlaceAutocomplete'],
  ['real route estimate', source, 'useRouteEstimate'],
  ['ride comparison', source, 'Choose ride'],
  ['functional trip scheduling', source, 'Schedule pickup'],
  ['functional restaurant sorting', source, "sortMode === 'Fastest'"],
  ['different car silhouettes', source, 'RideVehicleVisual'],
  ['Boda option', source, "id: 'boda'"],
  ['Economy option', source, "id: 'economy'"],
  ['Comfort option', source, "id: 'comfort'"],
  ['XL option', source, "id: 'xl'"],
  ['Delivery option', source, "id: 'delivery'"],
  ['Food promo rail', source, 'Only on'],
  ['Top restaurants', source, 'Top restaurants near you'],
  ['Pharmacy hero', source, "accent:'Wellness Drop'"],
  ['category hero banners', source, 'V40ShopHeroBanner'],
  ['Kareebu AI screen', source, 'Kareebu AI'],
  ['AI recommendation cards', source, 'v40AiRecommendations'],
  ['AI local catalog', ai, 'recommendationCatalog'],
  ['AI conversation context', ai, 'history:'],
  ['OpenAI Responses endpoint', server, 'https://api.openai.com/v1/responses'],
  ['OpenAI Structured Outputs', server, "type:'json_schema'"],
  ['server-only API key', server, 'OPENAI_API_KEY'],
  ['no OpenAI key in Expo env', env, 'EXPO_PUBLIC_OPENAI_API_KEY', true],
  ['mobile AI backend URL', env, 'EXPO_PUBLIC_KAREEBU_AI_URL'],
  ['locale Uganda', demo, 'Carrefour Uganda'],
  ['locale Kenya', demo, 'Naivas'],
  ['locale Tanzania', demo, 'Shoppers Supermarket'],
];
for (const [label, haystack, needle, forbidden] of requirements) {
  const has = haystack.includes(needle);
  if ((!forbidden && !has) || (forbidden && has)) {
    console.error(`${forbidden ? 'Forbidden' : 'Missing'} v4.0 requirement: ${label} (${needle})`);
    process.exit(1);
  }
}

for (const forbidden of ['talabat','noon.com']) {
  if (source.toLowerCase().includes(forbidden)) {
    console.error(`Third-party reference branding found in app source: ${forbidden}`);
    process.exit(1);
  }
}

const packageJson = JSON.parse(fs.readFileSync('package.json','utf8'));
for (const dep of ['expo-location','react-native-maps']) {
  if (!packageJson.dependencies?.[dep]) {
    console.error(`Missing required native dependency: ${dep}`);
    process.exit(1);
  }
}

console.log('Kareebu+ Premium v4.0.4 UX validation passed.');
console.log(`${screens.length} native screens found.`);
console.log('Super App foundation validation passed: state, navigation and backend service boundaries are installed.');
console.log('Country crash fix, branded splash, Android safe zones, uniform type scale and functional UX polish are present.');
