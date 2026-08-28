import fs from 'node:fs';

const file='scripts/baseline/validate-contracts.mjs';
let source=fs.readFileSync(file,'utf8');

const anchor="check('marketplace','generated category files contain no escaped template delimiters',";
if(!source.includes(anchor)){
  throw new Error('Could not locate V7 marketplace contract insertion point.');
}

if(!source.includes("marketplace category header exposes a white content-sheet transition")){
  const before=source.indexOf(anchor);
  const extra=`check('marketplace','marketplace category header exposes a white content-sheet transition',
  files.marketplace.includes('whiteSheetBridge'));
check('marketplace','marketplace hero supports multiple promotions',
  files.marketplace.includes('promotions=[theme.hero,theme.secondary,theme.member]'));
check('marketplace','marketplace promotions expose carousel position affordance',
  files.marketplace.includes('heroDots') && files.marketplace.includes('heroDotActive'));
check('marketplace','marketplace category grid has its own discovery heading',
  files.marketplace.includes('Shop by category'));
check('marketplace','marketplace promo grid has its own offers heading',
  files.marketplace.includes('Offers for you'));
`;
  source=source.slice(0,before)+extra+source.slice(before);
}

fs.writeFileSync(file,source);
console.log('PASS — V7 marketplace contracts extended for reference-layout polish.');
