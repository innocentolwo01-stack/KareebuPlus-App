import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const coreFiles=[
  'App.tsx','package.json','src/types.ts','src/theme.ts','src/components.tsx','src/screens.tsx',
  'src/navigation/AppNavigation.tsx','src/marketplace/MarketplaceCategoryChrome.tsx',
  'src/v41/frontend.tsx','src/food/discovery/FoodDiscoveryHome.tsx',
  'src/food/discovery/controller.ts','src/food/discovery/renderer.tsx',
  'src/food/discovery/surfaces.tsx','src/food/discovery/types.ts',
  'src/ride/kareebuRidesHome.tsx','src/ride/kareebuBodaHome.tsx',
  'src/ride/mobilityScreens.tsx','scripts/baseline/validate-contracts.mjs',
];

function hash(file){
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function command(args){
  try{return execFileSync('git',args,{encoding:'utf8'}).trim();}
  catch{return null;}
}
const types=fs.readFileSync('src/types.ts','utf8');
const match=types.match(/export type Screen\s*=\s*([\s\S]*?);/);
const routeCount=match?[...match[1].matchAll(/'([^']+)'/g)].length:0;

const manifest={
  baseline:'Kareebu+ V7',
  version:'7.0.0',
  contractsVersion:1,
  frozenAt:new Date().toISOString(),
  gitCommit:command(['rev-parse','HEAD']),
  gitBranch:command(['branch','--show-current']),
  routeCount,
  coreFiles:Object.fromEntries(coreFiles.filter((file)=>fs.existsSync(file)).map((file)=>[file,hash(file)])),
  validation:{
    hardGates:['npm run typecheck','npm run validate','git diff --check','expo-doctor','android Metro export'],
    legacyPolicy:'diagnostic-only',
  },
};

fs.writeFileSync('kareebu-baseline.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`PASS — froze Kareebu+ V7 baseline with ${Object.keys(manifest.coreFiles).length} core file hashes and ${routeCount} routes.`);
