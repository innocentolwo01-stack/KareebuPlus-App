# Kareebu+ v2.9 — Open Maps Provider Layer

- Replaced Google-only destination search wiring with a provider abstraction.
- Photon is now the default free/open place-search provider.
- Added Photon reverse geocoding for manually positioned delivery pins.
- Added Valhalla route calculation with real route distance, ETA and polyline geometry.
- Ride uses Valhalla `auto` routing; Boda uses `motorcycle` with a `motor_scooter` fallback.
- Choose Vehicle, confirmation, driver map, active trip and receipt now consume the same live route estimate.
- Driver/Boda marker simulation can follow the returned route geometry instead of a fixed demo line.
- Added one-flag provider switching: `EXPO_PUBLIC_MAPS_STACK=open|google`.
- Preserved Google Places + Google Routes as an optional fallback through the existing local proxy.
- Added `scripts/openmaps-smoke-test.mjs` and `docs/open-maps-stack.md`.
- No new native dependencies were introduced.
