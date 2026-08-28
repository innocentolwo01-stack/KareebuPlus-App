# Kareebu+ v4.0.4 — Test-readiness stabilization

- Fixed the Select Country startup crash by requiring the bundled landmark photography directly in `screens.tsx` instead of depending on a potentially stale `assets.countrySelection` namespace.
- Restored the requested full branded React Native splash as the first screen; the native Android launch layer is now intentionally black + Kareebu mark, then hands off to the exact full splash without an unrelated white frame.
- Removed the app-wide Animated navigation wrapper. Screen changes are synchronous, eliminating the visible Welcome → Country fade/blank-frame lag and preventing stale transition callbacks.
- Splash timer is single-shot and can no longer restart because a navigation callback changed identity.
- Strengthened Android safe zones globally: extra status-bar clearance at the top and navigation/home-indicator clearance at the bottom.
- Bottom navigation now reserves Android navigation-bar space instead of sitting underneath the system controls.
- Standardised functional typography: smaller common header, page title, section title and card title roles throughout the app, with matching reductions on onboarding, Where To and Choose Ride.
- No new native dependency was introduced.
- Added a functional scheduled Ride/Boda picker (30 minutes, tonight, tomorrow morning) and carries the selected schedule into Confirm Booking.
- Replaced the Food "Sort by" placeholder alert with live sorting by fastest delivery, top rating and lowest delivery fee.

- Hardened the native → React Native splash handoff with `expo-splash-screen`: the native layer remains visible until the exact branded React Native splash has laid out, reducing white/blank flashes on cold launch.
- Reworked Android safe-area handling so `ScreenShell` uses explicit Android system-bar clearance instead of relying on the legacy `SafeAreaView` behaviour.
- Reduced remaining oversized custom page/hero titles so functional screens use a tighter, more consistent hierarchy.
- Replaced placeholder trip/referral/receipt share alerts with the device share sheet.
- Added an interactive demo Wallet top-up sheet; balance changes update Home and Wallet for the current session.
- Added `TEST-READINESS-v4.0.4.md` with smoke-test coverage and an explicit list of production-only integrations that remain.
- Kept Ride/Boda payment changes inside the booking flow with an inline payment picker instead of sending the customer away to Wallet.
