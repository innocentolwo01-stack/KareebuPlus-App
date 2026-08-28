# Kareebu+ Premium v2.4 — Uniform UI + Marketplace + Map UX

## Design system

- One product typography hierarchy across onboarding, rides, food, shops, wallet, orders and account.
- Screen titles use one role, section headings use one role, card titles use one role, and body/meta copy use shared roles.
- Removed a number of one-off font sizes that made screens look unrelated.
- Preserved deliberately larger brand/marketing typography only on the splash and welcome experience.

## Marketplace UX

- Added original Kareebu+ promotional carousel patterns inspired by modern food and marketplace discovery behaviour, without copying third-party campaign artwork.
- Added pager dots under campaign carousels.
- Added a dedicated Flash deals merchandising band to Shops.
- Kept Big brands near you, Browse all stores, filters, delivery times and deal cards in one consistent hierarchy.
- Food and Shops now share the same commerce typography and delivery-context treatment.

## Map and location UX

- Kampala now opens at a wider city-level view rather than an overly close crop.
- The square Home map remains interactive and supports pan/pinch zoom.
- Added persistent +, − and recenter controls.
- If location permission is already granted, Home/location maps use the latest known device position automatically.
- The recenter button can request foreground permission and centre on the current device location.
- Location selection shows a contextual precision hint: zoom in when the map is too wide, then tap/drag to place the pin.
- Full location maps are taller and give the map more usable space.
- Ride map modes continue to fit the pickup-to-destination route automatically.

## Native dependency note

This update still uses the native map/location modules introduced in v2.3. A development binary that already contains `react-native-maps` and `expo-location` does not need another native rebuild for these v2.4 JavaScript/UI changes. If the installed emulator binary predates those modules, rebuild locally with `npx expo run:android`.
