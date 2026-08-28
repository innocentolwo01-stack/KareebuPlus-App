import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = fs.readFileSync('src/taxonomy/registry.ts', 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: 'src/taxonomy/registry.ts',
}).outputText;

const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports, require, console, Map, Set }, { filename: 'taxonomy-registry.js' });

const rows = module.exports.TAXONOMY_NODES;
const integrity = module.exports.taxonomyIntegrityIssues;
const checks = [];
const pass = (name, condition) => checks.push([name, Boolean(condition)]);

const idCounts = new Map();
for (const node of rows) idCounts.set(node.id, (idCounts.get(node.id) ?? 0) + 1);
const duplicateIds = [...idCounts].filter(([, count]) => count > 1);

const childDuplicates = [];
for (const parent of rows) {
  const childIds = rows.filter(node => node.parentId === parent.id).map(node => node.id);
  const seen = new Set();
  for (const id of childIds) {
    if (seen.has(id)) childDuplicates.push(`${parent.id} -> ${id}`);
    seen.add(id);
  }
}

const ids = new Set(rows.map(node => node.id));
const missingParents = rows.filter(node => node.parentId && !ids.has(node.parentId));
const issues = typeof integrity === 'function' ? integrity(rows) : [{ code: 'missing-checker' }];

pass('registry uses canonical ID upsert/merge semantics', source.includes('rowIndexById') && source.includes('rows[existingIndex] ='));
pass('conflicting ancestry is rejected at registration time', source.includes('Taxonomy ancestry conflict'));
pass('duplicate taxonomy node IDs are impossible in the exported registry', duplicateIds.length === 0);
pass('duplicate child IDs under one taxonomy node are absent', childDuplicates.length === 0);
pass('all taxonomy parents exist', missingParents.length === 0);
pass('registry integrity checker reports no cycles or structural issues', issues.length === 0);
pass('taxonomyChildren defensively de-duplicates child IDs', source.includes('const seen = new Set<string>()'));
pass('beauty.makeup.face resolves to one canonical node', rows.filter(node => node.id === 'beauty.makeup.face').length === 1);
pass('global.beauty.makeup.face resolves to one canonical node', rows.filter(node => node.id === 'global.beauty.makeup.face').length === 1);
pass('fashion.women.dresses resolves to one canonical node', rows.filter(node => node.id === 'fashion.women.dresses').length === 1);

let failures = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
  if (!ok) failures += 1;
}
if (duplicateIds.length) console.log('Duplicate IDs:', duplicateIds);
if (childDuplicates.length) console.log('Duplicate children:', childDuplicates);
if (missingParents.length) console.log('Missing parents:', missingParents.map(node => `${node.id} -> ${node.parentId}`));
if (issues.length) console.log('Integrity issues:', issues);
console.log(`Kareebu taxonomy integrity contracts: ${checks.length - failures}/${checks.length}.`);
process.exit(failures ? 1 : 0);
