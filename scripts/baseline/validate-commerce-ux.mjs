import fs from 'node:fs';

const read=path=>fs.readFileSync(path,'utf8');
const checks=[
  ['Discovery does not select first category',read('src/discovery/document.ts'),source=>!source.includes('categories[0] ??\n    null')],
  ['Catalogue does not select first category',read('src/catalog/master/kareebuUnifiedCatalog.ts'),source=>source.includes('const activeCategory=input.categoryId;')],
  ['Commerce context uses stable IDs',read('src/commerce/context.ts'),source=>['categoryId','sellerId','productId','entrySource'].every(value=>source.includes(value))],
  ['Commerce screens expose history Back',read('src/commerce/screens.tsx'),source=>source.includes('onBack={actions.back}')],
  ['Category state preserves scroll',read('src/categoryLanding/CategoryLandingPage.tsx'),source=>source.includes('scrollToOffset')&&source.includes('scrollOffset')],
  ['Vertical hero uses responsive interval',read('src/promotions/VerticalPromoCarousel.tsx'),source=>source.includes('width-52')&&source.includes('const interval=cardWidth+gap')&&source.includes('snapToInterval={interval}')&&source.includes('ItemSeparatorComponent')],
  ['Raw grocery meat art is semantic',read('src/visuals/categoryVisuals.ts'),source=>source.includes('grocery-beef.png')&&source.includes('grocery-chicken.png')&&!source.includes("'butchery.beef': local(d3.chicken")],
  ['Customer copy removes reference sellers',read('src/experience/verticalLandingBlueprint.ts'),source=>!source.includes('Reference sellers for')],
];
let failed=0;
for(const [name,source,test] of checks){if(test(source))console.log(`PASS — ${name}`);else{failed++;console.error(`FAIL — ${name}`)}}
console.log(`Kareebu commerce UX contracts: ${checks.length-failed}/${checks.length}.`);
if(failed)process.exit(1);
