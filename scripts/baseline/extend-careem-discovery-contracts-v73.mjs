import fs from 'node:fs';

const file='scripts/baseline/validate-contracts.mjs';
let source=fs.readFileSync(file,'utf8');

const marker='// Master catalogue';
const fallback='// Commerce';
const anchor=source.includes(marker)?marker:fallback;
if(!source.includes(anchor)) throw new Error('Could not locate V7 commerce contract insertion point.');

if(!source.includes('Careem-style discovery renderer is modular')){
  const block=`// Careem-style discovery parity
const discoveryScreen=read('src/discovery/KareebuCareemDiscoveryScreen.tsx', false);
const discoveryDocument=read('src/discovery/document.ts', false);
const discoveryRenderer=read('src/discovery/renderer.tsx', false);
const discoveryConfig=read('src/discovery/domainConfig.ts', false);
check('marketplace','Careem-style discovery renderer is modular',
  discoveryScreen.includes('useKareebuDiscoveryController') &&
  discoveryDocument.includes('buildKareebuDiscoveryDocument') &&
  discoveryRenderer.includes('renderKareebuDiscoveryWidget'));
check('marketplace','discovery supports Careem-style filter and sort sheet',
  discoveryScreen.includes('Filters & sorting') && discoveryScreen.includes('Show results'));
check('marketplace','discovery uses vertical → category → subcategory hierarchy',
  discoveryDocument.includes("type:'vertical-grid'") &&
  discoveryDocument.includes("type:'category-rail'") &&
  discoveryDocument.includes("type:'subcategory-grid'"));
check('marketplace','discovery uses campaign-backed promotion hero',
  discoveryScreen.includes('promotionsFor(') && discoveryScreen.includes('<PromotionHero campaign={heroPromotion}') && !discoveryDocument.includes("type:'hero-carousel'"));
check('marketplace','discovery includes recommended and all-item sections',
  discoveryDocument.includes("type:'item-rail'") && discoveryDocument.includes("type:'item-list'"));
check('marketplace','all five new customer discovery routes render',
  ['dineOut','groceries','electronics','homeCare','fix'].every((route)=>files.types.includes("'" + route + "'")) &&
  ['dineOut','groceries','electronics','homeCare','fix'].every((route)=>files.screens.includes("case '" + route + "'")));
check('marketplace','domain configuration covers Food DineOut Groceries Shops Electronics Home & Care and Fix',
  discoveryConfig.includes("'home-care':") &&
  discoveryConfig.includes('dineout:') &&
  discoveryConfig.includes('electronics:') &&
  discoveryConfig.includes('groceries:') &&
  discoveryConfig.includes('shops:') &&
  discoveryConfig.includes('fix:') &&
  discoveryConfig.includes('food:'));

`;
  source=source.replace(anchor,block+anchor);
}

fs.writeFileSync(file,source);
console.log('PASS — V7 contracts extended for Careem-style discovery parity.');
