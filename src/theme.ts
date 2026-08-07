import { Platform } from 'react-native';

export const COLORS = {
  black: '#101113',
  blackSoft: '#1A1B1E',
  red: '#F0181E',
  redDark: '#D70D13',
  yellow: '#FFC515',
  yellowSoft: '#FFF5CC',
  green: '#239B45',
  white: '#FFFFFF',
  surface: '#F8F8F9',
  surfaceStrong: '#F1F2F4',
  line: '#E4E5E8',
  lineDark: '#D4D6DA',
  muted: '#696D75',
  mutedLight: '#979BA3',
};

export const FONT = {
  regular: Platform.select({ ios: 'Avenir Next', android: 'sans-serif' }),
  medium: Platform.select({ ios: 'Avenir Next Medium', android: 'sans-serif-medium' }),
  bold: Platform.select({ ios: 'Avenir Next', android: 'sans-serif' }),
};

export const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 16,
  },
  android: { elevation: 3 },
  default: {},
});
