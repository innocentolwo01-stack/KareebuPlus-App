import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const atlas=path.join(root,'assets/kareebu-plus/lifestyle-cutouts');
const required=[
  'service-rides.png','service-boda.png','service-food.png','service-groceries.png',
  'service-pharmacy.png','service-send.png','service-fix.png','service-dineout.png',
  'service-electronics.png','service-home-care.png','service-shops.png','service-go-out.png','grocery-fresh-food.png',
  'grocery-beef.png','grocery-chicken.png','grocery-bakery.png','grocery-dairy-eggs.png',
  'grocery-drinks.png','grocery-household-cleaning.png','grocery-personal-care.png',
  'grocery-goat.png','grocery-fish.png','grocery-seafood.png','grocery-snacks.png',
  'grocery-cooking-staples.png',
  'pharmacy-vitamins.png','electronics-phones.png','electronics-computing.png','electronics-tv.png',
];

const failures=[];
for(const name of required){
  const file=path.join(atlas,name);
  if(!fs.existsSync(file)){failures.push(`${name}: missing`);continue;}
  const png=fs.readFileSync(file);
  if(png.toString('ascii',1,4)!=='PNG'){failures.push(`${name}: not PNG`);continue;}
  const width=png.readUInt32BE(16);
  const height=png.readUInt32BE(20);
  const colourType=png[25];
  if(width<512||height<512) failures.push(`${name}: ${width}x${height} is below 512px master target`);
  if(colourType!==4&&colourType!==6) failures.push(`${name}: PNG has no alpha channel`);
}

const resolver=fs.readFileSync(path.join(root,'src/visuals/categoryVisuals.ts'),'utf8');
const contracts=[
  ['exact semantic resolver',resolver.includes("level:'exact'")],
  ['explicit parent resolver',resolver.includes('CATEGORY_PARENT_KEYS')],
  ['domain fallback resolver',resolver.includes('DOMAIN_VISUAL_KEYS')],
  ['no label argument',!resolver.includes('title.includes(')],
  ['raw beef mapping',resolver.includes("'butchery.beef': local(d3.rawBeef")],
  ['raw chicken mapping',resolver.includes("'butchery.chicken': local(d3.rawChicken")],
  ['food context mapping',resolver.includes("'food.chicken': local(d3.chicken")],
];
for(const [label,pass] of contracts) if(!pass) failures.push(`${label}: failed`);

if(failures.length){
  console.error(failures.map(item=>`FAIL — ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Kareebu visual assets: ${required.length}/${required.length} alpha PNG masters; ${contracts.length}/${contracts.length} resolver contracts.`);
