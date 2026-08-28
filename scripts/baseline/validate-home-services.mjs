import fs from 'node:fs';

const registry=fs.readFileSync('src/services/serviceRegistry.ts','utf8');
const types=fs.readFileSync('src/types.ts','utf8');
const screens=fs.readFileSync('src/screens.tsx','utf8');
const visuals=fs.readFileSync('src/visuals/categoryVisuals.ts','utf8');
const carousel=fs.readFileSync('src/home/KareebuServiceCarousel.tsx','utf8');

const definitions=[...registry.matchAll(/\{id:'([^']+)',label:'([^']+)',description:'([^']+)',visualKey:'([^']+)',route:'([^']+)',marketAvailability:([^,]+),enabled:(true|false),sortOrder:(\d+),homeCarousel:(true|false)([\s\S]*?)\}/g)].map(match=>({id:match[1],label:match[2],description:match[3],visualKey:match[4],route:match[5],market:match[6],enabled:match[7]==='true',sortOrder:Number(match[8]),homeCarousel:match[9]==='true',tail:match[10]}));
const screenNames=new Set([...types.matchAll(/'([^']+)'/g)].map(match=>match[1]));
const routeCases=new Set([...screens.matchAll(/case\s+'([^']+)'\s*:/g)].map(match=>match[1]));
const home=definitions.filter(item=>item.enabled&&item.homeCarousel).sort((a,b)=>a.sortOrder-b.sortOrder);
const expected=['rides','food','groceries','pharmacy','boda','shops','send','more','home-care','pay','dineout','go-out','fix','rentals','for-good','rewards'];

const failures=[];
let checks=0;
const check=(condition,message)=>{checks++;if(condition)console.log(`PASS — ${message}`);else{console.error(`FAIL — ${message}`);failures.push(message);}};

check(definitions.length>=16,`service registry parsed ${definitions.length} definitions`);
check(new Set(definitions.map(item=>item.id)).size===definitions.length,'service ids are unique');
check(home.map(item=>item.id).join(',')===expected.join(','),'Home service order matches the two-page contract');
check(home.every(item=>item.label&&item.description&&item.visualKey&&item.route),'every Home service has label, description, visual and route');
check(home.every(item=>screenNames.has(item.route)&&routeCases.has(item.route)),'every Home service route exists and renders');
check(home.every(item=>new RegExp(`\\b${item.visualKey}:`).test(visuals)),'every Home service visual resolves through the semantic registry');
check(home.every(item=>item.market.trim()==='EAST_AFRICA'),'every Home service has centralized East Africa availability');
check(carousel.includes('ITEMS_PER_PAGE=6')&&carousel.includes('COLUMNS_PER_PAGE=3'),'carousel groups services into three columns by two rows for larger icons');
check(carousel.includes('snapToInterval={pageWidth+PAGE_GAP}')&&carousel.includes('horizontal'),'carousel is horizontal and snaps predictably');
check(registry.includes("type:'service-tile-carousel'")&&registry.includes('rows:2,visibleColumns:3'),'App Engine service-carousel definition exists');

if(failures.length)process.exit(1);
console.log(`Kareebu Home service contracts: ${checks-failures.length}/${checks}.`);
