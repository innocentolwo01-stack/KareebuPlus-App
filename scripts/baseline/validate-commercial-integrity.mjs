import fs from 'node:fs';

const read=(file)=>fs.readFileSync(file,'utf8');
const demo=read('src/demoData.ts');
const branches=read('src/food/realisticCatalog.ts');
const ride=read('src/ride/kareebuRidesHome.tsx');
const home=read('src/home/homeFeed.ts');
const shops=read('src/shops/ShopsLandingScreen.tsx');
const screens=read('src/screens.tsx');
const ai=read('src/ai/kareebuAssistant.ts');
const aiServer=read('server/kareebu-ai-api.mjs');
const topOffers=read('src/home/KareebuTopOffers.tsx');
const topPicks=read('src/home/KareebuTopPicks.tsx');
const foodPricing=read('src/food/pricing.ts');

const checks=[];
const pass=(name,condition)=>checks.push([name,Boolean(condition)]);
const none=(source,patterns)=>patterns.every((pattern)=>!pattern.test(source));

const unsupportedClaimPatterns=[
  /\b\d{1,2}%\s*off\b/i,
  /\bup to\s+\d{1,2}%\b/i,
  /\bfree delivery over\b/i,
  /\bfree delivery today\b/i,
  /\bbuy\s+\d+[^\n]{0,30}\bfree\b/i,
  /\bsave\s+UGX\b/i,
  /\bsave up to\b/i,
];

pass('reference merchant fixtures contain no unsupported percentage/free-delivery promotions',none(demo,unsupportedClaimPatterns));
pass('reference restaurant branch fixtures contain no unsupported promotional claims',none(branches,unsupportedClaimPatterns));
pass('school-rides package makes no unsupported percentage-saving claim',!ride.includes('Save up to 35%'));
pass('Home DineOut discovery cards do not manufacture star ratings',!home.includes("meta:'★ 4.7")&&!home.includes("meta:'★ 4.6"));
pass('legacy Top Offers component contains discovery copy rather than unsupported deal/discount copy',none(topOffers,[/Big toy deals/i,/Better prices/i,/on discount/i]));
pass('legacy Top Picks component does not expose invented old-price or Kareebu+ price fields',!topPicks.includes('oldPrice:')&&!topPicks.includes('plusPrice:'));

pass('Shops landing gates rating and ETA behind live availability',shops.includes("state==='open'?`${shop.category} · ★ ${shop.rating.toFixed(1)}")&&shops.includes("`${shop.category} · Reference listing`")&&shops.includes("state==='open'?` · ${shop.eta}`:''"));
pass('Home Food card hides rating and ETA for reference restaurants',screens.includes("item.contentTrust?.liveAvailability?`★ ${item.rating.toFixed(1)} · ${item.eta}`:'Reference listing · check current availability'"));
pass('restaurant detail does not render a synthetic reference rating panel',!screens.includes('Reference rating')&&screens.includes('Reference listing · live rating not connected'));
pass('restaurant detail hides reference delivery/spend metrics',screens.includes("restaurant.contentTrust?.liveAvailability?formatMoney(data.country,typicalSpend):'See menu'")&&screens.includes("restaurant.contentTrust?.liveAvailability?(restaurant.deliveryFee===0?'Free':formatMoney(data.country,deliveryFee)):'At checkout'"));
pass('global shop search does not expose reference ETA or deal text',screens.includes("subtitle:shop.contentTrust?.liveAvailability?`${shop.category} · ${shop.eta}`:`${shop.category} · Reference listing`")&&screens.includes('shop.inventoryHint??shop.category'));
pass('cart hides reference restaurant ETA and distance',screens.includes("restaurant.contentTrust?.liveAvailability?`${restaurant.eta} · ${restaurant.distance}`:'Reference listing · availability at checkout'"));

pass('AI store catalogue nulls commercial metrics unless live',ai.includes('rating: live ? shop.rating : null')&&ai.includes('eta: live ? shop.eta : null')&&ai.includes('deal: live ? shop.deal : null')&&ai.includes('contentTrust: shop.contentTrust'));
pass('AI restaurant catalogue nulls commercial metrics unless live',ai.includes('rating: live ? restaurant.rating : null')&&ai.includes('eta: live ? restaurant.eta : null')&&ai.includes("offer: live ? (restaurant.offer ?? null) : null")&&ai.includes('contentTrust: restaurant.contentTrust'));
pass('AI server explicitly forbids commercial metrics for reference-only entries',aiServer.includes('contentTrust.liveAvailability is true')&&aiServer.includes('never invent or infer live commercial metrics'));
pass('food coupon engine has no invented coupon codes',foodPricing.includes('FOOD_COUPON_CODES: readonly string[] = []'));

let failures=0;
for(const [name,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${name}`);
  if(!ok) failures+=1;
}
console.log(`Kareebu commercial integrity contracts: ${checks.length-failures}/${checks.length}.`);
process.exit(failures?1:0);
