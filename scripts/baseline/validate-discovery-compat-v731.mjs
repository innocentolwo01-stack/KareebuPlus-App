import fs from 'node:fs';

const catalog=fs.readFileSync('src/catalog/master/kareebuUnifiedCatalog.ts','utf8');
const commerce=fs.readFileSync('src/commerce/catalog.ts','utf8');

const checks=[
  ['CatalogNode evidence accepts readonly donor tuples',
    catalog.includes('evidence: readonly string[];')],
  ['CommerceProduct avoids metadata intersection',
    commerce.includes("Omit<UnifiedCatalogItem,'metadata'>")],
  ['CommerceProduct restores basePrice',
    commerce.includes('basePrice: number;') && commerce.includes('basePrice:item.basePriceUGX')],
  ['CommerceProduct restores prescriptionRequired',
    commerce.includes('prescriptionRequired: boolean;') && commerce.includes('prescriptionRequired,')],
  ['Commerce metadata stays ProductMetadata',
    commerce.includes('metadata: ProductMetadata;')],
  ['Unified basePriceUGX remains available underneath',
    commerce.includes('basePrice:item.basePriceUGX')],
];

let passed=0;
for(const [label,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${label}`);
  if(ok) passed++;
}
console.log(`V7.3.1 compatibility checks: ${passed}/${checks.length}.`);
if(passed!==checks.length)process.exit(1);
