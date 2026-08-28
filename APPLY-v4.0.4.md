# Apply Kareebu+ v4.0.4

From the local Kareebu+ repository:

```bash
cd "$HOME/Projects/KareebuPlus-Premium-v2.1"
unzip -o "$HOME/Downloads/KareebuPlus-v4.0.4-TestReadiness-Stabilization-Patch.zip" -d .
npm run typecheck
npm run validate
```

Because `app.json` contains the hardened native splash configuration, rebuild the local Android development app once:

```bash
npx expo prebuild --clean --platform android
adb uninstall global.kareebu.plus || true
npx expo run:android
```

After that native rebuild, normal JS/TS iterations can use:

```bash
npx expo start --dev-client --clear
```
