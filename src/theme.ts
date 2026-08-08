import { Platform } from 'react-native';

// Kareebu+ core palette.
// The product shell is intentionally limited to black, yellow and red.
// Green is reserved for success/live/verified states only. Merchant logos and
// photography can retain their own colours without changing the app chrome.
export const COLORS = {
  black: '#0B0B0D',
  blackSoft: '#19191B',
  red: '#F23832',
  redDark: '#D92E29',
  yellow: '#FFC928',
  yellowSoft: '#FFF3B0',
  green: '#19A85A',
  greenSoft: '#EDF8F1',
  white: '#FFFFFF',
  surface: '#F6F3EC',
  surfaceStrong: '#EFEAE0',
  line: '#E7E5E1',
  lineDark: '#D6D1C7',
  muted: '#73777F',
  mutedLight: '#A7A5A1',

  // Compatibility aliases for older components. These deliberately map back
  // into the Kareebu+ brand palette rather than introducing new UI colours.
  orange: '#F23832',
  orangeSoft: '#FFF0EE',
  blue: '#0B0B0D',
  blueSoft: '#F6F3EC',
  pinkSoft: '#FFF0EE',
};

export const FONT = {
  regular: Platform.select({ ios: 'Avenir Next', android: 'sans-serif' }),
  medium: Platform.select({ ios: 'Avenir Next Medium', android: 'sans-serif-medium' }),
  bold: Platform.select({ ios: 'Avenir Next', android: 'sans-serif' }),
};

// One product-wide typography scale. Marketing/brand moments can use display,
// but functional screens should stay inside these roles.
export const TYPE = {
  display: { fontFamily: FONT.bold, fontSize: 36, lineHeight: 41, fontWeight: '900' as const, letterSpacing: -0.8 },
  screenTitle: { fontFamily: FONT.bold, fontSize: 22, lineHeight: 27, fontWeight: '900' as const, letterSpacing: -0.4 },
  navTitle: { fontFamily: FONT.bold, fontSize: 20, lineHeight: 25, fontWeight: '900' as const, letterSpacing: -0.3 },
  sectionTitle: { fontFamily: FONT.bold, fontSize: 18, lineHeight: 23, fontWeight: '900' as const, letterSpacing: -0.22 },
  cardTitle: { fontFamily: FONT.bold, fontSize: 15, lineHeight: 20, fontWeight: '800' as const },
  body: { fontFamily: FONT.regular, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: FONT.medium, fontSize: 15, lineHeight: 21, fontWeight: '700' as const },
  small: { fontFamily: FONT.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: FONT.regular, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: FONT.medium, fontSize: 12, lineHeight: 16, fontWeight: '700' as const },
  button: { fontFamily: FONT.bold, fontSize: 16, lineHeight: 20, fontWeight: '800' as const },
  action: { fontFamily: FONT.bold, fontSize: 14, lineHeight: 18, fontWeight: '800' as const },
};

export const RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

export const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.055,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  android: { elevation: 1.5 },
  default: {},
});
