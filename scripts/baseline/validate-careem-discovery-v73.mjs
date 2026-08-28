import fs from 'node:fs';

const required=[
  'src/catalog/master/kareebuUnifiedCatalog.ts',
  'src/discovery/types.ts',
  'src/discovery/domainConfig.ts',
  'src/discovery/document.ts',
  'src/discovery/controller.ts',
  'src/discovery/renderer.tsx',
  'src/discovery/widgets.tsx',
  'src/discovery/KareebuCareemDiscoveryScreen.tsx',
  'src/commerce/catalog.ts',
  'src/home/KareebuServiceCarousel.tsx',
];

for(const file of required){
  if(!fs.existsSync(file)){
    console.error(`FAIL — missing ${file}`);
    process.exit(1);
  }
  console.log(`PASS — ${file}`);
}

const types=fs.readFileSync('src/types.ts','utf8');
const screens=fs.readFileSync('src/screens.tsx','utf8');
const screen=fs.readFileSync('src/discovery/KareebuCareemDiscoveryScreen.tsx','utf8');
const document=fs.readFileSync('src/discovery/document.ts','utf8');
const config=fs.readFileSync('src/discovery/domainConfig.ts','utf8');
const widgets=fs.readFileSync('src/discovery/widgets.tsx','utf8');
const carousel=fs.readFileSync('src/home/KareebuServiceCarousel.tsx','utf8');
const serviceRegistry=fs.readFileSync('src/services/serviceRegistry.ts','utf8');

const checks=[
  ['five new Screen routes exist',['dineOut','groceries','electronics','homeCare','fix'].every((route)=>types.includes(`'${route}'`))],
  ['five new renderScreen cases exist',['dineOut','groceries','electronics','homeCare','fix'].every((route)=>screens.includes(`case '${route}'`))],
  ['Shops route uses the dedicated parity landing renderer',screens.includes(`case 'shops': return <ShopsLandingScreen`)],
  ['Careem-style yellow discovery header',screen.includes('backgroundColor:COLORS.yellow')],
  ['Deliver/near location hierarchy',screen.includes('locationEyebrow')],
  ['contextual discovery search',screen.includes('KareebuPageHeader')&&screen.includes('searchContext(')],
  ['filter bottom sheet',screen.includes('Filters & sorting')&&screen.includes('Show results')],
  ['sort controls avoid invented live rankings',screen.includes('Default order')&&!screen.includes('Top rated')&&!screen.includes('Fastest')],
  ['hero promotion comes from central campaign system',screen.includes('promotionsFor(')&&screen.includes('<PromotionHero campaign={heroPromotion}')&&!document.includes(`type:'hero-carousel'`)],
  ['quick filters',document.includes(`type:'filter-rail'`)],
  ['vertical hierarchy',document.includes(`type:'vertical-grid'`)],
  ['category hierarchy',document.includes(`type:'category-rail'`)],
  ['subcategory hierarchy',document.includes(`type:'subcategory-grid'`)],
  ['recommended items',document.includes(`type:'item-rail'`)],
  ['all items',document.includes(`type:'item-list'`)],
  ['Kareebu+ strip',document.includes(`type:'membership-strip'`)],
  ['semantic discovery art resolver remains centralized',widgets.includes('BrandIcon')],
  ['domain filters avoid invented live claims',config.includes("id:'delivery-details',label:'Delivery details'")&&config.includes("id:'delivery-details',label:'Availability details'")&&!config.includes("label:'Free delivery'")&&!config.includes("label:'Available today'")&&!config.includes("label:'Available now'")],
  ['secondary service routes are real',['dineOut','homeCare','fix'].every((route)=>screens.includes(`case '${route}'`))],
  ['Electronics has dedicated vertical route',screens.includes(`case 'electronicsHome': return <KareebuVerticalLandingRoute verticalId="electronics"`)],
  ['Groceries has dedicated route',serviceRegistry.includes(`id:'groceries'`)&&serviceRegistry.includes(`route:'groceries'`)&&screens.includes(`case 'groceries': return <KareebuVerticalLandingRoute verticalId="groceries"`)],
];

let pass=0;
for(const [label,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${label}`);
  if(ok)pass++;
}
console.log(`Kareebu V7.3 discovery checks: ${pass}/${checks.length}.`);
if(pass!==checks.length)process.exit(1);
