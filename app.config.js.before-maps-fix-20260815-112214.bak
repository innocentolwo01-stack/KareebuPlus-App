module.exports = ({ config }) => {
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const plugins = [
    ...(config.plugins || []),
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow Kareebu+ to use your location for nearby services, deliveries and accurate ride pickup.',
      },
    ],
  ];

  if (mapsKey) {
    plugins.push([
      'react-native-maps',
      {
        androidGoogleMapsApiKey: mapsKey,
      },
    ]);
  }

  return {
    ...config,
    version: '2.8.1',
    plugins,
  };
};
