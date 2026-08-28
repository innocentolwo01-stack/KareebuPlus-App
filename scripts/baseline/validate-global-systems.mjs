import fs from 'node:fs';

const read=(path)=>fs.readFileSync(path,'utf8');
const checks=[
  ['Global route family',read('src/types.ts'),['globalHome','globalProduct','globalBasket','globalCheckout','globalTracking','globalReturns']],
  ['Global fulfilment model',read('src/global/types.ts'),['GlobalQuoteState','price_changed','international_transit','country-restricted','partnerStatus']],
  ['Global quote boundary',read('src/global/quoteEngine.ts'),['GlobalQuoteProvider','estimatedDutyTax','estimateNotice','reference-fixture']],
  ['Global customer screens',read('src/global/screens.tsx'),['Pay locally. We handle the rest.','Landed-price breakdown','Place Global order','Global tracking','Returns, refunds & support']],
  ['Promotion runtime',read('src/promotions/engine.ts'),['eligiblePromotions','frequencyCap','dismissPromotion','paymentMethod']],
  ['Shared location contract',read('src/location/engine.ts'),['OperationalLocation','latitude','refinePickup','MapCameraIntent']],
  ['Unified transactions',read('src/activity/transactionEngine.ts'),['UnifiedTransaction','in_progress','activeTransactions']],
  ['Activity Global integration',read('src/screens.tsx'),['lastGlobalOrder','globalTracking','Search Kareebu Global']],
];
let failed=false;
for(const [name,source,needles] of checks){const missing=needles.filter(n=>!source.includes(n));if(missing.length){failed=true;console.error(`FAIL ${name}: ${missing.join(', ')}`)}else console.log(`PASS ${name}`)}
if(failed)process.exit(1);
