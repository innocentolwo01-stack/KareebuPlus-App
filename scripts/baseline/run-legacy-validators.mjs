import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const strict=process.argv.includes('--strict');
const file='scripts/baseline/legacy-scripts.json';

if(!fs.existsSync(file)){
  console.log('No archived legacy validators.');
  process.exit(0);
}

const payload=JSON.parse(fs.readFileSync(file,'utf8'));
const entries=Object.entries(payload.scripts ?? {});
let failures=0;

console.log('Legacy validator report — diagnostic only.');
console.log('These validators are preserved for comparison but are NOT V7 hard gates.');

for(const [name,command] of entries){
  console.log(`\n--- ${name} ---`);
  const result=spawnSync(command,{shell:true,stdio:'inherit'});
  if(result.status!==0){
    failures++;
    console.log(`LEGACY FAIL — ${name}`);
  }else{
    console.log(`LEGACY PASS — ${name}`);
  }
}

console.log(`\nLegacy report complete: ${entries.length-failures} passed, ${failures} failed.`);
if(strict && failures)process.exit(1);
