import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const types = read('src/types.ts');
const screens = read('src/screens.tsx');
const frontend = read('src/v41/frontend.tsx');
const pkg = JSON.parse(read('package.json'));

const routes = [
  'categories','categoryItems','brands','brandItems','campaigns','campaignDetails','flashSale','offers','allStores','itemViewAll','searchFilters',
  'addresses','addAddress','language','interests','guestTrackOrder','orderDetails','monthlyOrders','myItems','paymentMethods','paymentFailed',
  'subscriptionPlans','subscriptionResult','groceryList','medicineList','rentalFavourites','providerProfile','rideOffers','legal','updateApp','noInternet','qr','partnerRegistration',
  'signIn','signUp','forgotPassword','verification','resetPassword','globalCart','offlinePayment','paymentProcessing','ridePayment',
];
const components = [
  'CategoriesScreen','CategoryItemsScreen','BrandsScreen','BrandItemsScreen','CampaignsScreen','CampaignDetailsScreen','FlashSaleScreen','OffersScreen','AllStoresScreen',
  'ItemViewAllScreen','SearchFiltersScreen','AddressesScreen','AddAddressScreen','LanguageScreen','InterestsScreen','GuestTrackOrderScreen','OrderDetailsScreen',
  'MonthlyOrdersScreen','MyItemsScreen','PaymentMethodsScreen','PaymentFailedScreen','SubscriptionPlansScreen','SubscriptionResultScreen','GroceryListScreen','MedicineListScreen',
  'RentalFavouritesScreen','ProviderProfileScreen','RideOffersScreen','LegalScreen','UpdateScreen','NoInternetScreen','QrScreen','PartnerRegistrationScreen',
  'SignInScreen','SignUpScreen','ForgotPasswordScreen','VerificationScreen','ResetPasswordScreen','GlobalCartScreen','OfflinePaymentScreen','PaymentProcessingScreen','RidePaymentScreen',
];
const assets = [
  'coupon.png','empty_cart.png','flash_sale_deshboard.png','grocery_list.png','language.png','loyalty_icon.png','no_address.png','no_coupon.png','no_data_found.png',
  'no_internet.png','notification_placeholder.jpg','order_place_holder.png','predcription_icon.png','pro_plan_crown.png','profile_bg.png','qrscanner.png','refer_earn.png',
  'refund.png','support_redesign.png','tracking.png','update.png','wallet.png',
];

const failures = [];
for (const route of routes) {
  if (!types.includes(`'${route}'`)) failures.push(`missing Screen route: ${route}`);
  if (!screens.includes(`case '${route}'`)) failures.push(`missing renderScreen case: ${route}`);
}
for (const component of components) {
  if (!frontend.includes(`export function ${component}`)) failures.push(`missing frontend component: ${component}`);
  if (!screens.includes(component)) failures.push(`component not imported/used by router: ${component}`);
}
for (const asset of assets) {
  if (!fs.existsSync(path.join(root, 'assets/v41', asset))) failures.push(`missing V4.1 UI asset: ${asset}`);
}
const requiredLinks = [
  [screens, "screen:'categories'", 'Home/services category entry'],
  [screens, "screen:'globalCart'", 'Global cart service entry'],
  [screens, "actions.go('searchFilters')", 'Search filters entry'],
  [screens, "actions.go('ridePayment')", 'Ride payment handoff'],
  [screens, "actions.go('addresses')", 'Account addresses entry'],
  [screens, "actions.go('paymentMethods')", 'Account payment methods entry'],
  [frontend, "actions.go('offlinePayment')", 'Offline payment entry'],
  [frontend, "actions.go('paymentProcessing')", 'Payment webview/secure payment entry'],
];
for (const [source, needle, label] of requiredLinks) if (!source.includes(needle)) failures.push(`missing navigation link: ${label}`);

const matrixPath = path.join(root, 'docs/v41-frontend-parity-matrix.md');
if (!fs.existsSync(matrixPath)) failures.push('missing docs/v41-frontend-parity-matrix.md');
else {
  const matrix = fs.readFileSync(matrixPath,'utf8');
  const mapped = (matrix.match(/Mapped to Kareebu route/g) || []).length;
  const excluded = (matrix.match(/Excluded \(Android scope\)/g) || []).length;
  if (mapped < 123) failures.push(`front-end matrix maps only ${mapped} Android donor screens; expected 123`);
  if (excluded !== 2) failures.push(`front-end matrix excludes ${excluded} screens; expected 2 web-only screens`);
}

if (pkg.scripts?.['validate:frontend'] !== 'node scripts/validate-v41-frontend.mjs') failures.push('package.json validate:frontend script missing or incorrect');

if (failures.length) {
  console.error('V4.1 front-end parity validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
const handled = [...screens.matchAll(/case '([^']+)'/g)].map((m) => m[1]);
console.log(`V4.1 Android front-end parity validation passed: ${routes.length}/${routes.length} added donor-surface routes wired.`);
console.log(`renderScreen handles ${handled.length} route cases.`);
console.log('123 Android donor Flutter screen files are mapped; 2 web-only screens are intentionally excluded.');
console.log('Scope: complete customer front-end route/surface coverage; emulator parity QA and live-backend completion remain separate gates.');
