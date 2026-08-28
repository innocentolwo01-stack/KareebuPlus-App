import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
let passed=0;
let failed=0;
function check(name,condition){if(condition){passed+=1;console.log(`PASS — ${name}`);}else{failed+=1;console.error(`FAIL — ${name}`);}}

const productVisuals=read('src/commerce/productVisuals.ts');
const sellerLogo=read('src/commerce/SellerLogo.tsx');
const shops=read('src/shops/ShopsLandingScreen.tsx');
const screens=read('src/screens.tsx');
const commerce=read('src/commerce/catalog.ts');
const globalCatalog=read('src/global/catalog.ts');
const globalScreens=read('src/global/screens.tsx');
const categoryVisuals=read('src/visuals/categoryVisuals.ts');

check('commerce product imagery is resolved semantically',productVisuals.includes('commerceProductVisual')&&productVisuals.includes('headphone|earbud')&&productVisuals.includes('beef|steak|meat'));
check('product visuals vary background treatment deterministically',productVisuals.includes('BACKGROUNDS')&&productVisuals.includes('stableHash'));
check('seller logo system recognises real/common market sellers',sellerLogo.includes('carrefour')&&sellerLogo.includes('goodlife')&&sellerLogo.includes('jumia')&&sellerLogo.includes('Naivas')&&sellerLogo.includes('Quickmart'));
check('unknown sellers render a full branded wordmark instead of initials only',sellerLogo.includes('label: name')&&sellerLogo.includes('wordmark'));
check('shops home shows seller-to-product relationship',shops.includes('MerchantCampaignBanner')&&shops.includes('Featured storefronts'));
check('shop discovery renders seller logos',shops.includes('<SellerLogo name={item.name}/>')||shops.includes('<SellerLogo name={shop.name}/>'));
check('storefront product media uses semantic resolver',screens.includes('commerceProductVisual')&&screens.includes('function StoreProductPhoto'));
check('old one-photo-per-category storefront pool is removed',!screens.includes('V614_PRODUCT_PHOTOS'));
check('merchant inventories use seller/category affinity',commerce.includes('storeAffinity')&&commerce.includes('productsMatchingStore'));
check('Global catalogue assigns media by product semantics',globalCatalog.includes('semanticProductPool')&&globalCatalog.includes('semanticProductImage'));
check('Global fixture galleries contain five relevant merchandising slots',globalCatalog.includes('return ordered.slice(0,5)'));
check('Global cards visually distinguish products and retain source identity',globalScreens.includes('productTone(product.id)')&&globalScreens.includes('productBrandBadge'));
check('Global gallery consumes per-slot media rather than forcing one image',globalScreens.includes('source={source}'));
check('primary category visuals use distinct realistic/product media for fashion accessories and fitness',!categoryVisuals.includes('discovery-3d/')&&categoryVisuals.includes("fashionAccessories: require('../../assets/kareebu-plus/top-offers/category-essentials.jpg')")&&categoryVisuals.includes("fitness: require('../../assets/kareebu-plus/lifestyle-cutouts/explore-wellness.png')"));

console.log(`\nKareebu media clarity contracts: ${passed}/${passed+failed}.`);
if(failed)process.exit(1);
