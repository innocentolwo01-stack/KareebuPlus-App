# Apply Kareebu+ v2.5

From the existing Kareebu+ clone:

```bash
cd ~/Projects/KareebuPlus-Premium-v2.1
unzip -o ~/Downloads/KareebuPlus-v2.5-BrandOnboardingMarketplace-Patch.zip -d .
npm run typecheck
npm run validate
npx expo start --dev-client --clear
```

v2.5 is a JS/TS UI pass and adds no new native dependencies. If the installed development app already contains `react-native-maps` and `expo-location`, no new Android build is required. If you still see `RNMapsAirModule could not be found`, regenerate/install the native app once with `npx expo prebuild --clean --platform android && npx expo run:android`.
