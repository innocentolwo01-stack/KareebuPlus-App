import fs from 'node:fs';

const file='package.json';
const pkg=JSON.parse(fs.readFileSync(file,'utf8'));
if(!pkg.kareebuBaseline||!String(pkg.kareebuBaseline.version||'').startsWith('7.')){
  throw new Error('Kareebu V7 baseline required.');
}
pkg.kareebuBaseline.version='7.3.1';
pkg.kareebuBaseline.contracts=6;
pkg.scripts={
  ...(pkg.scripts??{}),
  'validate:discovery':'node scripts/baseline/validate-careem-discovery-v73.mjs',
  'validate:discovery-compat':'node scripts/baseline/validate-discovery-compat-v731.mjs',
  'validate:catalog':'node scripts/baseline/validate-careem-taxonomy-v721.mjs',
};
fs.writeFileSync(file,JSON.stringify(pkg,null,2)+'\n');
console.log('PASS — baseline metadata advanced to V7.3.1 / contracts v6.');
