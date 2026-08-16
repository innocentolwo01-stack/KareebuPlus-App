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

  if (source.includes('KAREEBU_GLOBAL_FUNCTIONALITY_V617')) {
    console.log('PASS — App.tsx global functionality layer already installed.');
    return;
  }

  source = replaceOnce(
    source,
    "import { Linking, View } from 'react-native';",
    "import { BackHandler, Linking, View } from 'react-native';",
    'React Native BackHandler import',
  );

  source = replaceOnce(
    source,
    "import { KareebuLaunchGate } from './src/onboarding/KareebuLaunchGate';",
    "import { KareebuLaunchGate } from './src/onboarding/KareebuLaunchGate';\n"
      + "import { AppNavigationProvider, UniversalBackButton } from './src/navigation/AppNavigation';",
    'global navigation import',
  );

  const start = source.indexOf('  // One synchronous navigation path.');
  const end = source.indexOf('\n  const data: AppData = useMemo', start);
  if (start < 0 || end < 0) {
    throw new Error('Could not locate the existing root navigation block.');
  }

  const navigationBlock = `  // KAREEBU_GLOBAL_FUNCTIONALITY_V617
  // Every route uses one history model. Existing screen-specific back buttons
  // still work, Android hardware Back uses the same stack, and any screen that
  // forgot to render a back control receives the universal fallback.
  const navigationHistoryRef = useRef<Screen[]>(['splash']);

  const applyScreenLifecycle = useCallback((next: Screen) => {
    if (next === 'whereTo') setCaptainRideStatus('idle');
    if (next === 'ridePayment') setCaptainRideStatus('requested');
    if (next === 'driver') setCaptainRideStatus((current) => current === 'cancelled' || current === 'rejected' ? current : 'accepted');
    if (next === 'onTrip') setCaptainRideStatus('ongoing');
    if (next === 'tripComplete') setCaptainRideStatus('complete');
  }, []);

  const commitScreen = useCallback((next: Screen) => {
    applyScreenLifecycle(next);
    currentScreenRef.current = next;
    setScreen(next);
  }, [applyScreenLifecycle]);

  const navigate = useCallback((next: Screen) => {
    const current = currentScreenRef.current;
    if (current === next) return;

    const history = [...navigationHistoryRef.current];

    // Home is the customer-app root. Going home intentionally starts a fresh
    // navigation chain instead of leaving the user inside an old flow.
    if (next === 'home') {
      navigationHistoryRef.current = ['home'];
      commitScreen(next);
      return;
    }

    // Existing screens already contain many explicit parent navigations
    // (e.g. restaurant -> food). If that destination is the previous history
    // item, treat the action as a real pop rather than pushing a loop.
    if (history.length > 1 && history[history.length - 2] === next) {
      history.pop();
      navigationHistoryRef.current = history;
      commitScreen(next);
      return;
    }

    if (history[history.length - 1] !== current && current !== 'splash') {
      history.push(current);
    }
    history.push(next);
    navigationHistoryRef.current = history.slice(-60);
    commitScreen(next);
  }, [commitScreen]);

  const goBack = useCallback(() => {
    const current = currentScreenRef.current;
    if (current === 'home' || current === 'splash') return;

    const history = [...navigationHistoryRef.current];

    while (history.length > 0 && history[history.length - 1] === current) {
      history.pop();
    }

    const previous = history[history.length - 1] ?? 'home';
    navigationHistoryRef.current = previous === 'home' ? ['home'] : history;
    commitScreen(previous);
  }, [commitScreen]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = currentScreenRef.current;
      if (current === 'home' || current === 'splash') return false;
      goBack();
      return true;
    });

    return () => subscription.remove();
  }, [goBack]);
`;

  source = source.slice(0, start) + navigationBlock + source.slice(end);

  const oldRender = `        {/* KAREEBU_V6_LAUNCH_GATE */}
        <KareebuLaunchGate screen={screen} data={data} actions={actions}>
          {renderScreen(screen, data, actions)}
        </KareebuLaunchGate>`;

  const newRender = `        {/* KAREEBU_V6_LAUNCH_GATE */}
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

  source = replaceOnce(source, oldRender, newRender, 'AppNavigationProvider root wrapper');

  fs.writeFileSync(file, source);
  console.log('PASS — App.tsx now has history, hardware Back and universal route fallback.');
}

function patchComponents() {
  const file = 'src/components.tsx';
  let source = fs.readFileSync(file, 'utf8');

  const sharedNavImport = "import { useAppNavigation, useRegisterBackControl } from './navigation/AppNavigation';";
  if (!source.includes(sharedNavImport)) {
    source = replaceOnce(
      source,
      "import { assets } from './assets';",
      "import { assets } from './assets';\n" + sharedNavImport,
      'shared Header navigation hooks',
    );
  }

  const headerStart = source.indexOf('export function Header({');
  const headerEnd = source.indexOf('\nexport function PrimaryButton(', headerStart);
  if (headerStart < 0 || headerEnd < 0) {
    throw new Error('Could not isolate shared Header component.');
  }

  let header = source.slice(headerStart, headerEnd);

  if (!header.includes('const navigation = useAppNavigation();')) {
    header = replaceOnce(
      header,
      "}) {\n  return (",
      "}) {\n  const navigation = useAppNavigation();\n"
        + "  const resolvedBack = onBack ?? (navigation?.canGoBack ? navigation.goBack : undefined);\n"
        + "  useRegisterBackControl(Boolean(resolvedBack));\n"
        + "  return (",
      'Header automatic back resolver',
    );
  }

  header = header.replace('{onBack ? (', '{resolvedBack ? (');
  header = header.replace('onPress={onBack}', 'onPress={resolvedBack}');

  source = source.slice(0, headerStart) + header + source.slice(headerEnd);
  fs.writeFileSync(file, source);
  console.log('PASS — shared Header automatically supplies/registers Back on routed pages.');
}

function patchScreens() {
  const file = 'src/screens.tsx';
  if (!fs.existsSync(file)) return;
  let source = fs.readFileSync(file, 'utf8');

  const screenNavImport = "import { useRegisterBackControl } from './navigation/AppNavigation';";
  if (!source.includes(screenNavImport)) {
    source = replaceOnce(
      source,
      "import { COLORS, FONT, SHADOW, TYPE } from './theme';",
      "import { COLORS, FONT, SHADOW, TYPE } from './theme';\n" + screenNavImport,
      'custom screen navigation hook import',
    );
  }

  const functions = ['StorefrontScreen', 'RestaurantScreen'];
  for (const name of functions) {
    const signature = `export function ${name}({ data, actions }: { data: AppData; actions: AppActions }) {`;
    const patched = `${signature}\n  useRegisterBackControl(true);`;
    if (source.includes(signature) && !source.includes(patched)) {
      source = source.replace(signature, patched);
    }
  }

  fs.writeFileSync(file, source);
  console.log('PASS — full-bleed merchant pages register their existing custom Back controls.');
}

function patchRides() {
  const file = 'src/ride/kareebuRidesHome.tsx';
  if (!fs.existsSync(file)) return;
  let source = fs.readFileSync(file, 'utf8');

  const ridesNavImport = "import { useRegisterBackControl } from '../navigation/AppNavigation';";
  if (!source.includes(ridesNavImport)) {
    source = replaceOnce(
      source,
      "import type { MobilityActions, MobilityData } from './mobilityScreens';",
      "import type { MobilityActions, MobilityData } from './mobilityScreens';\n" + ridesNavImport,
      'Rides custom Header navigation hook import',
    );
  }

  const signature = `function BackMenuHeader({
  onBack,
  title,
  light = true,
  onMenu,`;
  const headerBody = `}: {
  onBack: () => void;
  title?: string;
  light?: boolean;
  onMenu?: () => void;
}) {
  return (`;
  const patchedBody = `}: {
  onBack: () => void;
  title?: string;
  light?: boolean;
  onMenu?: () => void;
}) {
  useRegisterBackControl(true);
  return (`;

  if (source.includes(signature) && source.includes(headerBody) && !source.includes(patchedBody)) {
    source = source.replace(headerBody, patchedBody);
  }

  // Known Rides dead-tap cleanup. These controls existed visually but either
  // had no onPress or did not lead anywhere.
  source = source.replace(
    `<Pressable style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
            <Text style={styles.linkText}>See all</Text>`,
    `<Pressable onPress={() => actions.go('rideOffers')} style={({ pressed }) => [styles.linkRow, pressed && styles.pressed]}>
            <Text style={styles.linkText}>See all</Text>`,
  );

  source = source.replace(
    `<Pressable style={({ pressed }) => [styles.secondaryCta, pressed && styles.pressed]}>
        <Text style={styles.secondaryCtaText}>Add by phone number</Text>`,
    `<Pressable onPress={() => actions.go('whereTo')} style={({ pressed }) => [styles.secondaryCta, pressed && styles.pressed]}>
        <Text style={styles.secondaryCtaText}>Add by phone number</Text>`,
  );

  source = source.replace(
    `<Pressable style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}>
              <Feather name="sliders" size={22} color="#44484C" />`,
    `<Pressable onPress={() => actions.go('whereTo')} style={({ pressed }) => [styles.adjustButton, pressed && styles.pressed]}>
              <Feather name="sliders" size={22} color="#44484C" />`,
  );

  fs.writeFileSync(file, source);
  console.log('PASS — Rides custom Back and known dead controls are functional.');
}

patchApp();
patchComponents();
patchScreens();
patchRides();
