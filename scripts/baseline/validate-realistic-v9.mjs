import fs from 'node:fs';
import path from 'node:path';

const app=process.argv[2] ?? process.cwd();
const read=(rel)=>fs.readFileSync(path.join(app,rel),'utf8');
const exists=(rel)=>fs.existsSync(path.join(app,rel));
let pass=0,fail=0;
const check=(name,ok)=>{console.log(`${ok?'PASS':'FAIL'} — ${name}`); ok?pass++:fail++;};
const advisory=(name,ok)=>console.log(`${ok?'PASS':'WARN'} — ${name}${ok?'':' (preserved local marketplace implementation)'}`);

const visual=read('src/visuals/categoryVisuals.ts');
const artwork=read('src/components/CategoryArtwork.tsx');
const product=read('src/commerce/productVisuals.ts');
const home=read('src/home/homeFeed.ts');
const assetsTs=read('src/assets.ts');
const market=exists('src/marketplace/MarketplaceCategoryChrome.tsx')?read('src/marketplace/MarketplaceCategoryChrome.tsx'):'';
const discovery=read('src/discovery/art.tsx');
const verticals=read('src/experience/verticals.ts');
const categoryLanding=read('src/categoryLanding/CategoryLandingPage.tsx');
const taxonomy=read('src/taxonomy/UniversalTaxonomyLandingScreen.tsx');
const storefront=read('src/commerce/MerchantStorefrontScreen.tsx');
const campaign=read('src/commerce/MerchantCampaignBanner.tsx');
const commerceScreens=read('src/commerce/screens.tsx');
const screens=read('src/screens.tsx');
const assetDir=path.join(app,'assets/kareebu-plus/realistic-v9');

check('realistic-v9 asset directory exists',fs.existsSync(assetDir));
const media=fs.existsSync(assetDir)?fs.readdirSync(assetDir).filter(x=>/\.(png|jpe?g|webp)$/i.test(x)):[];
check('realistic-v9 contains at least 65 individually named assets',media.length>=65);
for(const name of ['restaurants.jpg','groceries.jpg','pharmacy.jpg','electronics.jpg','fashion.jpg','beauty.jpg','home.jpg','pet-supplies.jpg','fashion-women.jpg','fashion-men.jpg','fashion-kids.jpg','shoes.jpg','haircare.jpg','fragrance.jpg','phones.jpg','audio.jpg','gaming.jpg','computing.jpg','tvs.jpg','appliances.jpg','cameras.jpg','medicines-health.jpg','vitamins-supplements.jpg','personal-care.jpg','baby-child.jpg','cold-flu.jpg','pain-relief.jpg','first-aid.jpg','send-parcel.jpg','send-documents.jpg','send-gift.jpg','send-business.jpg','cleaning.jpg','plumbing.jpg','electrical.jpg','ac-service.jpg','moving.jpg','beauty-at-home.jpg','laundry.jpg','handyman.png','pest-control.jpg','home-storage.png','sports.jpg','automotive.png','books-stationery.jpg']) check(`asset exists: ${name}`,exists(`assets/kareebu-plus/realistic-v9/${name}`));

const banned=/(discovery-3d|services-3d|service-carousel|commerce-categories|semantic-art|merchandising-v5)/;
for(const [name,text] of [['category resolver',visual],['asset atlas',assetsTs],['home feed',home],['verticals',verticals]]) check(`${name} has no legacy 3D/icon asset path`,!banned.test(text));
check('category visual type is photo-only',visual.includes("type: 'local-photo'")&&!visual.includes("type: 'local-3d'")&&!visual.includes("type: 'vector-fallback'"));
check('category resolver has no vector category helper',!visual.includes('const vector ='));
check('CategoryArtwork has no Ionicons fallback',!artwork.includes('Ionicons'));
check('CategoryArtwork uses square contained rendering with breathing room',artwork.includes('resizeMode="contain"')&&artwork.includes('pixels * 0.08'));
check('product visual resolver has no icon fallback API',!product.includes('ProductFallbackIcon')&&!product.includes('pool.icon')&&!product.includes("icon:'"));
check('unknown products do not borrow an unrelated photograph',product.includes('return { images:[] };'));

