import fs from 'node:fs';

const source=fs.readFileSync('src/taxonomy/registry.ts','utf8');
const checks=[];
const pass=(name,condition)=>checks.push([name,Boolean(condition)]);
const has=(value)=>source.includes(value);

pass('universal taxonomy registry exists',fs.existsSync('src/taxonomy/types.ts')&&fs.existsSync('src/taxonomy/registry.ts'));
pass('pharmacy has medicines root',has("'pharmacy.medicines'"));
pass('pharmacy cold flu cough is deeper than root',has("'pharmacy.medicines.cold-flu-cough'"));
pass('pharmacy cough child depth exists',has("['dry-cough','Dry Cough'")&&has("['chesty-cough','Chesty Cough'"));
pass('pharmacy digestive child depth exists',has("'pharmacy.medicines.digestive-health'")&&has("['heartburn','Heartburn'"));
pass('pharmacy vitamins and supplements is expanded',has("'pharmacy.vitamins-supplements'")&&has("['vitamin-d','Vitamin D'")&&has("['magnesium','Magnesium'"));
pass('pharmacy personal care is expanded',has("'pharmacy.personal-care'")&&has("['dental','Dental'")&&has("['feminine-care','Feminine Care'"));
pass('pharmacy skincare and haircare are separate roots',has("'pharmacy.skincare'")&&has("'pharmacy.haircare'"));
pass('beauty supports Makeup → Face → Foundation',has("'beauty.makeup'")&&has("'beauty.makeup.face'")&&has("['foundation','Foundation'"));
pass('fashion supports Women → Dresses → Occasion',has("'fashion.women'")&&has("'fashion.women.dresses'")&&has("['occasion','Occasion Dresses'"));
pass('electronics supports Gaming → Consoles',has("'electronics.gaming'")&&has("['consoles','Consoles'"));
pass('groceries supports Coffee & Tea depth',has("'groceries.coffee-tea'")&&has("['coffee','Coffee'"));
pass('GoOut supports Spa & Wellness → Massage',has("'goout.spa-wellness'")&&has("['massage','Massage'"));
pass('DineOut supports occasion and cuisine nodes',has("'dineout','DineOut'")&&has("['brunch','Brunch','occasion'")&&has("['african','African','cuisine'"));
pass('Home Services supports Cleaning child services',has("'services.cleaning'")&&has("['deep-cleaning','Deep Cleaning'"));
pass('Global supports marketplace nodes',has('global.marketplace.${marketplace}')&&has("['amazon','ebay','shein','temu','aliexpress','etsy']"));
pass('Global copies deep retail departments',has("const globalRoot=`global.${localDomain}`")&&has("child_category"));
pass('leaf detection is explicit',has('export const taxonomyLeaf')&&has('taxonomyChildren(id).length===0'));
pass('filters are not modelled as taxonomy nodes',!/(price|colour|rating|delivery|sort)-filter/.test(source));

let failures=0;
for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} — ${name}`);if(!ok)failures++;}
console.log(`Kareebu taxonomy depth contracts: ${checks.length-failures}/${checks.length}.`);
process.exit(failures?1:0);
