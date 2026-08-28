import fs from 'node:fs';

const file='package.json';
const pkg=JSON.parse(fs.readFileSync(file,'utf8'));
if(!pkg.kareebuBaseline || !String(pkg.kareebuBaseline.version||'').startsWith('7.')){
  throw new Error('Kareebu V7 baseline metadata is missing.');
}
pkg.kareebuBaseline.version='7.1.1';
pkg.kareebuBaseline.contracts=2;
fs.writeFileSync(file,JSON.stringify(pkg,null,2)+'\n');
console.log('PASS — Kareebu baseline metadata advanced to V7.1.0 / contracts v2.');
