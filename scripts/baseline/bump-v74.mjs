import fs from 'node:fs';
const file='package.json';
const pkg=JSON.parse(fs.readFileSync(file,'utf8'));
if(!pkg.kareebuBaseline||!String(pkg.kareebuBaseline.version||'').startsWith('7.')){
  throw new Error('Kareebu V7 baseline required.');
}
pkg.kareebuBaseline.version='7.4.3';
pkg.kareebuBaseline.contracts=9;
pkg.scripts={
  ...(pkg.scripts??{}),
  'validate:visual-parity':'node scripts/baseline/validate-careem-visual-v74.mjs',
  'validate:back-ownership':'node scripts/baseline/validate-single-back-ownership-v742.mjs',
};
fs.writeFileSync(file,JSON.stringify(pkg,null,2)+'\n');
console.log('PASS — baseline metadata advanced to V7.4.3.');
