import { Platform } from 'react-native';

// Kareebu+ global product palette.
//
// Yellow + white are the customer-app chrome.
// Charcoal is the principal text / high-contrast colour.
// Red is reserved for offers and attention.
// Green is reserved for success, live, verified and ratings.
// Merchant logos and photography retain their authentic brand colours.
export const COLORS = {
  black: '#171717',
  blackSoft: '#232323',
  red: '#F23832',
  redDark: '#D92E29',
  yellow: '#FFC400',
  yellowDeep: '#E8AB00',
  yellowSoft: '#FFF4BF',
  yellowWash: '#FFFAE9',
  green: '#19A85A',
  greenSoft: '#EDF8F1',
  white: '#FFFFFF',
  surface: '#FFFDF8',
  surfaceStrong: '#F4F1EA',
  line: '#ECE8DF',
  lineDark: '#D6D1C7',
  muted: '#73777F',
  mutedLight: '#A7A5A1',

  // Compatibility aliases deliberately map back to Kareebu brand roles.
  orange: '#F23832',
  orangeSoft: '#FFF0EE',
  blue: '#171717',
  blueSoft: '#F4F1EA',
  pinkSoft: '#FFF0EE',
};

export const FONT = {
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }),
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};

// Functional typography is intentionally compact. Only launch/marketing artwork
// should exceed the display role.
export const TYPE = {
  display: { fontFamily: FONT.bold, fontSize: 30, lineHeight: 35, fontWeight: '900' as const, letterSpacing: -0.7 },
  screenTitle: { fontFamily: FONT.bold, fontSize: 22, lineHeight: 27, fontWeight: '900' as const, letterSpacing: -0.45 },
  navTitle: { fontFamily: FONT.bold, fontSize: 18, lineHeight: 22, fontWeight: '900' as const, letterSpacing: -0.25 },
  sectionTitle: { fontFamily: FONT.bold, fontSize: 18, lineHeight: 22, fontWeight: '900' as const, letterSpacing: -0.25 },
  cardTitle: { fontFamily: FONT.bold, fontSize: 15, lineHeight: 19, fontWeight: '800' as const },
  body: { fontFamily: FONT.regular, fontSize: 14, lineHeight: 19 },
  bodyStrong: { fontFamily: FONT.medium, fontSize: 14, lineHeight: 19, fontWeight: '700' as const },
  small: { fontFamily: FONT.regular, fontSize: 12, lineHeight: 16 },
  caption: { fontFamily: FONT.regular, fontSize: 11, lineHeight: 14 },
  label: { fontFamily: FONT.medium, fontSize: 11, lineHeight: 14, fontWeight: '700' as const },
  button: { fontFamily: FONT.bold, fontSize: 15, lineHeight: 18, fontWeight: '900' as const },
  action: { fontFamily: FONT.bold, fontSize: 13, lineHeight: 16, fontWeight: '800' as const },
};

export const SPACE = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 14,
  xl: 16,
  xxl: 22,
};

export const CONTROL = {
  header: 48,
  iconButton: 36,
  field: 46,
  button: 48,
  chip: 34,
  row: 56,
  bottomNav: 64,
};

export const LAYOUT = {
  screenGutter: 14,
  sectionGap: 10,
  cardGap: 8,
  contentBottom: 22,
  maxReadableWidth: 520,
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 20,
};

export const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 9,
  },
  android: { elevation: 1.5 },
  default: {},
});