const expected={
 'commerce.restaurants':'realV9.restaurants','commerce.groceries':'realV9.groceries','commerce.pharmacy':'realV9.pharmacy','commerce.electronics':'realV9.electronics','commerce.fashion':'realV9.fashion','commerce.beauty':'realV9.beauty','commerce.home':'realV9.home','commerce.pets':'realV9.petSupplies',
 'fashion.women':'realV9.fashionWomen','fashion.men':'realV9.fashionMen','fashion.children':'realV9.fashionKids','fashion.shoes':'realV9.shoes','fashion.accessories':'realV9.accessories','fashion.sportswear':'realV9.sportswear','fashion.bags':'realV9.bags',
 'beauty.skincare':'realV9.skincare','beauty.hair':'realV9.haircare','beauty.fragrance':'realV9.fragrance','beauty.makeup':'realV9.beauty',
 'electronics.phones':'realV9.phones','electronics.audio':'realV9.audio','electronics.gaming':'realV9.gaming','electronics.computing':'realV9.computing','electronics.tvs':'realV9.tvs','electronics.appliances':'realV9.appliances','electronics.power':'realV9.power','electronics.cameras':'realV9.cameras','electronics.wearables':'realV9.wearables','electronics.smart-home':'realV9.smartHome',
 'pharmacy.medicines':'realV9.medicinesHealth','pharmacy.cold-flu':'realV9.coldFlu','pharmacy.pain-relief':'realV9.painRelief','pharmacy.allergy':'realV9.allergy','pharmacy.digestive':'realV9.digestiveHealth','pharmacy.first-aid':'realV9.firstAid','pharmacy.vitamins':'realV9.vitaminsSupplements','pharmacy.personal-care':'realV9.personalCare','pharmacy.baby-care':'realV9.babyChild','pharmacy.home-health':'realV9.homeHealth',
 'send.parcel':'realV9.sendParcel','send.documents':'realV9.sendDocuments','send.gift':'realV9.sendGift','send.business':'realV9.sendBusiness',
 'home.cleaning':'realV9.cleaning','services.plumbing':'realV9.plumbing','services.electrical':'realV9.electrical','services.ac':'realV9.acService','services.moving':'realV9.moving','services.beauty-home':'realV9.beautyAtHome','home.laundry':'realV9.laundry','home.handyman':'realV9.handyman','home.pest-control':'realV9.pestControl','home.storage':'realV9.homeStorage',
 'general.sports':'realV9.sports','general.automotive':'realV9.automotive','general.books':'realV9.booksStationery','general.toys':'realV9.toys'
};
for(const [key,asset] of Object.entries(expected)) check(`${key} maps to ${asset}`,visual.includes(`'${key}': local(${asset},`));

const assetFor=(key)=>{const m=visual.match(new RegExp(`'${key.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}'\\s*:\\s*local\\(([^,]+),`));return m?.[1]??''};
for(const group of [
 ['fashion.women','fashion.men','fashion.children','fashion.shoes'],
 ['beauty.skincare','beauty.hair','beauty.fragrance','beauty.makeup'],
 ['electronics.phones','electronics.audio','electronics.gaming','electronics.computing','electronics.tvs','electronics.appliances'],
 ['send.parcel','send.documents','send.gift','send.business'],
 ['services.plumbing','services.electrical','services.ac','services.moving','services.beauty-home'],
 ['pharmacy.medicines','pharmacy.vitamins','pharmacy.personal-care','pharmacy.baby-care','pharmacy.cold-flu','pharmacy.pain-relief','pharmacy.first-aid']
]) check(`${group.join(', ')} use distinct relevant artwork`,new Set(group.map(assetFor)).size===group.length);

