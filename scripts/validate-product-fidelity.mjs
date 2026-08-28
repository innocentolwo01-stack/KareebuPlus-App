import fs from 'node:fs';

const files = {
  types: fs.readFileSync('src/catalog/types.ts','utf8'),
  metadata: fs.readFileSync('src/catalog/ProductMetadataSections.tsx','utf8'),
  catalog: fs.readFileSync('src/commerce/catalog.ts','utf8'),
  commerce: fs.readFileSync('src/commerce/screens.tsx','utf8'),
  food: fs.readFileSync('src/food/screens.tsx','utf8'),
  foodMeta: fs.readFileSync('src/food/productMetadata.ts','utf8'),
};

const checks = [
  ['brand schema', /brand\?: ProductBrand/],
  ['manufacturer schema', /manufacturer\?: string/],
  ['unit value schema', /unitValue\?: string/],
  ['stock schema', /stock\?: number/],
  ['nutrition schema', /nutritionFacts\?: NutritionFact\[\]/],
  ['allergen schema', /allergens\?: string\[\]/],
  ['generic names schema', /genericNames\?: string\[\]/],
  ['prescription schema', /prescriptionRequired\?: boolean/],
  ['dimensions enhancement', /dimensions\?: ProductDimensions/],
  ['SKU enhancement', /sku\?: string/],
  ['barcode enhancement', /barcode\?: string/],
  ['ingredients enhancement', /ingredients\?: string\[\]/],
  ['brand UI', /label="Brand"/],
  ['manufacturer UI', /label="Manufacturer"/],
  ['dimensions UI', /label="Dimensions"/],
  ['nutrition UI', /title="Nutritional information"/],
  ['ingredients UI', /title="Ingredients"/],
  ['allergen UI', /title="Allergen information"/],
  ['commerce metadata wired', /commerceProductMetadataFor\(product\)/],
  ['commerce detail sections wired', /ProductMetadataSections description=\{longDescription\}/],
  ['food metadata wired', /foodProductMetadataFor\(item, restaurant\)/],
  ['food detail sections wired', /ProductMetadataSections description=\{item\.description\}/],
];

const haystack = Object.values(files).join('\n');
const missing = checks.filter(([,rx]) => !rx.test(haystack)).map(([name]) => name);
if (missing.length) {
  console.error(`Product fidelity validation failed: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`Product fidelity validation passed: ${checks.length}/${checks.length} checks present.`);
console.log('Scope: description + brand/manufacturer + units/stock + nutrition/allergens + pharmacy metadata + physical dimensions/SKU/barcode Kareebu enhancements.');
