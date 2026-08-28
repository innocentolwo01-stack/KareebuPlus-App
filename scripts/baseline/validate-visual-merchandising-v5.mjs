import fs from 'node:fs';

const read=file=>fs.readFileSync(file,'utf8');
const visuals=read('src/visuals/categoryVisuals.ts');
const gaps=read('src/visuals/visualAssetGaps.ts');
const home=read('src/home/homeFeed.ts');
const homeFeed=read('src/home/HomeDiscoveryFeed.tsx');
const taxonomy=read('src/taxonomy/registry.ts');
const landing=read('src/taxonomy/UniversalTaxonomyLandingScreen.tsx');
const storefront=read('src/commerce/MerchantStorefrontScreen.tsx');
const merchant=read('src/commerce/merchantStorefront.ts');
const global=read('src/global/screens.tsx');
const globalCatalog=read('src/global/catalog.ts');
const productVisuals=read('src/commerce/productVisuals.ts');

let passed=0,failed=0;
const check=(label,ok)=>{console.log(`${ok?'PASS':'FAIL'} — ${label}`);ok?passed++:failed++;};
const hasAll=(src,items)=>items.every(item=>src.includes(item));
const hasNone=(src,items)=>items.every(item=>!src.includes(item));

check('top commerce categories use one packaged artwork family',hasAll(visuals,[
  "'commerce.restaurants': local(commerceCategoryArt.restaurants",
  "'commerce.pharmacy': local(commerceCategoryArt.pharmacy",
  "'commerce.fashion': local(commerceCategoryArt.fashion",
  "'commerce.home': local(commerceCategoryArt.home",
  "'commerce.groceries': local(commerceCategoryArt.groceries",
  "'commerce.electronics': local(commerceCategoryArt.electronics",
  "'commerce.beauty': local(commerceCategoryArt.beauty",
  "'commerce.pets': local(commerceCategoryArt.pets",
]));
check('weak Fashion restroom/shirt/watch vectors are removed from primary fashion branches',hasNone(visuals,[
  "'fashion.women': vector('woman-outline'",
  "'fashion.men': vector('man-outline'",
  "'fashion.children': vector('shirt-outline'",
  "'fashion.accessories': vector('watch-outline'",
]));
check('Fashion Women Men Kids Accessories and Shoes use packaged merchandising imagery',hasAll(visuals,[
  "'fashion.women': local(merchV5.fashionWomen",
  "'fashion.men': local(merchV5.fashionMen",
  "'fashion.children': local(merchV5.fashionKids",
  "'fashion.accessories': local(merchV5.fashionAccessories",
  "'fashion.shoes': local(merchV5.shoes",
]));
check('Beauty Skincare Hair Fragrance and Makeup use packaged merchandising imagery',hasAll(visuals,[
  "'beauty.skincare': local(merchV5.skincare",
  "'beauty.hair': local(merchV5.haircare",
  "'beauty.fragrance': local(merchV5.fragrance",
  "'beauty.makeup': local(merchV5.beauty",
]));
check('Pharmacy priority health branches use distinct packaged imagery',hasAll(visuals,[
  "'pharmacy.cold-flu': local(merchV5.pharmacyColdFlu",
  "'pharmacy.pain-relief': local(merchV5.pharmacyPainRelief",
  "'pharmacy.allergy': local(merchV5.pharmacyAllergy",
  "'pharmacy.digestive': local(merchV5.pharmacyDigestive",
  "'pharmacy.first-aid': local(merchV5.pharmacyFirstAid",
]));
check('Electronics Phones Audio Computing Gaming TV Appliances and Power use packaged imagery',hasAll(visuals,[
  "'electronics.phones': local(merchV5.phones",
  "'electronics.audio': local(merchV5.audio",
  "'electronics.computing': local(merchV5.computers",
  "'electronics.gaming': local(merchV5.gaming",
  "'electronics.tvs': local(merchV5.tv",
  "'electronics.appliances': local(merchV5.appliances",
  "'electronics.power': local(merchV5.power",
]));
check('resolved Fashion Beauty Gaming and pharmacy art is removed from production gap backlog',hasNone(gaps,[
  "key:'fashion.women'","key:'fashion.men'","key:'fashion.children'","key:'fashion.accessories'","key:'fashion.shoes'",
  "key:'beauty.makeup'","key:'beauty.fragrance'","key:'beauty.hair'","key:'electronics.gaming'",
  "key:'pharmacy.cold-flu'","key:'pharmacy.pain-relief'","key:'pharmacy.allergy'","key:'pharmacy.digestive'","key:'pharmacy.first-aid'",
]));

