import fs from 'node:fs';

const file='App.tsx';
let source=fs.readFileSync(file,'utf8');

if(!source.includes('KAREEBU_PERSISTENT_NAVIGATION_V618')){
  throw new Error('Persistent root navigation baseline marker is missing.');
}

if(!source.includes('electronics|groceries|homecare|fix')){
  const needle='|dine/.test(key)';
  if(!source.includes(needle)){
    throw new Error('Could not locate persistent Explore route classifier.');
  }
  source=source.replace(
    needle,
    '|dine|electronics|groceries|homecare|fix/.test(key)'
  );
}

fs.writeFileSync(file,source);
console.log('PASS — Groceries / Electronics / Home & Care / Fix now activate Explore in persistent navigation.');
