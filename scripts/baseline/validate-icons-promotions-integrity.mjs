import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(rel)=>fs.readFileSync(path.join(root,rel),'utf8');
let passCount=0;
let failCount=0;
const check=(label,ok)=>{console.log(`${ok?'PASS':'FAIL'} — ${label}`);ok?passCount++:failCount++;};

const categoryArtwork=read('src/components/CategoryArtwork.tsx');
const categoryVisuals=read('src/visuals/categoryVisuals.ts');
const marketplace=read('src/marketplace/MarketplaceCategoryChrome.tsx');
const homeServices=read('src/home/KareebuServiceCarousel.tsx');
const serviceRegistry=read('src/services/serviceRegistry.ts');
const shops=read('src/shops/ShopsLandingScreen.tsx');
const promoCarousel=read('src/promotions/PromoCarousel.tsx');
const verticalPromo=read('src/promotions/VerticalPromoCarousel.tsx');
const discoveryDoc=read('src/discovery/document.ts');
const discoveryWidgets=read('src/discovery/widgets.tsx');
const discoveryScreen=read('src/discovery/KareebuCareemDiscoveryScreen.tsx');
const discoveryConfig=read('src/discovery/domainConfig.ts');
const membership=read('src/engagement/screens.tsx');
const screens=read('src/screens.tsx');
const banner=read('src/commerce/MerchantCampaignBanner.tsx');

const pharmacyMappings=[
  ['cold-flu','pharmacyColdFlu'],
  ['pain-relief','pharmacyPainRelief'],
  ['allergy','pharmacyAllergy'],
  ['digestive','pharmacyDigestive'],
  ['first-aid','pharmacyFirstAid'],
];
check('pharmacy priority categories use distinct packaged merchandising artwork',
  pharmacyMappings.every(([key,asset])=>categoryVisuals.includes(`'pharmacy.${key}': local(merchV5.${asset}`)) &&
  new Set(pharmacyMappings.map(([,asset])=>asset)).size===pharmacyMappings.length);
check('marketplace category resolver maps cold and flu directly',marketplace.includes("return 'pharmacy.cold-flu'"));
check('marketplace category resolver maps pain relief directly',marketplace.includes("return 'pharmacy.pain-relief'"));
check('marketplace category resolver maps allergy directly',marketplace.includes("return 'pharmacy.allergy'"));
check('marketplace category resolver maps digestive health directly',marketplace.includes("return 'pharmacy.digestive'"));
check('marketplace category resolver maps first aid directly',marketplace.includes("return 'pharmacy.first-aid'"));
check('semantic vector fallbacks render as large framed category artwork',categoryArtwork.includes('vectorFrame')&&categoryArtwork.includes(".69")&&categoryArtwork.includes('backgroundColor:vectorBackground'));
check('marketplace category grid is three columns with large artwork',marketplace.includes('Math.floor((usable-gap*2)/3)')&&marketplace.includes('size="large"'));
check('Home service grid is three columns by two rows for larger icons',homeServices.includes('ITEMS_PER_PAGE=6')&&homeServices.includes('COLUMNS_PER_PAGE=3')&&serviceRegistry.includes('rows:2,visibleColumns:3'));

const dedicatedVerticals=['pharmacyHome','giftsFlowersHome','butcherySeafoodHome','petStoresHome','beautyHome','electronicsHome','fashionHome','homeShoppingHome'];
check('Shop by Vertical routes into dedicated mini-app screens',dedicatedVerticals.every(route=>shops.includes(`screen:'${route}'`))&&shops.includes('onGo(vertical.screen)'));

check('general promotion carousel shows one dominant card with a visible reveal gap',promoCarousel.includes('width-52')&&promoCarousel.includes('const interval=cardWidth+gap')&&promoCarousel.includes('snapToInterval={interval}')&&promoCarousel.includes('gap:SPACE.md'));
check('vertical promotion carousel shows one dominant card with a visible reveal gap',verticalPromo.includes('width-52')&&verticalPromo.includes('const interval=cardWidth+gap')&&verticalPromo.includes('snapToInterval={interval}')&&verticalPromo.includes('ItemSeparatorComponent'));
check('marketplace major promotion rail snaps one card plus gap',marketplace.includes('const interval=cardWidth+gap')&&marketplace.includes('snapToInterval={interval}')&&marketplace.includes('disableIntervalMomentum')&&!marketplace.includes('pagingEnabled'));

const forbiddenMarketplaceClaims=['MEMBER PRICE','MEMBER DELIVERY','FAST DELIVERY','Try free delivery','UP TO 30% OFF'];
check('static marketplace editorial cards contain no invented commercial benefit claims',forbiddenMarketplaceClaims.every(term=>!marketplace.includes(term)));
check('reference merchant banner does not promise an offer',!banner.includes('live offers confirmed before checkout')&&!banner.includes('Featured assortment')&&banner.includes('Availability and commercial details confirmed at checkout'));

check('Discovery does not synthesize ETA distance free-delivery offers or verification',
  discoveryDoc.includes('etaMinutes:null')&&discoveryDoc.includes('distanceKm:null')&&discoveryDoc.includes('freeDelivery:null')&&discoveryDoc.includes('offerLabel:null')&&discoveryDoc.includes('verified:null'));
check('Discovery document has no duplicate static promotion carousel',!discoveryDoc.includes("type:'hero-carousel'"));
check('Discovery hero is sourced from central PromotionCampaign catalogue',discoveryScreen.includes('promotionsFor(')&&discoveryScreen.includes('<PromotionHero campaign={heroPromotion}'));
check('Discovery UI does not expose invented top-rated or fastest sorting',discoveryScreen.includes('Default order')&&!discoveryScreen.includes('Top rated')&&!discoveryScreen.includes('Fastest'));
check('Discovery reference cards explicitly ask user to check live details',discoveryWidgets.includes('Reference listing · check live details'));
check('static discovery filters do not advertise free delivery or live availability',!discoveryConfig.includes("label:'Free delivery'")&&!discoveryConfig.includes("label:'Available today'")&&!discoveryConfig.includes("label:'Available now'"));

const forbiddenMembershipClaims=['Save 17%','UGX 12,000/month','UGX 120,000/year','2× points','2x points','Selected free delivery'];
check('membership screen does not manufacture plan price savings or delivery benefits',forbiddenMembershipClaims.every(term=>!membership.includes(term)));
check('referral UI does not manufacture a fixed cash reward',!screens.includes('formatMoney(data.country,5000)')&&!screens.includes('Invite friends, get'));

console.log(`Kareebu icon + promotion integrity: ${passCount}/${passCount+failCount}.`);
if(failCount)process.exit(1);
