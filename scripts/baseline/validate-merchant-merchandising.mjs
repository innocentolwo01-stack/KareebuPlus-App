import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const checks=[];
const pass=(name,ok)=>checks.push({name,ok});

const productTypes=read('src/catalog/types.ts');
const shops=read('src/shops/ShopsLandingScreen.tsx');
const screens=read('src/screens.tsx');
const banner=read('src/commerce/MerchantCampaignBanner.tsx');
const storefront=read('src/commerce/MerchantStorefrontScreen.tsx');
const sellerLogo=read('src/commerce/SellerLogo.tsx');
const visuals=read('src/commerce/productVisuals.ts');

pass('ProductMetadata supports semantic imageKey',productTypes.includes('imageKey?: string'));
pass('Shared merchant campaign banner exists',banner.includes('MerchantCampaignBanner'));
pass('Merchant banner contains seller identity',banner.includes('<SellerLogo name={shop.name}'));
pass('Merchant banner previews seller products',banner.includes('commerceProductsFor(shop)'));
pass('Merchant banner resolves product-semantic art',banner.includes('commerceProductVisual'));
pass('Shops home exposes featured storefront merchandising',shops.includes('Featured storefronts'));
pass('Shops home uses merchant campaign banners',shops.includes('<MerchantCampaignBanner'));
pass('Shops hero has visual promotional creative',shops.includes('image:grocery')&&shops.includes('image:tech')&&shops.includes('image:beauty'));
pass('Storefront carries merchant-specific banner',storefront.includes('<MerchantCampaignBanner shop={store} compact'));
pass('Store photo uses visible seller logo',screens.includes('<PopularStoreLogo store={store}'));
pass('Popular store logo delegates to shared SellerLogo',screens.includes('return <SellerLogo name={store.name}/>'));
pass('Product visual resolver remains semantic',visuals.includes('commerceProductVisual'));
pass('Known packaged seller logos remain available',sellerLogo.includes('assets.homeBrands.carrefour')&&sellerLogo.includes('assets.homeBrands.goodlife')&&sellerLogo.includes('assets.homeBrands.jumia'));
pass('No unsupported StyleSheet.absoluteFillObject regression',!screens.includes('StyleSheet.absoluteFillObject'));

for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'} ${c.name}`);
const failed=checks.filter(c=>!c.ok);
if(failed.length){console.error(`\n${failed.length} merchant merchandising checks failed.`);process.exit(1)}
console.log(`\n${checks.length}/${checks.length} merchant merchandising checks passed.`);
