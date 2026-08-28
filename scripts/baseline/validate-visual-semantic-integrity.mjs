import fs from 'node:fs';
import path from 'node:path';

const read=(file)=>fs.readFileSync(file,'utf8');
const sourceFiles=[];
function walk(dir){
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()) walk(p);
    else if(/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(p);
  }
}
walk('src');

const legacy=[];
for(const file of sourceFiles){
  const source=read(file);
  if(source.includes('discovery-3d')||source.includes('services-3d')) legacy.push(file);
}

const registry=read('src/visuals/categoryVisuals.ts');
const gaps=read('src/visuals/visualAssetGaps.ts');
const discovery=read('src/discovery/art.tsx');
const product=read('src/commerce/productVisuals.ts');
const serviceArtwork=read('src/components/ServiceArtwork.tsx');
const categoryArtwork=read('src/components/CategoryArtwork.tsx');

const checks=[];
const pass=(name,condition)=>checks.push([name,!!condition]);
const hasAll=(source,needles)=>needles.every((needle)=>source.includes(needle));
const hasNone=(source,needles)=>needles.every((needle)=>!source.includes(needle));

pass('application source has no legacy discovery-3d/services-3d references',legacy.length===0);
pass('semantic art direction remains photorealistic/product-led',registry.includes('photorealistic product/service cutouts')&&registry.includes('realistic isometric'));
pass('discovery art resolves through semantic registry',discovery.includes('categoryVisual(key)'));
pass('category artwork renders an explicit icon when production media is absent',categoryArtwork.includes("visual.icon ?? 'grid'"));
pass('service artwork renders an explicit icon when production media is absent',serviceArtwork.includes("visual.icon??'grid'")&&serviceArtwork.includes('<Ionicons'));

pass('Gaming uses dedicated packaged merchandising art rather than a generic entertainment fallback',registry.includes("'electronics.gaming': local(merchV5.gaming")&&!registry.includes("'electronics.gaming': vector("));
pass('Women Men Kids and Accessories have dedicated packaged merchandising art',hasAll(registry,[
  "'fashion.women': local(merchV5.fashionWomen",
  "'fashion.men': local(merchV5.fashionMen",
  "'fashion.children': local(merchV5.fashionKids",
  "'fashion.accessories': local(merchV5.fashionAccessories",
]));
pass('Women Men and Kids do not inherit generic footwear or baby-care artwork',hasNone(registry,[
  "'fashion.women': local(d3.fashion",
  "'fashion.men': local(d3.fashion",
  "'fashion.children': local(d3.baby",
]));
pass('Home service branches have distinct explicit semantic definitions',hasAll(registry,[
  "'home.plumbing': local(semanticServiceArt.plumbing",
  "'home.electrical': local(semanticServiceArt.electrical",
  "'home.ac': vector('snow-outline'",
  "'home.moving': vector('cube-outline'",
]));
pass('Home Moving never resolves to grocery artwork',!registry.includes("'home.moving': local(d3.groceries"));
pass('service branches have explicit plumbing electrical AC moving and beauty-home semantics',hasAll(registry,[
  "'services.plumbing': local(semanticServiceArt.plumbing",
  "'services.electrical': local(semanticServiceArt.electrical",
  "'services.ac': vector('snow-outline'",
  "'services.moving': vector('cube-outline'",
  "'services.beauty-home': vector('cut-outline'",
]));
pass('Send parcel documents gift and business have separate semantic definitions',hasAll(registry,[
  "'general.cube-outline': vector('cube-outline'",
  "'general.document-text-outline': vector('document-text-outline'",
  "'general.gift-outline': vector('gift-outline'",
  "'general.briefcase-outline': vector('briefcase-outline'",
]));
pass('Documents never use shopping or grocery artwork',hasNone(registry,[
  "'general.document-text-outline': local(d3.groceries",
  "'general.document-text-outline': local(d3.fashion",
  "'general.document-text-outline': local(d3.essentials",
]));

pass('product imagery resolves by product semantics',product.includes('poolFor(identity)')&&product.includes('input.subcategory'));
pass('headphones cannot rotate through phone or computing photographs',product.includes("if (/headphone|earbud|audio|speaker|soundbar/.test(value)) return { images:[A.headphones]")&&!product.includes('images:[A.headphones,A.phones')&&!product.includes('images:[A.phones,A.computing,A.headphones'));
pass('phones cannot rotate through laptop or headphone photographs',product.includes("if (/phone|smartphone|charger|cable|power bank|powerbank|mobile/.test(value)) return { images:[A.phones]")&&!product.includes('images:[A.phones,A.computing'));
pass('fashion clothing uses shirt fallback instead of trainer photography',product.includes("if (/dress|shirt|jean|trouser|jacket|fashion|clothing|apparel/.test(value)) return { images:[], icon:'shirt-outline' }"));
pass('makeup fragrance and hair use semantic fallbacks instead of neighbouring beauty photos',hasAll(product,[
  "if (/makeup|cosmetic/.test(value)) return { images:[], icon:'color-palette-outline' }",
  "if (/fragrance|perfume|cologne/.test(value)) return { images:[], icon:'sparkles-outline' }",
  "if (/hair|groom/.test(value)) return { images:[], icon:'cut-outline' }",
]));
pass('unknown product families do not borrow unrelated photographs',product.includes("return { images:[], icon:'storefront-outline' }"));

pass('resolved Fashion and Gaming artwork is removed from the production gap backlog',hasNone(gaps,["key:'fashion.women'","key:'fashion.men'","key:'fashion.children'","key:'fashion.accessories'","key:'electronics.gaming'"]));
pass('remaining Home service production art gaps are explicit',hasAll(gaps,["key:'services.ac'","key:'services.moving'","key:'services.beauty-home'"])&&!gaps.includes("key:'services.plumbing'")&&!gaps.includes("key:'services.electrical'"));
pass('Send production art gaps are explicit',hasAll(gaps,["key:'send.parcel'","key:'send.documents'","key:'send.gift'","key:'send.business'"]));
pass('resolved Beauty merchandising artwork is removed from the production gap backlog',hasNone(gaps,["key:'beauty.makeup'","key:'beauty.fragrance'","key:'beauty.hair'"]));
pass('generic legacy Kareebu bag is not used for Women Men Kids or Accessories',hasNone(registry,["'fashion.women': local(d3.","'fashion.men': local(d3.","'fashion.children': local(d3.","'fashion.accessories': local(d3."]));

let failures=0;
for(const [name,ok] of checks){
  console.log(`${ok?'PASS':'FAIL'} — ${name}`);
  if(!ok) failures++;
}
if(legacy.length) console.log('Legacy files:',legacy.join(', '));
console.log(`Kareebu visual semantic integrity contracts: ${checks.length-failures}/${checks.length}.`);
process.exit(failures?1:0);
