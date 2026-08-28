import fs from 'node:fs';

const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const files={
  screens:read('src/screens.tsx'),
  app:read('App.tsx'),
  types:read('src/types.ts'),
  mobility:read('src/ride/mobility.ts'),
  ui:read('src/ride/mobilityScreens.tsx'),
  parity:read('src/ride/parityScreens.tsx'),
};

const checks=[
  ['mobility entry','mobilityHome'],
  ['map destination handoff',"actions.go('whereTo')"],
  ['Ride mode','Cars for every trip'],
  ['Boda mode','Fast through traffic'],
  ['scheduled rides','Schedule a ride'],
  ['work rides','Work rides'],
  ['school runs','School runs'],
  ['safeguarding','Safeguarded school journeys'],
  ['priority matching','Priority matching'],
  ['Captain offers','captainOffers'],
  ['fare bidding','Choose your fare'],
  ['fare breakdown','rideFareBreakdown'],
  ['demand adjustment','Demand adjustment'],
  ['membership saving','Kareebu Black saving'],
  ['promo code','RIDE10'],
  ['payment route','ridePayment'],
  ['Captain profile','CaptainProfileScreen'],
  ['verified Captain','Identity and vehicle verified'],
  ['pickup verification','Your pickup code'],
  ['live trip','On trip'],
  ['safety toolkit','rideSafety'],
  ['trip receipt','RideReceiptScreen'],
  ['ride history','RideHistoryScreen'],
  ['receipt persistence','setLastRideReceipt'],
];

const corpus=Object.values(files).join('\n');
const missing=checks.filter(([,needle])=>!corpus.includes(needle));
if(missing.length){
  console.error(`Mobility parity validation failed: ${missing.length}/${checks.length} checks missing.`);
  for(const [name,needle] of missing) console.error(`- ${name}: ${needle}`);
  process.exit(1);
}
console.log(`Mobility parity validation passed: ${checks.length}/${checks.length} checks present.`);
console.log('Scope: mobility home -> location -> vehicle -> Captain offers -> fare/payment -> pickup -> live trip -> safety -> receipt/history, plus scheduled/work/school ride products.');
