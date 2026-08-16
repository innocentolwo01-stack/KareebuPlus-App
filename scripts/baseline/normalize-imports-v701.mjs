import fs from 'node:fs';

const files=[
  'src/screens.tsx',
  'src/components.tsx',
  'src/v41/frontend.tsx',
  'src/food/discovery/surfaces.tsx',
  'src/ride/kareebuRidesHome.tsx',
  'src/ride/kareebuBodaHome.tsx',
];

let removed=0;

for(const file of files){
  if(!fs.existsSync(file))continue;
  const lines=fs.readFileSync(file,'utf8').split('\n');
  const seen=new Set();
  const next=[];

  for(const line of lines){
    const trimmed=line.trim();
    const isImport=/^import\s.+\sfrom\s['"][^'"]+['"];?$/.test(trimmed) ||
      /^import\s['"][^'"]+['"];?$/.test(trimmed);

    if(isImport){
      if(seen.has(trimmed)){
        removed++;
        continue;
      }
      seen.add(trimmed);
    }
    next.push(line);
  }

  fs.writeFileSync(file,next.join('\n'));
}

console.log(`PASS — import normalization removed ${removed} byte-identical duplicate import declaration(s).`);
