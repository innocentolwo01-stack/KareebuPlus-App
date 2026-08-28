# Kareebu+ v2.8.1 — Google Places Search

- Added Google Places API (New) autocomplete for ride destinations.
- Added Google Places search to the onboarding/delivery location picker.
- Added debounced search after three characters and per-search session tokens.
- Biases predictions around the currently selected East African city and country.
- Selected Places results now carry place ID, display name, formatted address, latitude and longitude through the ride flow.
- Ride confirmation, driver, trip and receipt screens now show the selected destination rather than always assuming Acacia Mall.
- Added a zero-dependency local Node Places proxy for Android emulator testing, keeping the Places server key out of the React Native bundle.
- The uploaded Java/Spring Boot Places helper remains a backend reference and is not bundled into the React Native app.
