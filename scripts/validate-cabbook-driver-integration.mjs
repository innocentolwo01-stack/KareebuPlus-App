import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const contract=read('src/ride/captainDriverParity.tsx');
const screens=read('src/screens.tsx');
const app=read('App.tsx');
const mobility=read('src/ride/mobility.ts');

const checks=[
  ['driver lifecycle status type', contract.includes("'otp_required'") && contract.includes("'rejected'") && contract.includes("'cancelled'")],
  ['driver ride endpoint', contract.includes("rides: 'api/ride/rides'")],
  ['driver ratings endpoint', contract.includes('driverRatingsSummary')],
  ['driver vehicle types endpoint', contract.includes('vehicleTypes')],
  ['driver wallet endpoints', contract.includes('walletEarnings') && contract.includes('walletTransactions')],
  ['courier delivery semantics', contract.includes("CaptainJobType = 'ride' | 'intercity' | 'courier'")],
  ['captain lifecycle UI', contract.includes('CaptainLifecycleCard')],
  ['app ride status state', app.includes('captainRideStatus') && app.includes('setCaptainRideStatus')],
  ['screen data ride status', screens.includes('captainRideStatus: CaptainRideStatus')],
  ['accepted/on-way/arrived passenger states', screens.includes("setCaptainRideStatus('on_way')") && screens.includes("setCaptainRideStatus('arrived')")],
  ['Ride OTP handoff', screens.includes('Share Ride OTP') && screens.includes("setCaptainRideStatus('ongoing')")],
  ['trip completion state', screens.includes("setCaptainRideStatus('complete')")],
  ['trip cancellation state', screens.includes("setCaptainRideStatus('cancelled')")],
  ['captain online fields', mobility.includes('isOnline') && mobility.includes('servicePreference')],
];

const failed=checks.filter(([,ok])=>!ok);
if(failed.length){
  console.error('CabBook driver integration validation failed:');
  for(const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}
console.log(`CabBook driver ride integration passed: ${checks.length}/${checks.length} checks present.`);
console.log('Scope: driver duty/API semantics + passenger lifecycle + OTP + live-state handoff contract.');
