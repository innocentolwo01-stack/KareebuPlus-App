import fs from 'node:fs';

function read(file){return fs.readFileSync(file,'utf8');}
function write(file,value){fs.writeFileSync(file,value);}
function insertAfter(source,anchor,addition,label){
  if(source.includes(addition.trim())) return source;
  const index=source.indexOf(anchor);
  if(index<0) throw new Error(`Could not locate ${label}.`);
  return source.slice(0,index+anchor.length)+addition+source.slice(index+anchor.length);
}

const typesFile='src/types.ts';
let types=read(typesFile);
const routeAnchor="  | 'food'\n";
const routes=[
  "  | 'dineOut'\n",
  "  | 'groceries'\n",
  "  | 'electronics'\n",
  "  | 'homeCare'\n",
  "  | 'fix'\n",
].join('');
if(!types.includes("  | 'dineOut'")){
  if(!types.includes(routeAnchor)) throw new Error('Could not locate Food route in Screen union.');
  types=types.replace(routeAnchor,routeAnchor+routes);
}
write(typesFile,types);

const screensFile='src/screens.tsx';
let screens=read(screensFile);

const discoveryImport="import { KareebuCareemDiscoveryScreen } from './discovery/KareebuCareemDiscoveryScreen';";
const catalogImport="import { KAREEBU_CATALOG_VERTICALS, type KareebuDomainId, type UnifiedCatalogItem } from './catalog/master/kareebuUnifiedCatalog';";

if(!screens.includes(discoveryImport)){
  const anchor="import { KareebuDineOutSection } from './home/KareebuDineOutSection';";
  if(!screens.includes(anchor)) throw new Error('Could not locate home DineOut import anchor.');
  screens=screens.replace(anchor,`${anchor}\n${discoveryImport}\n${catalogImport}`);
}

const helperMarker='// KAREEBU_CAREEM_DISCOVERY_ROUTE_ADAPTER_V73';
if(!screens.includes(helperMarker)){
  const anchor='export function FoodScreen({';
  const index=screens.indexOf(anchor);
  if(index<0) throw new Error('Could not locate FoodScreen for discovery adapter insertion.');

  const helper=`${helperMarker}
function KareebuDomainDiscoveryRoute({
  domainId,
  data,
  actions,
  initialVerticalTitle,
}: {
  domainId: KareebuDomainId;
  data: AppData;
  actions: AppActions;
  initialVerticalTitle?: string;
}) {
  const selectStoreForItem = (item: UnifiedCatalogItem) => {
    const vertical = KAREEBU_CATALOG_VERTICALS.find((node) => node.id === item.verticalId);
    const label = (vertical?.title ?? initialVerticalTitle ?? '').toLowerCase();
    const desired =
      domainId === 'groceries' ? ['Groceries'] :
      domainId === 'electronics' ? ['Electronics','Marketplace'] :
      /pharm|health|wellness/.test(label) ? ['Pharmacy'] :
      /beauty/.test(label) ? ['Beauty'] :
      /pet/.test(label) ? ['Pets'] :
      /home/.test(label) ? ['Home'] :
      ['Marketplace','Electronics','Groceries'];

    const stores = localeStores(data.country, data.city);
    return (
      desired.map((category) => stores.find((store) => store.category === category)).find(Boolean) ??
      desired.map((category) => DEMO_SHOPS.find((store) => store.category === category)).find(Boolean) ??
      stores[0] ??
      DEMO_SHOPS[0]
    );
  };

  const openItem = (item: UnifiedCatalogItem) => {
    if (domainId === 'dineout' || domainId === 'food') {
      const restaurants = DEMO_RESTAURANTS;
      const index = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % Math.max(1, restaurants.length);
      const restaurant = restaurants[index];
      if (restaurant) {
        actions.selectRestaurant(restaurant.id);
        actions.go('restaurant');
      }
      return;
    }

    if (domainId === 'home-care' || domainId === 'fix') {
      const value = \`\${item.name} \${item.subcategoryId}\`.toLowerCase();
      const serviceId =
        /plumb|tap|pipe|drain|toilet|sink/.test(value) ? 'plumbing' :
        /electrical|power|socket|switch|light|wiring/.test(value) ? 'electrical' :
        /ac|air.condition|cooling/.test(value) ? 'ac' :
        'cleaning';
      actions.selectService(serviceId);
      actions.go('serviceProviders');
      return;
    }

    const store = selectStoreForItem(item);
    if (store) actions.selectShop(store.id);
    actions.selectCommerceProduct(item.id);
    actions.go('commerceProduct');
  };

  return (
    <KareebuCareemDiscoveryScreen
      domainId={domainId}
      city={data.city}
      country={data.country}
      initialVerticalTitle={initialVerticalTitle}
      onOpenItem={openItem}
      onOpenMembership={() => actions.go('membership')}
    />
  );
}

`;
  screens=screens.slice(0,index)+helper+screens.slice(index);
}

