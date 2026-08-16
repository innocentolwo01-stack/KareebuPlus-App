import fs from 'node:fs';

const screen=fs.readFileSync('src/discovery/KareebuCareemDiscoveryScreen.tsx','utf8');
const widgets=fs.readFileSync('src/discovery/widgets.tsx','utf8');
const document=fs.readFileSync('src/discovery/document.ts','utf8');
const config=fs.readFileSync('src/discovery/domainConfig.ts','utf8');
const catalog=fs.readFileSync('src/catalog/master/kareebuUnifiedCatalog.ts','utf8');
const app=fs.readFileSync('App.tsx','utf8');

const checks=[
  ['internal Powered by discovery label removed',!screen.includes('Powered by Kareebu discovery')],
  ['compact 52px search shell',screen.includes('height:52')],
  ['compact 50px utility buttons',screen.includes('width:50,height:50')],
  ['local title-aware DiscoveryArt renderer',widgets.includes('DiscoveryArt')],
  ['hero has local 3D fallback',widgets.includes('heroFallback')&&widgets.includes('onError={()=>setFailed(true)}')],
  ['item image fallback is domain-aware',
    widgets.includes('DiscoveryArt title={item.name} domainId={item.domainId} size={64}') &&
    !widgets.includes('<BrandIcon semantic=\"shops\" size={54}/>')],
  ['DineOut cards are merchant-first',widgets.includes("const dineOut=item.domainId==='dineout'")],
  ['recommendations stay inside selected vertical/category',document.includes('recommendationPool')&&document.includes('item.categoryId===selectedCategory.id')],
  ['subcategory heading follows selected category',document.includes("title:selectedCategory?.title??config.subcategoryHeading")],
  ['category heading follows selected vertical',document.includes("title:selectedVertical?.title??config.categoryHeading")],
  ['Offers uses valid Feather tag icon',config.includes("id:'offers',label:'Offers',icon:'tag'")],
  ['old invalid pricetag icon removed',!config.includes("icon:'pricetag'")],
  ['DineOut provider pool is realistic',catalog.includes('The Pearl Table')&&catalog.includes('Kampala Social')&&catalog.includes('Saffron House')],
  ['new discovery routes classify as Explore',app.includes('electronics|groceries|homecare|fix')],
];

let pass=0;
for(const [label,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${label}`);
  if(ok)pass++;
}
console.log(`Kareebu V7.4 visual parity checks: ${pass}/${checks.length}.`);
if(pass!==checks.length)process.exit(1);
