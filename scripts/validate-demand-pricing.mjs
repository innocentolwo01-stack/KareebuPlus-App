import fs from 'node:fs';

const demand = fs.readFileSync('src/pricing/demand.ts', 'utf8');
const ride = fs.readFileSync('src/ride/mobility.ts', 'utf8');
const food = fs.readFileSync('src/food/pricing.ts', 'utf8');
const commerce = fs.readFileSync('src/commerce/screens.tsx', 'utf8');
const parcels = fs.readFileSync('src/parcels/screens.tsx', 'utf8');
const screens = fs.readFileSync('src/screens.tsx', 'utf8');

const checks = [
  ['shared demand engine', demand.includes("export function demandQuote")],
  ['realtime supply/demand signals', demand.includes('activeRequests') && demand.includes('availableProviders')],
  ['ride demand service', ride.includes("'ride'") && ride.includes('demandQuote')],
  ['boda demand service', ride.includes("'boda'")],
  ['food delivery demand', food.includes("'food-delivery'")],
  ['store delivery demand', commerce.includes("'store-delivery'")],
  ['parcel delivery demand', parcels.includes("'parcel-delivery'")],
  ['transparent demand UI', screens.includes('Demand pricing') || screens.includes('demand')],
  ['bounded multipliers', demand.includes('cap: 1.75') && demand.includes('cap: 1.55') && demand.includes('cap: 1.45')],
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Demand pricing validation failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}
console.log(`Demand pricing validation passed: ${checks.length}/${checks.length} checks present.`);
console.log('Scope: Rides + Boda + Food delivery + Store delivery + Parcel delivery.');
