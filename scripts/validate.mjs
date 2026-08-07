import fs from 'node:fs';
import path from 'node:path';

const required = [
  'App.tsx', 'package.json', 'app.json', 'tsconfig.json',
  'src/screens.tsx', 'src/components.tsx', 'src/assets.ts', 'src/theme.ts', 'src/types.ts',
  'assets/icon.png', 'assets/adaptive-icon.png', 'assets/native-splash.png',
  'assets/kareebu-plus/kareebu-plus-mark.png',
  'assets/kareebu-plus/kareebu-plus-wordmark.png',
  'assets/kareebu-plus/kareebu-black-visual.png',
  'assets/karibu/premium/welcome-hero-premium.png',
  'assets/karibu/premium/where-map-premium.png',
  'assets/karibu/premium/rides.png', 'assets/karibu/premium/boda.png',
  'assets/karibu/premium/food.png', 'assets/karibu/premium/shops.png',
  'assets/karibu/premium/send.png', 'assets/karibu/premium/groceries.png',
  'assets/karibu/premium/pay.png', 'assets/karibu/premium/all.png',
  'assets/karibu/maps/driver.png', 'assets/karibu/maps/on-trip.png',
  'assets/karibu/food/promo.png', 'assets/karibu/shops/promo.png'
];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error('Missing required files:\n' + missing.join('\n'));
  process.exit(1);
}
const source = fs.readFileSync('src/screens.tsx', 'utf8');
const screens = [
  'SplashScreen','WelcomeScreen','LocationScreen','PhoneScreen','OtpScreen','ProfileScreen','PermissionsScreen',
  'HomeScreen','WhereToScreen','ChooseRideScreen','ConfirmBookingScreen','DriverScreen','OnTripScreen',
  'TripCompleteScreen','RateTripScreen','FoodScreen','RestaurantScreen','CartScreen','OrderTrackingScreen',
  'ShopsScreen','ParcelScreen','WalletScreen','AccountScreen','ActivityScreen','OrdersScreen'
];
for (const name of screens) {
  if (!source.includes(`function ${name}`)) {
    console.error(`Missing screen: ${name}`);
    process.exit(1);
  }
}

const appConfig = JSON.parse(fs.readFileSync('app.json', 'utf8')).expo;
if (appConfig.name !== 'Kareebu+' || appConfig.slug !== 'kareebu-plus') {
  console.error('Kareebu+ app identity is not configured correctly.');
  process.exit(1);
}
if (source.includes('<ScreenShell scroll contentStyle={styles.welcome')) {
  console.error('Welcome screen must not scroll.');
  process.exit(1);
}
if (!source.includes('kareebuPromo:{height:160')) {
  console.error('Compact Kareebu Black banner style is missing.');
  process.exit(1);
}
if (!source.includes('color={COLORS.black}')) {
  console.error('Guest access must be presented as a text link under the main button.');
  process.exit(1);
}

for (const phrase of ['Continue as guest', 'Sign in to book', 'Kareebu Black', 'Recent activity']) {
  if (!source.includes(phrase)) {
    console.error(`Missing UX requirement: ${phrase}`);
    process.exit(1);
  }
}
console.log('Kareebu+ Premium v2.1 validation passed.');
console.log(`${screens.length} native screens found.`);
console.log('Premium service assets, onboarding, guest access and complete boda journey are present.');
