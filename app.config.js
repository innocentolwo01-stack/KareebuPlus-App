const fs = require('fs');
const path = require('path');

const MAPS_KEY_NAME = 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY';

function readDotEnvValue(filePath, key) {
  if (!fs.existsSync(filePath)) return undefined;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    let line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();

    const separator = line.indexOf('=');
    if (separator < 0) continue;
    if (line.slice(0, separator).trim() !== key) continue;

    let value = line.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }

    return value || undefined;
  }

  return undefined;
}

function loadMapsKeyFromDotEnv() {
  if (process.env[MAPS_KEY_NAME]) return process.env[MAPS_KEY_NAME];

  const mode = process.env.NODE_ENV;
  const candidates = [
    mode ? `.env.${mode}.local` : null,
    '.env.local',
    mode ? `.env.${mode}` : null,
    '.env',
  ].filter(Boolean);

  for (const name of candidates) {
    const value = readDotEnvValue(
      path.join(process.cwd(), name),
      MAPS_KEY_NAME
    );
    if (value) {
      process.env[MAPS_KEY_NAME] = value;
      return value;
    }
  }

  return undefined;
}

module.exports = ({ config }) => {
  const mapsKey = loadMapsKeyFromDotEnv();

  if (!mapsKey) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Add it to the project .env file.'
    );
  }

  const pluginName = (plugin) =>
    Array.isArray(plugin) ? plugin[0] : plugin;

  const plugins = (config.plugins || []).filter(
    (plugin) =>
      pluginName(plugin) !== 'react-native-maps' &&
      pluginName(plugin) !== 'expo-location'
  );

  plugins.push([
    'expo-location',
    {
      locationWhenInUsePermission:
        'Allow Kareebu+ to use your location for nearby services, deliveries and accurate ride pickup.',
    },
  ]);

  plugins.push([
    'react-native-maps',
    {
      androidGoogleMapsApiKey: mapsKey,
    },
  ]);

  return {
    ...config,
    version: '2.8.1',

    android: {
      ...(config.android || {}),
      config: {
        ...((config.android && config.android.config) || {}),
        googleMaps: {
          apiKey: mapsKey,
        },
      },
    },

    plugins,
  };
};
