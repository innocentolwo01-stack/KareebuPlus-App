# Kareebu+ Premium v2.3 — Marketplace + Map UX

## Design system
- Standardised product typography into fixed roles: page title, section title, card title, body, small, label, action and button.
- Top-level page titles now share the same 24/30 treatment across compact headers and commerce pages.
- Section headings now share one 20/25 treatment throughout the product.
- Removed several one-off heading sizes that made pages feel visually inconsistent.

## Shops and food
- Added marketplace category carousels inspired by high-density commerce apps, adapted to Kareebu+.
- Added native campaign cards for Weekend Drop, Grocery Saver, Top Deals, Food offers and Kareebu Black perks.
- Added Big brands near you, Browse all stores, filters and Deals for you.
- Added delivery-location entry points and a cart badge.
- Promotions are native UI, so they remain sharp at any screen density instead of relying on screenshot banners.

## Maps and location
- Replaced static map screenshots with `react-native-maps`.
- Home Recent activity includes a square live map preview.
- Added +/- zoom controls and a locate/recentre control.
- Location picker supports pinch zoom, drag, tap-to-place and draggable pin.
- Initial Kampala framing is intentionally wider to avoid the over-zoomed look.
- Ride, driver and trip maps automatically fit the complete route.
- Added `expo-location` foreground location support.

## Local development
This update introduces native map/location packages. Install and rebuild locally; no EAS/Expo cloud build is required.
