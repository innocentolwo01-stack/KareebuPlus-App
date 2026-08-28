import fs from 'node:fs';

const app = fs.readFileSync('App.tsx','utf8');
const components = fs.readFileSync('src/components.tsx','utf8');
const navigation = fs.readFileSync('src/navigation/AppNavigation.tsx','utf8');

let passed=0;
const checks=[];
function ok(condition,label){
  checks.push({condition,label});
  if(condition)passed++;
  console.log(`${condition?'PASS':'FAIL'} — ${label}`);
}

ok(app.includes('KAREEBU_PERSISTENT_NAVIGATION_V618'), 'root app owns persistent navigation');
ok(app.includes("import { BottomNav } from './src/components';"), 'root imports the shared branded BottomNav');
ok(app.includes('BottomTab, RideId, Screen'), 'root imports BottomTab for active-state routing');
ok(app.includes('function persistentTabForScreen(screen: Screen): BottomTab'), 'every route resolves to a primary nav tab');
ok(app.includes("if (key === 'home') return 'home'"), 'Home route maps to Home tab');
ok(app.includes("return 'wallet'"), 'payment/wallet routes map to Wallet');
ok(app.includes("return 'account'"), 'settings/account routes map to Account');
ok(app.includes("return 'activity'"), 'orders/history/tracking routes map to Activity');
ok(app.includes("return 'explore'"), 'services/discovery routes map to Explore');

ok(app.includes("screen !== 'splash' ? ("), 'persistent nav is shown on every post-launch page');
ok(app.includes('active={persistentTabForScreen(screen)}'), 'bottom nav active state follows the current page');
ok(app.includes('go={navigate}'), 'bottom navigation uses the real app navigation function');
ok(app.includes('persistent'), 'root marks its BottomNav as the persistent instance');
ok(app.includes('{renderScreen(screen, data, actions)}'), 'all routed pages remain inside the persistent shell');

ok(components.includes('persistent = false'), 'BottomNav distinguishes root from legacy screen-local instances');
ok(components.includes('persistent?: boolean'), 'persistent mode is typed');
ok(components.includes('if (!persistent) return null;'), 'duplicate per-screen bottom nav bars are suppressed');
ok(components.includes("home: { label: 'Home'"), 'Home remains in the navigation bar');
ok(components.includes("explore: { label: 'Explore'"), 'Explore remains in the navigation bar');
ok(components.includes("activity: { label: 'Activity'"), 'Activity remains in the navigation bar');
ok(components.includes("wallet: { label: 'Wallet'"), 'Wallet remains in the navigation bar');
ok(components.includes("account: { label: 'Account'"), 'Account remains in the navigation bar');

ok(app.includes('<UniversalBackButton />'), 'Back fallback remains available alongside persistent bottom navigation');
ok(app.includes("BackHandler.addEventListener('hardwareBackPress'"), 'Android hardware Back remains functional');
ok(components.includes('const resolvedBack = onBack ??'), 'shared Header automatic Back remains functional');
ok(navigation.includes('useSafeAreaInsets'), 'universal Back still respects device safe area');
ok(!navigation.includes('StyleSheet.absoluteFillObject'), 'navigation remains compatible with project React Native typings');

// No special-case list may hide navigation on checkout, tracking, ride, food,
// restaurant, shop, wallet, settings or other routed pages. Splash is the one
// launch-state exception.
ok(!/ridePayment.*BottomNav/.test(app), 'ride/payment pages are not specially excluded');
ok(!/restaurant.*BottomNav/.test(app), 'restaurant pages are not specially excluded');
ok(!/storefront.*BottomNav/.test(app), 'store pages are not specially excluded');

console.log(`Kareebu+ persistent navigation checks complete: ${passed}/${checks.length}.`);
if(checks.some((item)=>!item.condition))process.exit(1);
