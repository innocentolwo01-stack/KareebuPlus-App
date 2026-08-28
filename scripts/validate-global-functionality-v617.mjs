import fs from 'node:fs';
import path from 'node:path';

const app = fs.readFileSync('App.tsx','utf8');
const components = fs.readFileSync('src/components.tsx','utf8');
const navigation = fs.readFileSync('src/navigation/AppNavigation.tsx','utf8');
const screens = fs.existsSync('src/screens.tsx') ? fs.readFileSync('src/screens.tsx','utf8') : '';
const rides = fs.existsSync('src/ride/kareebuRidesHome.tsx') ? fs.readFileSync('src/ride/kareebuRidesHome.tsx','utf8') : '';
const boda = fs.existsSync('src/ride/kareebuBodaHome.tsx') ? fs.readFileSync('src/ride/kareebuBodaHome.tsx','utf8') : '';

let passed=0;
const checks=[];
function ok(condition,label){
  checks.push({condition,label});
  if(condition)passed++;
  console.log(`${condition?'PASS':'FAIL'} — ${label}`);
}

ok(app.includes('KAREEBU_GLOBAL_FUNCTIONALITY_V617'), 'root app uses the V6.17 navigation history layer');
ok(app.includes('navigationHistoryRef'), 'root app stores route history');
ok(app.includes("BackHandler.addEventListener('hardwareBackPress'"), 'Android hardware Back uses app navigation');
ok(app.includes('const goBack = useCallback'), 'root app exposes a true history pop');
ok(app.includes("history[history.length - 2] === next"), 'explicit parent buttons collapse history instead of creating loops');
ok(app.includes("navigationHistoryRef.current = ['home']"), 'home resets stale navigation history');
ok(app.includes('<AppNavigationProvider'), 'all rendered routes are inside navigation context');
ok(app.includes('<UniversalBackButton />'), 'all routes have a universal Back fallback');
ok(app.includes("canGoBack={screen !== 'home' && screen !== 'splash'}"), 'root/launch screens are excluded from forced Back');

ok(navigation.includes('registeredBackControls'), 'custom/shared Back controls suppress duplicate fallback controls');
ok(navigation.includes('useSafeAreaInsets'), 'universal Back respects the safe area');
ok(navigation.includes('accessibilityLabel="Go back"'), 'universal Back is accessible');
ok(navigation.includes('zIndex: 9999'), 'universal fallback stays tappable above orphaned screen chrome');

ok(components.includes('useAppNavigation'), 'shared Header reads global navigation');
ok(components.includes('const resolvedBack = onBack ??'), 'shared Header auto-supplies Back when screen forgot one');
ok(components.includes('useRegisterBackControl(Boolean(resolvedBack))'), 'shared Header suppresses the fallback once it owns Back');
ok(components.includes('onPress={resolvedBack}'), 'shared Header Back is wired to a real action');

ok(!screens || screens.includes('useRegisterBackControl(true);'), 'full-bleed custom merchant pages register custom Back controls');
ok(!rides || rides.includes('useRegisterBackControl(true);'), 'Rides custom header registers its Back control');
ok(!boda || boda.includes('useRegisterBackControl(true);'), 'Boda custom header registers its Back control');

ok(!rides || rides.includes("onPress={() => actions.go('rideOffers')}"), 'Rides See all offer action is functional');
ok(!rides || rides.includes("Add by phone number"), 'Rides friend action remains present');
ok(!rides || rides.includes("onPress={() => actions.go('whereTo')}"), 'Rides pickup/friend utility controls route into a real flow');

ok(!boda || boda.includes("actions.selectMode('BODA')"), 'Boda booking locks Boda mode');
ok(!boda || boda.includes("actions.go('rideSafety')"), 'Boda Safety action is functional');
ok(!boda || boda.includes("actions.go('rideHistory')"), 'Boda history action is functional');
ok(!boda || boda.includes("actions.go('rideSchedule')"), 'Boda schedule action is functional');

ok(!navigation.includes('StyleSheet.absoluteFillObject'), 'navigation fallback avoids unsupported StyleSheet.absoluteFillObject');
ok(!boda || !boda.includes('StyleSheet.absoluteFillObject'), 'Boda avoids unsupported StyleSheet.absoluteFillObject');

// Route-level guarantee: renderScreen still enumerates the Screen switch, while
// the root UniversalBackButton wraps renderScreen itself. This means a newly
// added route inherits Back without requiring one-off screen code.
ok(app.includes('{renderScreen(screen, data, actions)}'), 'route renderer remains inside the universal navigation wrapper');

console.log(`Kareebu+ global functionality/back-navigation checks complete: ${passed}/${checks.length}.`);
if(checks.some((item)=>!item.condition))process.exit(1);
