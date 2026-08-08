# Kareebu+ v2.5.2 — Onboarding City + Location

- City selection is now a first-class onboarding step after country selection.
- Continue from city selection opens the exact delivery-location map step before phone sign-in.
- Use current location also opens the location step and requests foreground location permission.
- Location picker now uses Kareebu+ branding, delivery header, search, Kampala/city-level map, zoom controls, current-location control, movable pin, confirm CTA and Skip for now.
- Foreground location permission state is persisted into the existing onboarding permissions state.
- Map starts from the selected East African city and recentres to the device when permission is granted.
- No new native dependency was added; expo-location and react-native-maps were already part of the map-enabled project.
