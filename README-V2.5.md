# Kareebu+ Premium v2.5

This build applies the black/yellow/red Kareebu+ design system across the customer super app and adds the new first-run and marketplace UX.

## First-run flow
Splash → Welcome → Country → City → Phone → OTP → Profile → Permissions → Home.

Guest browsing remains available from Welcome.

## Brand rules
- Black: primary structure, typography and premium surfaces.
- Red: primary actions, active states and location.
- Yellow: offers, rewards and highlights.
- Green: success/live/verified status only.

## Local development
Normal UI changes can be tested with `npx expo start --dev-client` after the native development build is installed. Maps still require `react-native-maps` and `expo-location` to be present in the installed native binary.
