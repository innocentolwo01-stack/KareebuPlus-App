import fs from 'node:fs';
const types=fs.readFileSync('src/promotions/types.ts','utf8');
const universal=fs.readFileSync('src/taxonomy/UniversalTaxonomyLandingScreen.tsx','utf8');
const registry=fs.readFileSync('src/taxonomy/registry.ts','utf8');
const global=fs.readFileSync('src/global/screens.tsx','utf8');
const checks=[];const pass=(name,c)=>checks.push([name,!!c]);
for(const placement of ['LANDING_HERO','LANDING_AFTER_CHILDREN','LANDING_AFTER_FEATURED','LANDING_INLINE_1','LANDING_INLINE_2','LANDING_BRAND','LANDING_MERCHANT','LANDING_PRODUCT','LANDING_SEASONAL','LANDING_EDITORIAL']) pass(`promotion placement ${placement} exists`,types.includes(`'${placement}'`));
pass('taxonomy nodes carry hero and inline campaign placements',registry.includes('heroPlacement')&&registry.includes('inlinePlacement'));
pass('commercial landing can combine children, sellers, brands, products and campaigns',universal.includes('uniqueChildren')&&universal.includes('data={uniqueChildren}')&&universal.includes('sellers.length')&&universal.includes('brandCounts.length')&&universal.includes('ProductTile')&&universal.includes('PromotionSurface'));
pass('experience landing can combine taxonomy and photography-led places',universal.includes('ExperienceTile')&&universal.includes('experiences.length'));
pass('Global collection contains a campaign plus deep child destinations',global.includes("placement=\"LANDING_HERO\"")&&global.includes('globalChildGrid'));
let failures=0;for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} — ${name}`);if(!ok)failures++;}
console.log(`Kareebu commercial landing contracts: ${checks.length-failures}/${checks.length}.`);process.exit(failures?1:0);
