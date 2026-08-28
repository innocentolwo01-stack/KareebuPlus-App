import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const failures = [];
const pass = (label) => console.log(`PASS — ${label}`);
const fail = (label) => { failures.push(label); console.error(`FAIL — ${label}`); };
const expectFile = (p) => exists(p) ? pass(`file ${p}`) : fail(`missing file ${p}`);
const expectText = (p, needle, label) => read(p).includes(needle) ? pass(label) : fail(`${label} (${needle})`);

console.log('============================================================');
console.log(' KAREEBU+ CUSTOMER PARITY V2 VALIDATOR');
console.log('============================================================');

[
  'src/parity/customerParity.tsx',
  'src/routing/kareebuDeepLinks.ts',
  'docs/parity/KAREEBU_CUSTOMER_PARITY_V2.md',
  'docs/parity/donor-route-coverage-v2.json',
  'src/food/discovery/surfaces.tsx',
].forEach(expectFile);

const screens = read('src/types.ts');
const routeMatches = [...screens.matchAll(/\|\s*'([^']+)'/g)].map((m) => m[1]);
const screenSet = new Set(routeMatches);
const expectedRoutes = [
  'foodSearch','paySend','payRequest','payTopUp','payBills','payRecharge','payGiftCards',
  'payRemittance','payTransactions','payManageAccounts','payKyc','supportInbox','supportIssue',
  'plusSavings','plusManage','exploreHub','exploreLocation','stories','foodSchedule','rideBusiness',
  'rideSettings','donations','orderAnything','accountPrivacy','shopHelp'
];
for (const route of expectedRoutes) {
  screenSet.has(route) ? pass(`screen route ${route}`) : fail(`missing screen route ${route}`);
}

const sourceFiles = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(ent.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'src'));

const unknownRoutes = [];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/(?:actions|a|nav|customerParityActions)\.go\(\s*'([^']+)'/g)) {
    if (!screenSet.has(m[1])) unknownRoutes.push(`${path.relative(root, file)} -> ${m[1]}`);
  }
}
unknownRoutes.length ? fail(`unknown literal routes: ${unknownRoutes.join(', ')}`) : pass('all literal navigation routes resolve');

expectText('src/theme.ts', 'export const SPACE', 'compact spacing tokens');
expectText('src/theme.ts', 'screenGutter: 14', '14px compact screen gutter');
expectText('src/components.tsx', 'height: 48', 'compact shared header sizing');
expectText('src/screens.tsx', 'function HomeStoriesRail', 'compact home stories rail');
expectText('src/screens.tsx', "case 'paySend'", 'Pay flow wired to renderer');
expectText('src/screens.tsx', "case 'supportInbox'", 'Support flow wired to renderer');
expectText('src/screens.tsx', "case 'foodSearch'", 'Food search route wired to renderer');
expectText('src/ride/kareebuRidesHome.tsx', "actions.go('whereTo')", 'Rides donor shell hands off to real where-to flow');
expectText('src/food/discovery/surfaces.tsx', 'FoodSearchSurface', 'Food restaurant/dish search surface');
expectText('src/food/discovery/surfaces.tsx', 'FoodFiltersSurface', 'Food filter/sort surface');
expectText('src/screens.tsx', 'menuQuery', 'restaurant menu search state');
expectText('App.tsx', 'recordWalletTransaction', 'wallet transaction persistence');
expectText('App.tsx', 'createSupportTicket', 'support ticket persistence');
expectText('App.tsx', 'resolveKareebuDeepLink', 'Kareebu deep-link resolver active');

// Static require() path integrity.
const missingAssets = [];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/require\(\s*['\"]([^'\"]+)['\"]\s*\)/g)) {
    if (!m[1].startsWith('.')) continue;
    const resolved = path.resolve(path.dirname(file), m[1]);
    if (!fs.existsSync(resolved)) missingAssets.push(`${path.relative(root,file)} -> ${m[1]}`);
  }
}
missingAssets.length ? fail(`unresolved static assets: ${missingAssets.join(', ')}`) : pass('all static require() assets resolve');

const forbiddenRuntime = [];
for (const file of sourceFiles) {
  const rel = path.relative(root, file).replaceAll('\\','/');
  if (rel.startsWith('src/reconstruction/')) continue;
  const text = fs.readFileSync(file, 'utf8');
  const stripped = text.replace(/^\s*\/\/.*$/gm, '');
  if (/careem:\/\//i.test(stripped) || /\.careem\.com/i.test(stripped)) forbiddenRuntime.push(rel);
}
forbiddenRuntime.length ? fail(`Careem runtime endpoints found outside donor inventory: ${forbiddenRuntime.join(', ')}`) : pass('runtime has no Careem private endpoints');

const coverage = JSON.parse(read('docs/parity/donor-route-coverage-v2.json'));
coverage.donor_deep_link_count >= 250 ? pass(`donor route inventory (${coverage.donor_deep_link_count})`) : fail('donor route inventory unexpectedly small');

if (failures.length) {
  console.error(`\n${failures.length} parity check(s) failed.`);
  process.exit(1);
}
console.log('\nPASS — Kareebu+ Customer Parity V2 structural checks complete.');