check('Home Send Something uses semantic photo keys',home.includes("'send.parcel'")&&home.includes("'send.documents'")&&home.includes("'send.gift'")&&home.includes("'send.business'"));
check('Home feed no longer uses toy promotion for pet supplies',!home.includes('offer-toys'));
check('Home commerce still uses dense 8-per-page 4-column category layout',read('src/home/HomeDiscoveryFeed.tsx').includes('const pageSize=8')&&read('src/home/HomeDiscoveryFeed.tsx').includes('gap*3)/4'));
check('Home hero is rendered before the 4x2 category feed',screens.indexOf('<PromotionHero campaign={mainHomeHero}')<screens.indexOf('<AppEnginePage page={page}'));
check('Home hero uses truthful editorial copy',(screens.includes('Move. Shop. Send. Pay.')||screens.includes('Shop. Send. Pay. Do More.'))&&!/(\d+% off|free delivery|best price)/i.test(screens.match(/const mainHomeHero:.*/)?.[0]??''));
check('Fashion, pharmacy and electronics heroes are configured',verticals.includes("heroHeadline:'Express your style'")&&verticals.includes("id:'pharmacy'")&&verticals.includes("id:'electronics'"));
check('Send hero is reachable',read('src/parcels/screens.tsx').includes('PromotionHero')&&read('src/parcels/screens.tsx').includes("service:'send'"));
check('Home & Care hero is reachable',read('src/services/screens.tsx').includes('HOME_CARE_HERO')&&read('src/services/screens.tsx').includes('<PromotionHero campaign={HOME_CARE_HERO}'));
check('No reachable content artwork uses stretch',![artwork,home,verticals,storefront,commerceScreens,screens,market].some(text=>/resizeMode=["']stretch["']/.test(text)));
advisory('Marketplace category grid renders CategoryArtwork',market.includes('CategoryArtwork')&&market.includes('visualKeyForCategory'));
advisory('Marketplace category grid does not render BrandIcon for categories',!market.includes('<BrandIcon semantic={tile.semantic}'));
advisory('Marketplace promotions use packaged category imagery',market.includes('realistic-v9/')&&!market.includes('images.unsplash.com'));
advisory('Marketplace static promo copy has no fabricated percentage/free-delivery claim',!/(UP TO \d+%|Free delivery|free delivery|60 DAYS|member savings)/.test(market));
check('Discovery category fallback uses CategoryArtwork instead of BrandIcon',discovery.includes('<CategoryArtwork')&&!discovery.includes('return <BrandIcon'));
check('Discovery kids do not resolve to pet supplies',!discovery.includes("if(/toy|kids/.test(v)) return 'shops.petSupplies'"));
check('Discovery cameras resolve to camera photography',discovery.includes("return 'electronics.cameras'"));
check('Vertical pharmacy uses medicines and home-health specific destinations',verticals.includes("'pharmacy.medicines'")&&verticals.includes("'pharmacy.home-health'"));
check('Vertical electronics uses cameras, smart-home and wearables destinations',verticals.includes("'electronics.cameras'")&&verticals.includes("'electronics.smart-home'")&&verticals.includes("'electronics.wearables'"));
check('Vertical landing heroes use realistic-v9 imagery',/heroImage:require\('\.\.\/\.\.\/assets\/kareebu-plus\/realistic-v9\//.test(verticals));
check('service atlas no longer loads service-carousel icons',!assetsTs.includes('service-carousel/'));
check('category product card has no symbolic fallback',!categoryLanding.includes('visual.icon')&&!categoryLanding.includes("name={visual.icon"));
check('taxonomy product card has no symbolic fallback',!taxonomy.includes('visual.icon')&&!taxonomy.includes("name={visual.icon"));
check('merchant storefront has no symbolic product fallback',!storefront.includes('visual.icon'));
check('merchant campaign banner has no symbolic product fallback',!campaign.includes('visual.icon'));
check('commerce detail/cart has no product icon fallback',!commerceScreens.includes('productVisual.icon')&&!commerceScreens.includes('visual.icon'));
check('legacy product photo helper has no product icon fallback',!screens.includes('visual.icon'));
check('global catalogue no longer points pet/toy merchandising at the old discount toy creative',!read('src/global/catalog.ts').includes('offer-toys'));
check('vertical landing blueprint no longer references the old discount toy creative',!read('src/experience/verticalLandingBlueprint.ts').includes('offer-toys'));

console.log(`\nKareebu realistic visual system v9: ${pass}/${pass+fail} PASS`);
if(fail) process.exit(1);
