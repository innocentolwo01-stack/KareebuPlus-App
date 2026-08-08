# Kareebu+ Premium v2.3.1

Maintenance fix for the v2.3 marketplace/maps update.

- Replaced unsupported `StyleSheet.absoluteFillObject` references with `StyleSheet.absoluteFill` for React Native 0.86 typings.
- Removed obsolete Expo app-config fields rejected by SDK 57 Doctor.
- Changed `app.config.js` to extend the normalized static `app.json` config through `({ config })`, so dynamic Google Maps/location configuration resolves correctly.
- Added `/android` and `/ios` to `.gitignore` so the project can use Expo Continuous Native Generation cleanly with local `prebuild --clean` / `run:android` workflows.
- Version bumped to 2.3.1.

After applying this patch, install the missing `expo-font` peer dependency and run `npx expo install --fix` to align React Native/TypeScript with SDK 57 before regenerating Android.
