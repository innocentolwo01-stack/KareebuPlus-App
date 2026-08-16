import fs from 'node:fs';

const boda = fs.readFileSync('src/ride/kareebuBodaHome.tsx','utf8');
const mobility = fs.readFileSync('src/ride/mobilityScreens.tsx','utf8');

let passed=0;
const checks=[];
function ok(condition,label){
  checks.push({condition,label});
  if(condition)passed++;
  console.log(`${condition?'PASS':'FAIL'} — ${label}`);
}

ok(mobility.includes("import { KareebuBodaHomeScreen } from './kareebuBodaHome';"), 'MobilityHome imports dedicated Boda experience');
ok(mobility.includes("data.selectedVehicleMode === 'BODA'"), 'Boda routing is mode-aware');
ok(mobility.includes('<KareebuBodaHomeScreen data={data} actions={actions} />'), 'Boda mode renders dedicated Rides-parity screen');
ok(mobility.includes('LegacyMobilityHomeScreen'), 'legacy mobility fallback is preserved for safety');

ok(boda.includes('<MapView'), 'Boda is map-first like Rides');
ok(boda.includes('height:405'), 'Boda map hero matches Rides geometry');
ok(boda.includes('styles.searchPanel'), 'Boda uses the same search-panel architecture');
ok(boda.includes('Where to?'), 'Boda has Rides-style destination entry');
ok(boda.includes('Kareebu Boda pickup'), 'Boda has pickup confirmation context');
ok(boda.includes("actions.selectMode('BODA')"), 'Boda booking explicitly locks motorcycle mode');
ok(boda.includes("actions.selectRide('boda')"), 'Boda booking explicitly selects Boda fare product');
ok(boda.includes("actions.go('whereTo')"), 'Boda enters the existing destination flow');
ok(boda.includes("actions.go('rideSchedule')"), 'Boda supports scheduled pickup');
ok(boda.includes("actions.go('rideSafety')"), 'Boda has a direct safety route');
ok(boda.includes("actions.go('rideHistory')"), 'Boda exposes trip history');
ok(boda.includes("actions.go('rideSettings')"), 'Boda exposes ride settings');

ok(boda.includes('MaterialCommunityIcons name="motorbike"'), 'map markers are motorcycles, never cars');
ok(boda.includes('assets.service.boda'), 'Boda uses the branded 3D Boda asset');
ok(boda.includes('nearby bodas'), 'map surfaces nearby Boda availability');
ok(boda.includes('Boda for every move'), 'Boda has service-specific merchandising');
ok(boda.includes('Helmet included'), 'helmet expectation is explicit');
ok(boda.includes('1 passenger'), 'Boda passenger capacity is explicit');
ok(boda.includes('Light luggage'), 'Boda luggage constraint is explicit');
ok(boda.includes('Verified Captain'), 'Boda verification is explicit');
ok(boda.includes('Kareebu+ Boda'), 'membership banner is Boda-specific');
ok(boda.includes('Popular around'), 'Boda includes short-city route discovery');
ok(boda.includes('Boda Saver'), 'Boda has service-specific offer merchandising');

ok(!boda.includes('School Rides'), 'car-specific School Rides shortcut is removed from Boda');
ok(!boda.includes('City to City'), 'long-distance car shortcut is removed from Boda');
ok(!boda.includes('map-car.png'), 'Boda never renders car markers');
ok(!boda.includes('StyleSheet.absoluteFillObject'), 'unsupported React Native StyleSheet API is absent');
ok(boda.includes('useRegisterBackControl(true)'), 'Boda custom header registers its back control');

console.log(`Kareebu+ Boda/Rides parity checks complete: ${passed}/${checks.length}.`);
if(checks.some((item)=>!item.condition))process.exit(1);
