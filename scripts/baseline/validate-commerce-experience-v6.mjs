import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const homeFeed=read('src/home/HomeDiscoveryFeed.tsx');
const home=read('src/home/homeFeed.ts');
const visuals=read('src/visuals/categoryVisuals.ts');
const gaps=read('src/visuals/visualAssetGaps.ts');
const landing=read('src/taxonomy/UniversalTaxonomyLandingScreen.tsx');
const taxonomy=read('src/taxonomy/registry.ts');
const storefront=read('src/commerce/MerchantStorefrontScreen.tsx');
const merchant=read('src/commerce/merchantStorefront.ts');
const commerceCatalog=read('src/commerce/catalog.ts');
const commerceScreens=read('src/commerce/screens.tsx');
const verticalScreen=read('src/experience/VerticalLandingScreen.tsx');
const verticalBlueprint=read('src/experience/verticalLandingBlueprint.ts');
const verticals=read('src/experience/verticals.ts');
const global=read('src/global/screens.tsx');
const globalCatalog=read('src/global/catalog.ts');
const promotions=read('src/promotions/catalog.ts');
const screens=read('src/screens.tsx');

let passed=0,failed=0;
const check=(label,ok)=>{console.log(`${ok?'PASS':'FAIL'} — ${label}`);ok?passed++:failed++;};
const all=(src,items)=>items.every(x=>src.includes(x));
const none=(src,items)=>items.every(x=>!src.includes(x));

check('Home category navigation shows eight destinations per page',homeFeed.includes('const pageSize=8'));
check('Home category navigation uses four compact columns',homeFeed.includes('const cardWidth=(pageWidth-gap*3)/4'));
check('Home category art uses standard scale rather than hero-sized artwork',homeFeed.includes('CategoryArtwork visualKey={item.visualKey??\'\'} size="standard"'));
check('Home category pagination only appears when there is a second page',homeFeed.includes('pages.length>1?<View style={styles.pageDots}'));
check('Home category cards avoid the previous sparse launcher dimensions',none(homeFeed,['index+=6','(pageWidth-24)/3','minHeight:218,alignItems:\'center\'']));
check('Shop by category exposes the eight primary commerce destinations first',all(home,["['restaurants','Restaurants'","['groceries','Groceries'","['pharmacy','Pharmacy'","['electronics','Electronics'","['fashion','Fashion'","['beauty','Beauty'","['home','Home'","['pets','Pet supplies'"]));
check('Home commerce CTAs use specific shopping language',all(home,["cta:{label:'Browse all'","cta:{label:'Shop health & wellness'","cta:{label:'Browse fashion & beauty'","cta:{label:'Discover electronics'"]));
check('Home merchant modules avoid internal reference-storefront language',none(home,['Named reference storefronts','Open reference storefront','Top stores near you']));

check('Top commerce categories use one coherent packaged artwork family',all(visuals,["'commerce.restaurants': local(commerceCategoryArt.restaurants","'commerce.pharmacy': local(commerceCategoryArt.pharmacy","'commerce.fashion': local(commerceCategoryArt.fashion","'commerce.home': local(commerceCategoryArt.home","'commerce.groceries': local(commerceCategoryArt.groceries","'commerce.electronics': local(commerceCategoryArt.electronics","'commerce.beauty': local(commerceCategoryArt.beauty","'commerce.pets': local(commerceCategoryArt.pets"]));
check('Primary Fashion branches do not use restroom-style vectors',none(visuals,["'fashion.women': vector('woman-outline'","'fashion.men': vector('man-outline'","'fashion.children': vector('shirt-outline'"]));
check('Priority Pharmacy branches have distinct semantic artwork',all(visuals,["'pharmacy.medicines': local(merchV5.pharmacyMedicines","'pharmacy.cold-flu': local(merchV5.pharmacyColdFlu","'pharmacy.pain-relief': local(merchV5.pharmacyPainRelief","'pharmacy.allergy': local(merchV5.pharmacyAllergy","'pharmacy.digestive': local(merchV5.pharmacyDigestive","'pharmacy.first-aid': local(merchV5.pharmacyFirstAid"]));
check('Priority Electronics branches have semantic artwork',all(visuals,["'electronics.phones': local(merchV5.phones","'electronics.audio': local(merchV5.audio","'electronics.computing': local(merchV5.computers","'electronics.gaming': local(merchV5.gaming","'electronics.tvs': local(merchV5.tv","'electronics.appliances': local(merchV5.appliances","'electronics.power': local(merchV5.power"]));
check('Temporary vegetable artwork reuse is explicitly recorded as production-art debt',all(gaps,["key:'groceries.leafy-greens'","key:'groceries.root-vegetables'","key:'groceries.onions-garlic-ginger'","key:'groceries.peppers'","key:'groceries.herbs'","key:'groceries.mushrooms'","key:'groceries.ready-to-cook'"]));

check('Vertical landing category cards are compact three-column gateways',verticalScreen.includes("grid:{flexDirection:'row',flexWrap:'wrap',gap:SPACE.md}")&&verticalScreen.includes("category:{width:'31.2%'")&&verticalScreen.includes('size="standard"'));
check('Vertical banners route category CTAs into a real category context',verticalScreen.includes("campaign.ctaScreen==='categoryItems'&&primaryCategory?onCategory(primaryCategory.id,primaryCategory.label)"));
check('Vertical landing suppresses empty seller and product rails',verticalScreen.includes("section.type==='seller_carousel'")&&verticalScreen.includes("section.type==='product_carousel'"));
check('Vertical landing avoids fabricated best-seller merchandising',none(verticalBlueprint,['bestseller_carousel\', title: labels.best','Grocery best sellers','Electronics best sellers','Fashion best sellers']));
check('Vertical landing customer copy avoids developer/product-dump language',none(verticals,['product dump','configured pharmacies']));

