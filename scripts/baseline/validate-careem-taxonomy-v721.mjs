import fs from 'node:fs';

const source=fs.readFileSync('src/catalog/master/kareebuUnifiedCatalog.ts','utf8');
const commerce=fs.readFileSync('src/commerce/catalog.ts','utf8');

const checks=[
  ['verified donor SHA policy',source.includes('KAREEBU_UNIFIED_CATALOG_VERSION')],
  ['7 domains',source.includes('KAREEBU_CATALOG_DOMAINS.length!==7')],
  ['65 verticals',source.includes('KAREEBU_CATALOG_VERTICALS.length!==65')],
  ['200 categories',source.includes('KAREEBU_CATALOG_CATEGORIES.length!==200')],
  ['690 subcategories',source.includes('KAREEBU_CATALOG_SUBCATEGORIES.length!==690')],
  ['2070 items',source.includes('KAREEBU_UNIFIED_ITEMS.length!==2070')],
  ['Food hierarchy',source.includes("'food'")&&source.includes('Cuisine.kt')],
  ['DineOut hierarchy',source.includes("'dineout'")&&source.includes('dineout/filter_v6')],
  ['Groceries hierarchy',source.includes("'groceries'")],
  ['Shops hierarchy',source.includes("'shops'")&&source.includes('SubVerticalListing')],
  ['Electronics hierarchy',source.includes("'electronics'")],
  ['Home & Care hierarchy',source.includes("'home-care'")&&source.includes('washmen.partner.careem.com')],
  ['Fix hierarchy',source.includes("'fix'")],
  ['AppEngine-ready page document',source.includes('cataloguePageDocument')],
  ['Search API',source.includes('catalogSearch')],
  ['Commerce adapter',commerce.includes('KAREEBU_UNIFIED_ITEMS')&&commerce.includes('commerceProductsFor')],
];

let pass=0;
for(const [label,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${label}`);
  if(ok)pass++;
}
console.log(`Kareebu V7.2.1 taxonomy checks: ${pass}/${checks.length}.`);
if(pass!==checks.length)process.exit(1);
