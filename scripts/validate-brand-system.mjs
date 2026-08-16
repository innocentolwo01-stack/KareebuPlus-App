import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const theme = read('src/theme.ts');
const components = read('src/components.tsx');
const assets = read('src/assets.ts');
const screens = read('src/screens.tsx');
const food = read('src/food/discovery/widgets/sections.tsx');
const foodHome = read('src/food/discovery/FoodDiscoveryHome.tsx');
const rides = read('src/ride/kareebuRidesHome.tsx');
const onboarding = read('src/onboarding/KareebuLaunchGate.tsx');

const checks = [];
const ok = (condition, label) => {
  if (!condition) {
    console.error(`FAIL — ${label}`);
    process.exitCode = 1;
  } else {
    checks.push(label);
    console.log(`PASS — ${label}`);
  }
};

ok(theme.includes("yellow: '#FFC400'"), 'Kareebu yellow is the primary accent');
ok(theme.includes("black: '#171717'"), 'Kareebu charcoal is the high-contrast shell');
ok(theme.includes("red: '#F23832'"), 'Kareebu red is the offer/attention role');
ok(theme.includes("green: '#19A85A'"), 'Kareebu green is the success/live/rating role');
ok(theme.includes('screenGutter: 14'), 'global customer screen gutter is 14px');
ok(theme.includes('sectionGap: 10'), 'global section spacing is compact');
ok(components.includes('paddingBottom: 24'), 'Android bottom system safe area remains 24px');
ok(components.includes('height: 48'), 'shared customer header remains 48px');
ok(theme.includes('screenTitle:') && theme.includes('fontSize: 22'), 'functional screen title role is 22px');
ok(theme.includes('sectionTitle:') && theme.includes('fontSize: 18'), 'functional section title role is 18px');
ok(theme.includes("ios: 'System'"), 'iOS typography uses the system family consistently');
ok(theme.includes("android: 'sans-serif'"), 'Android typography uses the system family consistently');

for (const asset of [
  'rides','boda','food','shops','send','groceries','pay','pharmacies',
  'electronics','dineout','fix','forGood','goOut','healthcare','homeCare','homeServices'
]) {
  ok(assets.includes(`${asset}: require(`), `3D semantic asset ${asset}`);
}

ok(components.includes('export function BrandIcon'), 'shared BrandIcon renderer exists');
ok(components.includes('semanticForIcon'), 'legacy vector semantics map into the 3D atlas');
ok(components.includes('backgroundColor: COLORS.yellow') && components.includes('primaryButtonText: { ...TYPE.button, color: COLORS.black }'), 'primary CTA is Kareebu yellow with black copy');
ok(components.includes('bottomNavIconBubbleActive'), 'bottom navigation retains a clear selected state');
ok(components.includes('<BrandIcon semantic={item.semantic}'), 'bottom navigation uses 3D Kareebu art');
ok(components.includes('<BrandIcon icon={icon} size={30} tile'), 'shared account/menu rows use 3D Kareebu art');

ok(screens.includes('<BrandIcon icon={item.icon} size={34} tile/>'), 'Pay actions use 3D Kareebu art');
ok(screens.includes('<BrandIcon icon={icon as any} size={32} tile />'), 'Account quick actions use 3D Kareebu art');
ok(screens.includes('<BrandIcon icon={item.icon} size={34} tile/>'), 'Activity cards use 3D Kareebu art');
ok(screens.includes('<BrandIcon icon={icon} size={38}/>'), 'Shop categories use 3D Kareebu art');
ok(screens.includes('<BrandIcon icon={item.icon as any} size={50}/>'), 'Store product cards use the 3D semantic system');
ok(screens.includes('Payments & rewards'), 'Account grouped information architecture retained');
ok(screens.includes('uxQuickGrid'), 'Account quick action contract retained');

for (const [name, source] of [
  ['Rides', rides],
  ['Food widgets', food],
  ['Food shell', foodHome],
]) {
  for (const legacy of ['#07594E','#01483E','#19E6AF','#18E1A9','#D7FF18']) {
    ok(!source.includes(legacy), `${name} contains no legacy Careem shell colour ${legacy}`);
  }
}

ok(food.includes('filterChipActive:{backgroundColor:COLORS.yellow'), 'Food active filter uses Kareebu yellow');
ok(food.includes('...TYPE.sectionTitle'), 'Food discovery uses shared section typography');
ok(food.includes('categoryColumn:{width:92'), 'Food categories are compact');
ok(rides.includes('backgroundColor: COLORS.black'), 'Rides dark shell uses Kareebu charcoal');
ok(rides.includes('backgroundColor: COLORS.yellow'), 'Rides primary/selected states use Kareebu yellow');

ok(onboarding.includes('provider={PROVIDER_GOOGLE}'), 'V6.10.2 live Google country onboarding is retained');
ok(onboarding.includes('@kareebu/plus/onboarding-v10-complete'), 'versioned first-run onboarding is retained');

if (process.exitCode) process.exit(process.exitCode);
console.log(`\nPASS — Kareebu+ global brand-system checks complete (${checks.length}/${checks.length}).`);
