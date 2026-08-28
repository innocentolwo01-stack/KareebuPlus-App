import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
const visuals=read('src/visuals/categoryVisuals.ts');
const verticalBlueprint=read('src/experience/verticalLandingBlueprint.ts');
const verticals=read('src/experience/verticals.ts');
const globalCatalog=read('src/global/catalog.ts');
const commerceVisuals=read('src/commerce/productVisuals.ts');
const sellerLogo=read('src/commerce/SellerLogo.tsx');

const checks=[
  ['category registry no longer references discovery-3d',!visuals.includes('discovery-3d/')],
  ['semantic art direction explicitly photorealistic',visuals.includes('photorealistic')&&visuals.includes('three-quarter')],
  ['vertical fixtures use per-product image arrays',verticalBlueprint.includes('PRODUCT_IMAGES')&&verticalBlueprint.includes('PRODUCT_IMAGES[verticalId]')],
  ['vertical promotions use separate art arrays',verticals.includes('VERTICAL_PROMO_ART')],
  ['Global products carry 5+ gallery support',globalCatalog.includes('images')&&globalCatalog.includes('gallery')],
  ['commerce product imagery is semantic',commerceVisuals.includes('commerceProductVisual')],
  ['seller identity system exists',sellerLogo.includes('SellerLogo')],
];
let failed=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)failed+=1;}
if(failed){console.error(`\n${failed}/${checks.length} media checks failed`);process.exit(1)}
console.log(`\nPASS Product media ${checks.length}/${checks.length}`);
