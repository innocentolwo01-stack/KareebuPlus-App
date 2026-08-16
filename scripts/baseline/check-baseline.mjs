import fs from 'node:fs';
import crypto from 'node:crypto';

const strict=process.argv.includes('--strict');
const manifestFile='kareebu-baseline.json';

if(!fs.existsSync(manifestFile)){
  console.error('FAIL — kareebu-baseline.json is missing. Run npm run baseline:freeze.');
  process.exit(1);
}
const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));

function hash(file){
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

const missing=[];
const changed=[];
for(const [file,expected] of Object.entries(manifest.coreFiles ?? {})){
  if(!fs.existsSync(file)){missing.push(file);continue;}
  if(hash(file)!==expected)changed.push(file);
}

console.log(`Kareebu+ baseline ${manifest.version} · frozen ${manifest.frozenAt}`);
console.log(`Core files: ${Object.keys(manifest.coreFiles ?? {}).length}`);
console.log(`Changed since freeze: ${changed.length}`);
console.log(`Missing since freeze: ${missing.length}`);

for(const file of changed)console.log(`DRIFT — ${file}`);
for(const file of missing)console.log(`MISSING — ${file}`);

if(!changed.length&&!missing.length)console.log('PASS — source matches the frozen V7 baseline.');
else console.log('INFO — drift is allowed when intentional; contracts, TypeScript and runtime gates decide acceptance.');

if(strict && (changed.length||missing.length))process.exit(1);
