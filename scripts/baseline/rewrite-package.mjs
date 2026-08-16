import fs from 'node:fs';

const file='package.json';
const pkg=JSON.parse(fs.readFileSync(file,'utf8'));
const scripts={...(pkg.scripts ?? {})};

const legacy={};
for(const [name,command] of Object.entries(scripts)){
  if(name === 'validate' || name.startsWith('validate:')){
    legacy[name]=command;
    delete scripts[name];
  }
}

fs.mkdirSync('scripts/baseline',{recursive:true});
fs.writeFileSync(
  'scripts/baseline/legacy-scripts.json',
  JSON.stringify({ archivedAt:new Date().toISOString(), scripts:legacy },null,2)+'\n',
);

Object.assign(scripts,{
  validate:'node scripts/baseline/validate-contracts.mjs',
  'validate:baseline':'node scripts/baseline/validate-contracts.mjs',
  'validate:brand':'node scripts/baseline/validate-contracts.mjs brand',
  'validate:uxui':'node scripts/baseline/validate-contracts.mjs ui',
  'validate:navigation':'node scripts/baseline/validate-contracts.mjs navigation',
  'validate:functionality':'node scripts/baseline/validate-contracts.mjs navigation',
  'validate:food':'node scripts/baseline/validate-contracts.mjs food',
  'validate:frontend':'node scripts/baseline/validate-contracts.mjs marketplace',
  'validate:category-layout':'node scripts/baseline/validate-contracts.mjs marketplace',
  'validate:marketplace':'node scripts/baseline/validate-contracts.mjs marketplace',
  'validate:products':'node scripts/baseline/validate-contracts.mjs commerce',
  'validate:demand':'node scripts/baseline/validate-contracts.mjs commerce',
  'validate:mobility':'node scripts/baseline/validate-contracts.mjs mobility',
  'validate:boda':'node scripts/baseline/validate-contracts.mjs mobility',
  'validate:captain':'node scripts/baseline/validate-contracts.mjs mobility',
  'validate:merchant':'node scripts/baseline/validate-contracts.mjs merchant',
  'validate:merchant-media':'node scripts/baseline/validate-contracts.mjs merchant',
  'validate:merchant-profile':'node scripts/baseline/validate-contracts.mjs merchant',
  'validate:parity':'node scripts/baseline/validate-contracts.mjs routes',
  'validate:routes':'node scripts/baseline/validate-contracts.mjs routes',
  'validate:interactions':'node scripts/baseline/validate-contracts.mjs interactions',
  'validate:legacy':'node scripts/baseline/run-legacy-validators.mjs',
  'baseline:freeze':'node scripts/baseline/freeze-baseline.mjs',
  'baseline:check':'node scripts/baseline/check-baseline.mjs',
});

pkg.scripts=scripts;
pkg.kareebuBaseline={version:'7.0.0',contracts:1,strategy:'contract-first'};
fs.writeFileSync(file,JSON.stringify(pkg,null,2)+'\n');

console.log(`PASS — archived ${Object.keys(legacy).length} legacy validation commands.`);
console.log('PASS — package.json now exposes only canonical V7 validate:* hard gates.');
