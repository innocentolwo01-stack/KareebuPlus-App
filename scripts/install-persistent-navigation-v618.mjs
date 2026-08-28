import fs from 'node:fs';

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  if (!source.includes(before)) {
    throw new Error(`Could not locate ${label}.`);
  }
  return source.replace(before, after);
}

function patchApp() {
  const file = 'App.tsx';
  let source = fs.readFileSync(file, 'utf8');

  if (source.includes('KAREEBU_PERSISTENT_NAVIGATION_V618')) {
    console.log('PASS — App.tsx persistent navigation already installed.');
    return;
  }

  source = replaceOnce(
    source,
    "import { AppActions, AppData, renderScreen } from './src/screens';",
    "import { AppActions, AppData, renderScreen } from './src/screens';\n"
      + "import { BottomNav } from './src/components';",
    'BottomNav root import',
  );

  source = replaceOnce(
    source,
    "import { RideId, Screen, SupportTicket, WalletTransaction } from './src/types';",
    "import { BottomTab, RideId, Screen, SupportTicket, WalletTransaction } from './src/types';",
    'BottomTab root type import',
  );

  const exportAnchor = '\nexport default function App() {';
  if (!source.includes(exportAnchor)) {
    throw new Error('Could not locate App component export.');
  }

  const helper = `
// KAREEBU_PERSISTENT_NAVIGATION_V618
// One persistent customer navigation bar is owned by the app root. Individual
// pages no longer decide whether Home / Explore / Activity / Wallet / Account
// is visible.
function persistentTabForScreen(screen: Screen): BottomTab {
  const key = String(screen).toLowerCase();

  if (key === 'home') return 'home';

  if (
    /wallet|payment|pay|qr|transaction|topup|top-up|recharge|remittance|giftcard|gift-card|bill/.test(key)
  ) {
    return 'wallet';
  }

  if (
    /account|setting|profile|support|favourite|favorite|membership|subscription|address|language|legal|privacy|refund|review|notification|message|chat|interest|signin|signup|verification|password/.test(key)
  ) {
    return 'account';
  }

  if (
    /activity|history|order|receipt|tracking|track|tripcomplete|trip-complete|ratetrip|rate-trip|booking|success/.test(key)
  ) {
    return 'activity';
  }

  if (
    /explore|food|restaurant|shop|store|grocery|pharmacy|brand|categor|offer|ride|boda|mobility|whereto|where-to|choose|captain|school|work|rental|service|parcel|search|flash|campaign|reel|story|dine/.test(key)
  ) {
    return 'explore';
  }

  return 'home';
}
`;

  source = source.replace(exportAnchor, `${helper}${exportAnchor}`);

  const oldRoot = `        {/* KAREEBU_V6_LAUNCH_GATE */}
        <AppNavigationProvider
          screen={screen}
          canGoBack={screen !== 'home' && screen !== 'splash'}
          goBack={goBack}
          goHome={() => navigate('home')}
        >
          <KareebuLaunchGate screen={screen} data={data} actions={actions}>
            {renderScreen(screen, data, actions)}
          </KareebuLaunchGate>
          <UniversalBackButton />
        </AppNavigationProvider>`;

  const newRoot = `        {/* KAREEBU_V6_LAUNCH_GATE */}
        <AppNavigationProvider
          screen={screen}
          canGoBack={screen !== 'home' && screen !== 'splash'}
          goBack={goBack}
          goHome={() => navigate('home')}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <KareebuLaunchGate screen={screen} data={data} actions={actions}>
                {renderScreen(screen, data, actions)}
              </KareebuLaunchGate>
              <UniversalBackButton />
            </View>

            {screen !== 'splash' ? (
              <BottomNav
                active={persistentTabForScreen(screen)}
                go={navigate}
                persistent
              />
            ) : null}
          </View>
        </AppNavigationProvider>`;

  source = replaceOnce(source, oldRoot, newRoot, 'persistent root BottomNav shell');
  fs.writeFileSync(file, source);
  console.log('PASS — root app now owns persistent Home/Explore/Activity/Wallet/Account navigation.');
}

function patchBottomNav() {
  const file = 'src/components.tsx';
  let source = fs.readFileSync(file, 'utf8');

  const oldSignature =
    "export function BottomNav({ active, go }: { active: BottomTab; go: (screen: Screen) => void }) {\n  return (";

  const newSignature =
    "export function BottomNav({ active, go, persistent = false }: { active: BottomTab; go: (screen: Screen) => void; persistent?: boolean }) {\n"
      + "  // V6.18: screen-local BottomNav instances are suppressed because the\n"
      + "  // app root now owns one navigation bar for every customer route.\n"
      + "  if (!persistent) return null;\n"
      + "  return (";

  source = replaceOnce(source, oldSignature, newSignature, 'BottomNav persistent-shell signature');

  fs.writeFileSync(file, source);
  console.log('PASS — legacy per-screen BottomNav instances can no longer create duplicate navigation bars.');
}

patchApp();
patchBottomNav();
