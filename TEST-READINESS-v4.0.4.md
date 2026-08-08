# Kareebu+ v4.0.4 — Testing readiness scan

This pass is deliberately focused on stability and testability rather than adding new architecture immediately before tester handoff.

## Fixed for this build

- Select Country no longer depends on `assets.countrySelection`; Uganda/Kenya/Tanzania photos and the East Africa map are direct bundled requires.
- Android system-bar clearance is applied at the shared `ScreenShell`, so page headers and bottom navigation stay away from status/network and navigation/gesture areas.
- Shared page/header typography is smaller and consistent. Large display type is reserved for marketing moments such as Welcome and Splash.
- Native splash stays visible until the first React Native splash frame is laid out, preventing a white/blank handoff frame.
- Screen navigation is synchronous; onboarding no longer uses the old app-wide fade/slide wrapper.
- Ride/Boda scheduling is interactive and carries through to confirmation.
- Ride/Boda payment method can be changed inline without abandoning the booking flow.
- Food sorting changes the restaurant order instead of showing placeholder copy.
- Trip sharing, receipt sharing and invite-a-friend open the device share sheet.
- Wallet top-up is interactive in the demo and updates the displayed balance across Home/Wallet during the session.

## Connected / functional demo paths

- Welcome → Country → City → current/manual location → guest Home or account verification.
- Universal search routes to rides, food, shops, places and app services.
- Photon place autocomplete and Valhalla route calculation remain provider-backed.
- Ride/Boda mode selection, different vehicle tiers, route preview, payment selection, scheduling and driver/trip demo flow.
- Restaurant browse → menu → quantities → cart → order tracking demo.
- Locale-aware shops/storefronts and basket quantities.
- Parcel form/estimate demo.
- Kareebu AI client + server API boundary with a local fallback assistant.

## Still demo-only / production integrations required

- Real account authentication and persisted sessions.
- Persisted onboarding/location/profile state after reinstall/logout.
- Live merchant catalogue, inventory, pricing and store opening hours.
- Production payments/mobile-money authorization and wallet ledger.
- Real driver dispatch, driver calling/chat and emergency/safety providers.
- Real order backend/status events and push notifications.
- Production receipts/invoices and refunds.
- Analytics, crash reporting, support tooling and final accessibility/device matrix QA.

## Tester smoke path

1. Cold launch: black native launch layer should hand directly to the branded Karibu splash without a white frame.
2. Get started: Welcome → Country should switch immediately with no duplicate Welcome screen.
3. Choose Kenya/Tanzania/Uganda, then verify City options and locale-specific Home/Shop content.
4. Test Use my location and manual location.
5. Home: verify top content is below the Android status bar and bottom navigation is above system controls.
6. Ride/Boda: destination → vehicle → schedule → payment → confirmation → trip → share.
7. Food: filter/sort → restaurant → cart → tracking.
8. Shops: local store → product quantities → basket.
9. Wallet: top up and confirm Home/Wallet balance changes in-session.
10. AI: ask a local recommendation and confirm suggested action opens the relevant flow.
