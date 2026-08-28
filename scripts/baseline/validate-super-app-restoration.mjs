import fs from 'node:fs';

const read=(path)=>fs.readFileSync(new URL(`../../${path}`,import.meta.url),'utf8');
const screens=read('src/screens.tsx');
const rides=read('src/ride/KareebuRidesLandingScreen.tsx');
const blueprint=read('src/experience/verticalLandingBlueprint.ts');
const landing=read('src/experience/VerticalLandingScreen.tsx');
const appEngine=read('src/appEngine/AppEnginePage.tsx');
const homeFeed=read('src/home/homeFeed.ts');
const homeDiscovery=read('src/home/HomeDiscoveryFeed.tsx');
const homeSlice=screens.slice(screens.indexOf('function HomeCampaignPager'),screens.indexOf('function DineOutPlanningScreen'));

const checks=[
  ['rejected quick actions removed from Home source',!(/HomeSuperAppActions|What do you need\?/.test(homeSlice))],
  ['rejected ride form removed from Home source',!(/HomeMobilityModule|NEED A RIDE\?|Search destination/.test(homeSlice))],
  ['Home mobility strip follows campaign pager',/const homeIntro=<View style=\{styles\.v42HomeIntro\}>\s*<HomeCampaignPager[\s\S]*<HomeMobilityStrip/.test(homeSlice)],
  ['Ride and Boda are separate mode-aware choices',/open\('RIDE'\)/.test(homeSlice)&&/open\('BODA'\)/.test(homeSlice)&&/selectVehicleMode\(actions,mode\)/.test(homeSlice)],
  ['mobility campaign follows category grid',/shop-categories[^\n]*priority:320/.test(homeFeed)&&/home-mobility-campaign[^\n]*priority:315/.test(homeFeed)],
  ['Ride and Boda campaigns preserve mode',/home-ride-campaign[^\n]*mobilityMode:'RIDE'[^\n]*mobilityHome/.test(homeFeed)&&/home-boda-campaign[^\n]*mobilityMode:'BODA'[^\n]*mobilityHome/.test(homeFeed)&&/module\.type==='mobility-campaign'/.test(homeDiscovery)],
  ['controlled four-campaign hero',/home-super-app/.test(homeSlice)&&/home-rides/.test(homeSlice)&&/home-shopping/.test(homeSlice)&&/home-send/.test(homeSlice)],
  ['campaign routes cover ride shopping and send',/ctaScreen:'mobilityHome'/.test(homeSlice)&&/ctaScreen:'shops'/.test(homeSlice)&&/ctaScreen:'parcel'/.test(homeSlice)],
  ['existing map-led mobility retained',/MapView/.test(rides)&&/DestinationCard/.test(rides)],
  ['saved places retained on Ride landing',/const saved=/.test(rides)&&/savedRail/.test(rides)],
  ['landing collection module configured',/type: 'category_carousel'/.test(blueprint)&&/collectionCategories/.test(blueprint)],
  ['landing collection module rendered',/section\.type==='category_carousel'/.test(landing)],
  ['honest merchandising labels',/Editor’s picks/.test(blueprint)&&/Shop by need/.test(blueprint)&&/Build your setup/.test(blueprint)&&/Shop by mission/.test(blueprint)],
  ['no fake Home campaign offers',!/(\d+% off|free delivery|best price|fastest)/i.test(homeSlice)],
  ['Home feed accounts for nav and safe-area inset',/useSafeAreaInsets/.test(appEngine)&&/62\+Math\.max\(insets\.bottom,8\)\+SPACE\.md/.test(appEngine)],
];

let failed=0;
for(const [label,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${label}`);if(!pass)failed++;}
console.log(`\nSuper-app restoration: ${checks.length-failed}/${checks.length}`);
if(failed)process.exit(1);
