# Kareebu+ open maps stack

Kareebu+ v2.9 separates place search and routing from the mobile screens so the provider can be changed without rewriting Ride, Boda or delivery flows.

## Default development stack

`EXPO_PUBLIC_MAPS_STACK=open` selects:

- Photon for place autocomplete and reverse geocoding.
- Valhalla for route distance, ETA and encoded route geometry.
- `auto` costing for Ride.
- `motorcycle` costing for Boda, with `motor_scooter` as a two-wheel fallback if a deployment rejects motorcycle costing.

The public Photon and Valhalla endpoints are demo/fair-use services. They are suitable for development and testing, not a production SLA. Before launch, point the same environment variables at Kareebu-hosted or contracted instances.

## Provider abstraction

Mobile screens import the stable Kareebu interfaces from:

- `src/places/provider.ts`
- `src/routing/provider.ts`

The app does not call Photon, Valhalla or Google directly from screen components. This keeps location UX independent from the selected provider.

## Switch back to Google

Set:

```env
EXPO_PUBLIC_MAPS_STACK=google
EXPO_PUBLIC_PLACES_PROXY_URL=http://10.0.2.2:8787
```

Then run the optional Google services proxy with server-only keys:

```bash
GOOGLE_PLACES_SERVER_API_KEY='...' \
GOOGLE_ROUTES_SERVER_API_KEY='...' \
node scripts/places-proxy.mjs
```

The same mobile search and route screens then use Google Places + Google Routes without a UI rewrite.

## Smoke test

From the project root:

```bash
node scripts/openmaps-smoke-test.mjs
```

It tests a Photon Kampala search, a Valhalla car route, and a Valhalla motorcycle route.

## Production direction

For production, self-host or contract reliable Photon/Valhalla-compatible endpoints. Keep the app-facing provider interface unchanged. The Kareebu backend should own dispatch, fare policy, surge, safeguarding rules and driver ranking regardless of the map provider.