check('Universal category landing uses a commercial category hero',landing.includes('CategoryArtwork visualKey={node.visualKey} size="hero"')&&landing.includes('styles.metrics'));
check('Universal root/department destinations can use compact three-column child grids',landing.includes('childGrid')&&landing.includes("childGridItem:{width:'31.3%'}"));
check('Universal landing supports real brand filtering',landing.includes('Shop by brand')&&landing.includes('setBrandFilter')&&landing.includes('brandWordmark'));
check('Universal landing supports search and useful sorting',landing.includes('KareebuSearchField')&&landing.includes('Lowest price')&&landing.includes('A–Z'));
check('Universal landing customer copy avoids implementation jargon',none(landing,['Go one level deeper','child destination','configured for this market','real catalogue filter','actual configured']));
check('Deep local category pages do not fall back to unrelated parent inventory',screens.includes("const categoryProducts=(node.id===verticalId?uniqueCatalogue:matching)"));

check('Vegetables is a true taxonomy branch',taxonomy.includes("branch('groceries','groceries.fresh-produce.vegetables'"));
check('Vegetables includes meaningful shop-by-type children',all(taxonomy,['Leafy Greens','Root Vegetables','Tomatoes','Onions, Garlic & Ginger','Peppers & Chillies','Salad Vegetables','Fresh Herbs','Mushrooms','Ready-to-Cook Vegetables']));
check('Vegetable children use specific semantic visual keys',all(taxonomy,['groceries.leafy-greens','groceries.root-vegetables','groceries.tomatoes','groceries.onions-garlic-ginger','groceries.peppers','groceries.herbs','groceries.mushrooms','groceries.ready-to-cook']));
check('Merchant vegetable aisle facets genuinely filter inventory',all(merchant,["id:'leafy-greens'","id:'roots'","id:'tomatoes'","id:'onions-garlic'","id:'peppers'","id:'salad-veg'","id:'herbs'","id:'mushrooms'","id:'ready-to-cook'"]));
check('Retailer departments render as compact three-column category grids',storefront.includes("categoryTile:{width:'31.4%'")&&storefront.includes('<CategoryArtwork visualKey={merchantCategoryVisualKey(category,_store.category)} size="standard"/>'));
check('Retailer department facets render as compact three-column aisle grids',storefront.includes("facetCard:{width:'31.4%'")&&storefront.includes('merchantFacetVisualKey(item)'));
check('Retailer storefront has a true merchant-specific shopping hero',storefront.includes('function StorefrontHero')&&storefront.includes('Your weekly shop, organised')&&storefront.includes('Start with {first.label}'));
check('Retailer copy avoids seller-scoped/reference-storefront implementation language',none(storefront,['seller-scoped catalogue','Reference storefront']));

check('Global smartphone catalogue weights smartphones sufficiently for useful brand/model browsing',(globalCatalog.match(/'Smartphone'/g)||[]).length>=3);
check('Global smartphone generation uses credible model families',all(globalCatalog,['iPhone 16 Pro','Galaxy S25','Pixel 9 Pro','Tecno','Infinix']));
check('Global phone generation cannot label JBL or Anker as smartphone makers',none(globalCatalog,['JBL Smartphone','Anker Smartphone'])&&globalCatalog.includes('SMARTPHONE_BRANDS'));
check('Global smartphone landing has Shop by brand and model-family depth',global.includes("childMode==='brand'?'Shop by brand':childMode==='model'?'Shop by model family'"));
check('Global Apple Samsung and Google have dedicated deeper model branches',all(taxonomy,["['iphone-16','iPhone 16 Series'","['galaxy-s','Galaxy S Series'","['pixel-9','Pixel 9 Series'",'global.electronics.phones.smartphones.apple.${slug}','global.electronics.phones.smartphones.samsung.${slug}','global.electronics.phones.smartphones.google.${slug}']));
check('Global filters include brand, platform, storage, source, delivered total and delivery',all(global,['Brand','Phone platform','Storage','Source marketplace','Source price','Estimated delivered total','Estimated delivery']));
check('Global delivered-total filter ranges are data-derived',global.includes('deliveredPriceBands')&&global.includes('formatMoney(data.country,deliveredPriceBands.lower)'));
check('Global navigation strip is functional rather than inert labels',global.includes("['Discover',null],['Electronics','electronics']")&&global.includes('onPress={()=>category?openCategory(category):actions.go(\'globalHome\')}'));
check('Global catalogue descriptions are customer-facing while remaining truthful',globalCatalog.includes('Catalogue preview for ${noun.toLowerCase()}')&&none(globalCatalog,['Development catalogue fixture for']));

check('Reference commerce metadata does not manufacture ratings, stock, verified seller or free delivery',all(commerceCatalog,['stock:undefined','averageRating:undefined','ratingCount:undefined','verifiedSeller:false','freeDelivery:false']));
check('Commerce product UI avoids internal reference-catalogue wording',none(commerceScreens,['Reference catalogue','This demo stores the approval state locally']));
check('Promotion copy avoids configured-seller and developer-depth language',none(promotions,['configured pharmacy sellers','configured international sources','Go deeper into the world’s marketplaces']));

console.log(`Kareebu commerce experience v6: ${passed}/${passed+failed}.`);
if(failed)process.exit(1);
