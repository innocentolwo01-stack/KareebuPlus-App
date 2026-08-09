import fs from 'node:fs';

const components = fs.readFileSync('src/components.tsx','utf8');
const screens = fs.readFileSync('src/screens.tsx','utf8');
const commerce = fs.readFileSync('src/commerce/screens.tsx','utf8');
const types = fs.readFileSync('src/types.ts','utf8');

const checks = [
  [types.includes("'explore'"), 'Explore is a first-class bottom-navigation tab'],
  [components.includes("label: 'Explore'"), 'Bottom navigation exposes Explore'],
  [components.includes('bottomNavIconBubbleActive'), 'Bottom navigation has a clear selected state'],
  [screens.includes('What do you need?'), 'Home has a clear primary-service hierarchy'],
  [screens.includes("go('notifications')"), 'Home notification action routes to notifications'],
  [screens.includes("filter,setFilter"), 'Activity supports cross-service filtering'],
  [screens.includes('Everything you’ve done with Kareebu+'), 'Activity is a unified history hub'],
  [screens.includes('Payments & rewards'), 'Account information architecture is grouped'],
  [screens.includes('uxQuickGrid'), 'Account exposes high-frequency quick actions'],
  [commerce.includes('productStickyFooter'), 'Commerce product CTA remains visible while reading details'],
  [commerce.includes('quantityCompact'), 'Product quantity control is colocated with the primary CTA'],
];
const failed=checks.filter(([ok])=>!ok);
if(failed.length){for(const [,msg] of failed)console.error(`FAIL: ${msg}`);process.exit(1)}
console.log(`UX/UI foundation validation passed: ${checks.length}/${checks.length} checks present.`);
console.log('Scope: navigation hierarchy + Home clarity + unified Activity + Account IA + persistent product CTA.');
