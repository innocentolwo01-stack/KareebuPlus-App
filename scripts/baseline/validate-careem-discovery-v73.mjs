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

const checks=[
  ['five new Screen routes exist',['dineOut','groceries','electronics','homeCare','fix'].every((route)=>types.includes(`'${route}'`))],
  ['five new renderScreen cases exist',['dineOut','groceries','electronics','homeCare','fix'].every((route)=>screens.includes(`case '${route}'`))],
  ['Shops route uses shared discovery renderer',screens.includes(`case 'shops': return <KareebuDomainDiscoveryRoute`)],
  ['Careem-style yellow discovery header',screen.includes('backgroundColor:COLORS.yellow')],
  ['Deliver/near location hierarchy',screen.includes('locationEyebrow')],
  ['full-width discovery search',screen.includes('searchPlaceholder')],
  ['filter bottom sheet',screen.includes('Filters & sorting')&&screen.includes('Show results')],
  ['sort controls',screen.includes('Recommended')&&screen.includes('Top rated')&&screen.includes('Fastest')],
  ['hero promotions',document.includes(`type:'hero-carousel'`)],
  ['quick filters',document.includes(`type:'filter-rail'`)],
  ['vertical hierarchy',document.includes(`type:'vertical-grid'`)],
  ['category hierarchy',document.includes(`type:'category-rail'`)],
  ['subcategory hierarchy',document.includes(`type:'subcategory-grid'`)],
  ['recommended items',document.includes(`type:'item-rail'`)],
  ['all items',document.includes(`type:'item-list'`)],
  ['Kareebu+ strip',document.includes(`type:'membership-strip'`)],
  ['3D semantic discovery art',widgets.includes('BrandIcon')],
  ['domain-specific filters',config.includes('Available today')&&config.includes('Free delivery')&&config.includes('Available now')],
  ['Home routes are real',carousel.includes(`screen: 'homeCare'`)&&carousel.includes(`screen: 'fix'`)&&carousel.includes(`screen: 'dineOut'`)],
  ['Electronics has dedicated route',carousel.includes(`screen: 'electronics'`)],
  ['Groceries has dedicated route',carousel.includes(`screen: 'groceries'`)],
];

let pass=0;
for(const [label,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${label}`);
  if(ok)pass++;
}
console.log(`Kareebu V7.3 discovery checks: ${pass}/${checks.length}.`);
if(pass!==checks.length)process.exit(1);
