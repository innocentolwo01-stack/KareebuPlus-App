module.exports = ({ config }) => {
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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
