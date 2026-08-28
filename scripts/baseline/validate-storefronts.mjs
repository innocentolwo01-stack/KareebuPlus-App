import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const source={
  engine:read('src/commerce/merchantStorefront.ts'),
  screen:read('src/commerce/MerchantStorefrontScreen.tsx'),
  root:read('src/screens.tsx'),
  types:read('src/types.ts'),
  promo:read('src/promotions/types.ts'),
  catalog:read('src/promotions/catalog.ts'),
};
const checks=[];
const check=(name,condition)=>checks.push({name,condition:Boolean(condition)});

check('shared merchant storefront engine exists',source.engine.includes('buildMerchantStorefrontPlan'));
check('merchant page uses typed shared configuration schema',source.engine.includes('MerchantPageConfig')&&source.engine.includes('kareebu.merchant.page.v1'));
check('merchant types are differentiated',source.engine.includes("'supermarket'")&&source.engine.includes("'electronics'")&&source.engine.includes("'pharmacy'"));
check('merchandising density profiles exist',source.engine.includes('MerchandisingDensityProfile')&&source.engine.includes("'VERY_HIGH'"));
check('store categories are derived from inventory',source.engine.includes('deriveMerchantCategories')&&source.engine.includes('products.filter'));
check('empty/weak categories are suppressed',source.engine.includes('category.count >= 2'));
check('supermarkets use richer module plans',source.engine.includes("merchantType === 'supermarket'")&&source.engine.includes('Shop departments')&&source.engine.includes('Fresh Finds')&&source.engine.includes('More to explore'));
check('electronics use tech-specific modules',source.engine.includes('Mobile Accessories Must-Haves')&&source.engine.includes('Gaming essentials')&&source.engine.includes('Shop by Brand'));
check('storefront is virtualized',source.screen.includes('<FlatList')&&source.screen.includes('numColumns={2}')&&source.screen.includes('removeClippedSubviews'));
check('seller identity is present in storefront header',source.screen.includes('<SellerLogo name={store.name}')&&source.screen.includes('headerStoreName'));
check('store search is seller scoped',source.screen.includes('KareebuSearchField')&&source.root.includes('sellerSearchContext(store.id,storeName'));
check('merchant category route exists',source.types.includes("| 'shopCategory'")&&source.root.includes("case 'shopCategory'"));
check('merchant category navigation preserves seller context',source.root.includes("sellerId:store.id")&&source.root.includes("actions.go('shopCategory')"));
check('product detail preserves seller context',source.root.includes("productId:product.id")&&source.root.includes("actions.go('commerceProduct')"));
check('quick add uses commerce cart lines',source.root.includes('actions.addCommerceCartLine')&&source.screen.includes('onQuickAdd'));
check('central promotion engine owns store placements',source.promo.includes("'SUPERMARKET_HERO'")&&source.promo.includes("'ELECTRONICS_GAMING'")&&source.screen.includes('<PromotionSurface'));
check('merchant type participates in promotion targeting',source.promo.includes('merchantType?: string')&&source.catalog.includes("merchantType:'supermarket'"));

let failed=0;
for(const item of checks){
  if(item.condition) console.log(`PASS — ${item.name}`);
  else { failed+=1; console.error(`FAIL — ${item.name}`); }
}
if(failed){console.error(`Kareebu storefront contracts: ${checks.length-failed}/${checks.length} passed.`);process.exit(1);}
console.log(`Kareebu storefront contracts: ${checks.length}/${checks.length}.`);
