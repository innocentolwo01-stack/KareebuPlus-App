import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const files = {
  screens: read('src/screens.tsx'),
  app: read('App.tsx'),
  types: read('src/types.ts'),
  commerce: read('src/commerce/screens.tsx'),
  catalog: read('src/commerce/catalog.ts'),
  parcels: read('src/parcels/screens.tsx'),
  rides: read('src/ride/parityScreens.tsx'),
  rentals: read('src/rental/screens.tsx'),
  services: read('src/services/screens.tsx'),
  engagement: read('src/engagement/screens.tsx'),
  parityTypes: read('src/parity/types.ts'),
};

const checks = [
  // Commerce: Grocery / Shop / Pharmacy share a real product-cart-checkout engine.
  ['commerce product details', files.commerce, 'CommerceProductScreen'],
  ['commerce variants', files.commerce, 'Choose option'],
  ['pharmacy prescription gate', files.commerce, 'Prescription required'],
  ['persistent commerce cart', files.app, 'commerceCartLines'],
  ['store minimum order', files.commerce, 'minimumRemaining'],
  ['delivery and pickup', files.commerce, "fulfillment === 'pickup'"],
  ['scheduled store delivery', files.commerce, 'Tomorrow · 9:00 AM'],
  ['store delivery instructions', files.commerce, 'Call on arrival'],
  ['store coupon', files.commerce, "couponCode === 'KAREEBU10'"],
  ['mobile money checkout', files.commerce, "id:'mtn'"],
  ['cash checkout', files.commerce, "id:'cash'"],
  ['commerce order created', files.commerce, 'placeOrder'],
  ['grocery catalogue', files.catalog, "store.category === 'Groceries'"],
  ['pharmacy catalogue', files.catalog, "store.category === 'Pharmacy'"],
  ['marketplace catalogue', files.catalog, "store.category === 'Marketplace'"],

  // Parcels / Collect flow.
  ['parcel category selection', files.parcels, 'What are you sending?'],
  ['parcel pickup and dropoff', files.parcels, 'Pickup address'],
  ['parcel sender/receiver details', files.parcels, 'Receiver name'],
  ['parcel price estimate', files.parcels, 'Delivery total'],
  ['parcel payment', files.parcels, 'SectionTitle title="Payment"'],
  ['parcel order created', files.parcels, 'placeOrder'],
  ['parcel live-status timeline', files.parcels, 'Track parcel'],

  // Ride/Boda bidding and safety must affect the booked trip, not be a dead route.
  ['ride fare bidding', files.rides, 'Driver offers'],
  ['nearby driver offers', files.rides, 'Nearby drivers'],
  ['selected driver offer state', files.app, 'selectedRideBidId'],
  ['selected offer affects confirmation fare', files.screens, 'selectedRideOffer(data)'],
  ['selected driver appears in matched screen', files.screens, 'driverName = offer?.driverName'],
  ['ride safety toolkit', files.rides, 'Safety toolkit'],
  ['share trip safety action', files.rides, 'Share trip'],

  // Vehicle rental.
  ['rental discovery', files.rentals, 'Drive your way'],
  ['rental vehicle details', files.rentals, 'Vehicle details'],
  ['rental date/pickup choice', files.rentals, 'Rental length'],
  ['rental deposit', files.rentals, 'Refundable deposit'],
  ['rental booking confirmation', files.rentals, 'Booking confirmed'],

  // Services marketplace.
  ['services marketplace', files.services, 'ServiceMarketplaceScreen'],
  ['verified provider discovery', files.services, 'verified providers'],
  ['custom service request', files.services, 'Describe the job'],
  ['provider bidding', files.services, 'Provider bids'],
  ['service checkout', files.services, 'Confirm service'],
  ['service tracking', files.services, 'Track service'],

  // Wallet / loyalty / engagement.
  ['rewards redemption', files.engagement, 'Redeem points'],
  ['coupons wallet', files.engagement, 'Your offers'],
  ['referral sharing', files.engagement, 'Share invite'],
  ['notifications centre', files.engagement, 'Notifications'],
  ['messages inbox', files.engagement, 'Messages'],
  ['working local chat composer', files.engagement, 'setMessages'],
  ['reels/discover', files.engagement, 'Discover'],
  ['paid membership', files.engagement, 'Kareebu Black'],
  ['favourites', files.engagement, 'Favourites'],
  ['support centre', files.engagement, 'Help & support'],
  ['settings', files.engagement, 'Push notifications'],
  ['profile editing', files.engagement, 'Save profile'],
  ['refund flow', files.engagement, 'Submit refund request'],
  ['review flow', files.engagement, 'Submit review'],

  // Cross-module integration.
  ['orders aggregate commerce', files.screens, 'lastCommerceOrder'],
  ['orders aggregate parcels', files.screens, 'lastParcelOrder'],
  ['orders aggregate rentals', files.screens, 'lastRentalBooking'],
  ['orders aggregate services', files.screens, 'lastServiceBooking'],
  ['wallet links to rewards', files.screens, "actions.go('rewards')"],
  ['account links to notifications', files.screens, "actions.go('notifications')"],
  ['account links to messages', files.screens, "actions.go('messages')"],
  ['service catalogue links to rentals', files.screens, "screen:'rentals'"],
  ['service catalogue links to local services', files.screens, "screen:'serviceMarketplace'"],
];

const missing = checks.filter(([, source, needle]) => !source.includes(needle));
if (missing.length) {
  for (const [label, , needle] of missing) console.error(`Missing V4.1 parity requirement: ${label} (${needle})`);
  process.exit(1);
}

// Every Screen union member must be handled by renderScreen.
const unionStart = files.types.indexOf('export type Screen =');
const unionEnd = files.types.indexOf(';', unionStart);
const unionText = files.types.slice(unionStart, unionEnd);
const routes = [...unionText.matchAll(/\|\s*'([^']+)'/g)].map((m) => m[1]);
const missingRoutes = routes.filter((route) => !files.screens.includes(`case '${route}'`));
if (missingRoutes.length) {
  console.error(`Routes missing from renderScreen: ${missingRoutes.join(', ')}`);
  process.exit(1);
}

console.log(`V4.1 remaining-module parity validation passed: ${checks.length}/${checks.length} feature checks present.`);
console.log(`${routes.length} Screen routes are handled by renderScreen.`);
console.log('Scope: commerce + parcels + rides + rental + services + rewards/engagement + unified orders/account integration.');