check('Home category copy uses commercial section-specific CTAs',hasAll(home,[
  "cta:{label:'Browse all'","cta:{label:'Shop health & wellness'","cta:{label:'Browse fashion & beauty'","cta:{label:'Discover electronics'",
]));
check('Home pharmacy root points to medicines rather than cold-flu',home.includes("'pharmacy.medicines'")&&home.includes("'pharmacy.home-health'"));
check('Home fashion Shoes uses fashion-specific visual key',home.includes("'fashion.shoes'"));
check('Home category rail uses deliberate paged 3x2 category layouts without a clipped fourth card',homeFeed.includes('index+=6')&&homeFeed.includes('const cardWidth=(pageWidth-24)/3')&&homeFeed.includes('pagingEnabled')&&homeFeed.includes("categoryPage:{flexDirection:'row',flexWrap:'wrap'"));

check('Vegetables is a deep taxonomy branch rather than a flat leaf',taxonomy.includes("branch('groceries','groceries.fresh-produce.vegetables'")&&taxonomy.includes("['leafy-greens','Leafy Greens'"));
check('Vegetables has real shopping subcategories',hasAll(taxonomy,[
  "['leafy-greens','Leafy Greens'","['root-vegetables','Root Vegetables'","['tomatoes','Tomatoes'","['onions-garlic-ginger','Onions, Garlic & Ginger'","['peppers-chillies','Peppers & Chillies'","['salad-vegetables','Salad Vegetables'","['fresh-herbs','Fresh Herbs'","['mushrooms','Mushrooms'","['ready-to-cook','Ready-to-Cook Vegetables'",
]));
check('merchant vegetable department exposes matching aisle facets',hasAll(merchant,[
  "id:'leafy-greens'","id:'roots'","id:'tomatoes'","id:'onions-garlic'","id:'peppers'","id:'salad-veg'","id:'herbs'","id:'mushrooms'","id:'ready-to-cook'",
]));

check('universal landing has a stronger commercial hero with category metrics',landing.includes('styles.metrics')&&landing.includes('styles.heroArt')&&landing.includes('CategoryArtwork visualKey={node.visualKey} size="hero"'));
check('universal landing has useful child aisle cards rather than a label-only list',landing.includes('childActionText')&&landing.includes('Go one level deeper')&&landing.includes('FlatList horizontal data={uniqueChildren}'));
check('universal landing has functional brand filtering',landing.includes('setBrandFilter')&&landing.includes('Shop by brand')&&landing.includes('active={brandFilter===brand}'));
check('universal landing uses full brand wordmarks rather than lazy initials',landing.includes('brandWordmark')&&landing.includes('Shop brand →')&&!landing.includes('const initials=brand.split'));
check('universal landing supports useful search and sorting',landing.includes("type SortMode = 'relevant' | 'price' | 'name'")&&landing.includes('KareebuSearchField')&&landing.includes('Lowest price')&&landing.includes('A–Z'));
check('universal landing keeps product results deduplicated and virtualized',landing.includes('new Map(productSource.map')&&landing.includes('<FlatList data={filtered} numColumns={2}'));

check('retailer category grid renders semantic CategoryArtwork rather than arbitrary product imagery',storefront.includes('merchantCategoryVisualKey')&&storefront.includes('<CategoryArtwork visualKey={merchantCategoryVisualKey(category,_store.category)} size="large"/>'));
check('retailer department hero renders semantic category artwork',storefront.includes('<CategoryArtwork visualKey={merchantCategoryVisualKey(category,store.category)} size="hero"/>'));
check('retailer department facets render semantic category artwork',storefront.includes('merchantFacetVisualKey')&&storefront.includes('<CategoryArtwork visualKey={merchantFacetVisualKey(item)} size="large"/>'));
check('retailer category tiles are materially larger and show catalogue counts',storefront.includes('categoryTile:{width:142')&&storefront.includes('{category.count} items'));
check('retailer hero explicitly drives users into department browsing',storefront.includes('Browse department')&&storefront.includes('Choose a type below'));

check('Global smartphone landing provides dedicated brand child navigation',global.includes("childMode==='brand'?'Shop by brand'")&&global.includes('Choose a maker to open a dedicated phone catalogue'));
check('Global brand destinations use two-column commercial wordmark cards',global.includes("globalBrandChildCard:{width:'48.5%'")&&global.includes('globalBrandWordmark')&&global.includes('Shop smartphones'));
check('Global filters include brand platform storage source price delivery and marketplace',hasAll(global,[
  'Brand','Phone platform','Storage','Source marketplace','Source price','Estimated delivery','Clear all filters',
]));
check('Apple and Samsung remain separate dedicated Global brand routes',taxonomy.includes("['apple','Apple iPhone'")&&taxonomy.includes("['samsung','Samsung Galaxy'"));
check('phone product generation cannot label JBL or Anker as smartphone makers',hasNone(globalCatalog,['JBL Smartphone','Anker Smartphone'])&&globalCatalog.includes('SMARTPHONE_BRANDS'));
check('product imagery still prevents headphones and computers from leaking into phones',productVisuals.includes("if (/phone|smartphone|charger|cable|power bank|powerbank|mobile/.test(value)) return { images:[A.phones]")&&!productVisuals.includes('images:[A.phones,A.computing'));

console.log(`Kareebu visual + landing merchandising v5: ${passed}/${passed+failed}.`);
if(failed)process.exit(1);