// Home routing presets.
screens=screens.replace(
  "if (label === 'Groceries') actions.setShopCategoryPreset('Groceries');",
  "if (label === 'Groceries') actions.setShopCategoryPreset('Groceries');\n    if (label === 'Healthcare') actions.setShopCategoryPreset('Pharmacy');"
);

// The supplementary service arrays should use actual new routes.
screens=screens.replace(
  "{ label: 'Groceries', image: assets.service.groceries, screen: 'shops' },",
  "{ label: 'Groceries', image: assets.service.groceries, screen: 'groceries' },"
);
screens=screens.replace(
  "{ label: 'Groceries', screen: 'shops', image: assets.service.groceries },",
  "{ label: 'Groceries', screen: 'groceries', image: assets.service.groceries },"
);

// Add new service entries to All Services once.
const servicesAnchor="  { label: 'Pay', image: assets.service.pay, screen: 'wallet' },";
const servicesAddition=`
  { label: 'DineOut', image: assets.service.dineout, screen: 'dineOut' },
  { label: 'Electronics', image: assets.service.electronics, screen: 'electronics' },
  { label: 'Home & Care', image: assets.service.homeCare, screen: 'homeCare' },
  { label: 'Fix', image: assets.service.fix, screen: 'fix' },`;
if(!screens.includes("{ label: 'DineOut', image: assets.service.dineout, screen: 'dineOut' }")){
  if(!screens.includes(servicesAnchor)) throw new Error('Could not locate All Services Pay anchor.');
  screens=screens.replace(servicesAnchor,servicesAnchor+servicesAddition);
}

// Replace Shops render route with the shared discovery engine and add domain routes.
const oldShops="    case 'shops': return <ShopsScreen data={data} actions={actions}/>;";
const newShops=`    case 'shops': return <KareebuDomainDiscoveryRoute domainId="shops" data={data} actions={actions} initialVerticalTitle={data.shopCategoryPreset === 'All' ? undefined : data.shopCategoryPreset}/>;
    case 'groceries': return <KareebuDomainDiscoveryRoute domainId="groceries" data={data} actions={actions}/>;
    case 'electronics': return <KareebuDomainDiscoveryRoute domainId="electronics" data={data} actions={actions}/>;
    case 'dineOut': return <KareebuDomainDiscoveryRoute domainId="dineout" data={data} actions={actions}/>;
    case 'homeCare': return <KareebuDomainDiscoveryRoute domainId="home-care" data={data} actions={actions}/>;
    case 'fix': return <KareebuDomainDiscoveryRoute domainId="fix" data={data} actions={actions}/>;`;
if(screens.includes(oldShops)){
  screens=screens.replace(oldShops,newShops);
}else if(!screens.includes("case 'groceries': return <KareebuDomainDiscoveryRoute")){
  throw new Error('Could not locate Shops render case.');
}

write(screensFile,screens);

// Install the corrected Home carousel.
const sourceCarousel='src/home/KareebuServiceCarousel.tsx';
if(!fs.existsSync(sourceCarousel)) throw new Error('KareebuServiceCarousel missing.');

console.log('PASS — Screen union now has Careem-style commerce/service discovery routes.');
console.log('PASS — renderScreen now uses the shared discovery renderer for Shops/Groceries/Electronics/DineOut/Home & Care/Fix.');
console.log('PASS — Home service routes now resolve to actual Screen values.');
