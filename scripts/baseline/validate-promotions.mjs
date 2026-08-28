import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const catalog=read('src/promotions/catalog.ts');
const types=read('src/promotions/types.ts');
const cards=read('src/promotions/PromotionCards.tsx');
const surface=read('src/promotions/PromotionSurface.tsx');
const category=read('src/categoryLanding/CategoryLandingPage.tsx');
const dineout=read('src/dineout/DineOutDiscoveryScreens.tsx');
const explore=read('src/parity/customerParity.tsx');
const rides=read('src/ride/kareebuRidesHome.tsx');
const boda=read('src/ride/kareebuBodaHome.tsx');
const screens=read('src/screens.tsx');

const checks=[
  ['central PromotionSurface exists',surface.includes('eligiblePromotions')&&surface.includes('recordPromotionImpression')],
  ['campaign frequency controls exist',types.includes('sessionCap?: number')&&types.includes('cooldownHours?: number')],
  ['professional creative types exist',types.includes('PHOTOGRAPHIC_HERO')&&types.includes('MERCHANT_CAMPAIGN')&&types.includes('MARKETPLACE_CAMPAIGN')],
  ['Home campaigns cover Global/Food/Shops',catalog.includes('HOME_GLOBAL')&&catalog.includes('HOME_FOOD')&&catalog.includes('HOME_SHOPS')],
  ['Food campaign family exists',catalog.includes("service:'food'")&&catalog.includes('FOOD_HERO')],
  ['Grocery campaign family exists',catalog.includes('GROCERY_FRESH')&&catalog.includes('GROCERY_HOUSEHOLD')],
  ['Pharmacy campaign family exists',catalog.includes('PHARMACY_VITAMINS')&&catalog.includes('PHARMACY_FIRST_AID')],
  ['Shops campaigns exist',catalog.includes('SHOP_INLINE')&&catalog.includes("service:'shops'" )],
  ['Rides campaigns stay out of map hero',rides.includes('rideContextPromotions')&&rides.includes('PromoCarousel')],
  ['Boda campaigns stay Boda-specific',boda.includes('bodaContextPromotions')&&catalog.includes('BODA_INLINE')],
  ['DineOut has hero + inline promotion',dineout.includes('DINEOUT_HERO')&&dineout.includes('DINEOUT_WEEKEND')],
  ['Go Out/Explore has campaign surface',explore.includes('GOOUT_HERO')&&catalog.includes('GOOUT_WELLNESS')],
  ['Global has category-specific campaigns',catalog.includes('GLOBAL_TECH')&&catalog.includes('GLOBAL_BEAUTY')&&catalog.includes('GLOBAL_HOME')],
  ['Category landing has contextual promotion',category.includes('CATEGORY_INLINE')],
  ['Activity marketing remains secondary',screens.includes("service:'activity'")&&screens.includes('visible.length>0&&activityPromotion')],
  ['Promotion card supports logo + foreground/background art',cards.includes('campaign.logo')&&cards.includes('foregroundImage')&&cards.includes('backgroundImage')],
  ['No fabricated Home weekend percentage discount remains',!screens.includes('`${30-index*5}% off`')],
];

let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed+=1;}
if(failed){console.error(`\n${failed}/${checks.length} promotion checks failed`);process.exit(1)}
console.log(`\nPASS Promotions ${checks.length}/${checks.length}`);
